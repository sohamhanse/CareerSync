"""
FastAPI backend for CareerSync resume analysis.
Connects frontend uploads to the ConvDeepFM recommendation engine.

Run:
    cd Backend
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

import asyncio
import os
import sys
import tempfile
import traceback
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))  # loads .env from Backend/

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ── Resolve paths ───────────────────────────────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(PROJECT_ROOT, "modelFiles")

_required_files = ["convdeepfm_best.pth", "convdeepfm_meta.pth", "label_encoders.pkl", "engine.py"]
for _f in _required_files:
    _path = os.path.join(MODEL_DIR, _f)
    if not os.path.isfile(_path):
        raise FileNotFoundError(
            f"Required model file not found: {_path}\n"
            f"MODEL_DIR resolved to: {MODEL_DIR}\n"
            f"Make sure Backend/ and modelFiles/ are sibling directories."
        )

if MODEL_DIR not in sys.path:
    sys.path.insert(0, MODEL_DIR)

from engine import ConvDeepFMJobRecommender  # noqa: E402

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# ── Lifespan: load model on startup ────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    groq_key = os.environ.get("GROQ_API_KEY", "").strip()
    print(f"[startup] GROQ_API_KEY loaded: {'yes (' + groq_key[:8] + '...)' if groq_key else 'NO — check .env file'}")
    print(f"[startup] Loading model from {MODEL_DIR} ...")
    try:
        app.state.engine = ConvDeepFMJobRecommender(
            model_dir=MODEL_DIR,
            groq_api_key=groq_key,
        )
        print("[startup] Model loaded successfully!")
    except Exception as e:
        print(f"[startup] FAILED to load model: {e}")
        traceback.print_exc()
        app.state.engine = None
    yield
    print("[shutdown] Server stopping.")


# ── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(title="CareerSync ML API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health check ────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": app.state.engine is not None,
    }


# ── Resume analysis endpoint ───────────────────────────────────────────────
@app.post("/analyze-resume")
async def analyze_resume(
    resume: UploadFile = File(...),
    location: str = Form("India"),
    num_jobs: int = Form(100),
    top_k: int = Form(15),
):
    """
    Accept a resume file (PDF/DOCX), run it through the ConvDeepFM pipeline,
    and return structured job recommendations.
    """
    engine = app.state.engine
    if engine is None:
        return JSONResponse(
            status_code=503,
            content={"success": False, "error": "Model not loaded. Check server logs and restart."}
        )

    # ── Validate file ───────────────────────────────────────────────────────
    filename = resume.filename or ""
    ext = os.path.splitext(filename)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": f"Invalid file type '{ext}'. Accepted: .pdf, .docx, .doc"}
        )

    content = await resume.read()

    if len(content) == 0:
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": "Empty file uploaded. Please upload a valid resume."}
        )

    if len(content) > MAX_FILE_SIZE:
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": f"File too large ({len(content) // 1024}KB). Maximum: {MAX_FILE_SIZE // (1024 * 1024)}MB."}
        )

    # ── Save to temp file and process ───────────────────────────────────────
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext, dir=tempfile.gettempdir()) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        resume_type = "pdf" if ext == ".pdf" else "docx"

        print(f"\n[API] analyze-resume request: file={filename}, type={resume_type}, location={location}, num_jobs={num_jobs}, top_k={top_k}")
        print(f"[API] Running pipeline in background thread via asyncio.to_thread ...")

        # Run in thread to avoid blocking the event loop and to let
        # the sync Groq httpx client work correctly
        import time as _time
        _t0 = _time.time()
        result = await asyncio.to_thread(
            engine.recommend_from_resume,
            tmp_path,
            resume_type,
            location,
            num_jobs,
            top_k,
            0.05,
            ["linkedin"],
        )
        print(f"[API] Pipeline finished in {_time.time()-_t0:.1f}s — result={'OK' if result else 'None'}")

        if result is None:
            return {
                "success": True,
                "jobs": [],
                "total_analyzed": 0,
                "candidate_domain": "",
                "candidate_skills_count": 0,
                "parse_source": "",
                "error": "No job recommendations found. Try a different location or resume.",
            }

        # ── Format response to match frontend RecommendationResponse ────────
        user_profile = result["user_profile"]
        jobs = []

        for rec in result["recommendations"]:
            job = rec["job"]
            exp_raw = job.get("required_experience")
            if exp_raw is not None and exp_raw > 0:
                experience_str = f"{exp_raw}+ years required"
            else:
                experience_str = "Not specified"

            jobs.append({
                "role":             job.get("title", ""),
                "company":          job.get("company", ""),
                "description":      str(job.get("description", ""))[:300],
                "experience":       experience_str,
                "location":         job.get("location", "") or "Not specified",
                "salary":           None,
                "apply_link":       job.get("job_url", "#"),
                "posted_at":        job.get("date_posted", ""),
                "match_score":      round(rec["final_score"] * 100),
                "matching_skills":  rec.get("matching_skills", []),
                "missing_skills":   rec.get("missing_skills", []),
            })

        return {
            "success":                True,
            "jobs":                   jobs,
            "total_analyzed":         result.get("total_jobs_analyzed", 0),
            "candidate_domain":       user_profile.get("domain", ""),
            "candidate_skills_count": len(user_profile.get("skills", [])),
            "parse_source":           user_profile.get("parse_source", ""),
        }

    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": str(e)}
        )
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"Model processing failed: {str(e)}"}
        )
    finally:
        if tmp_path:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass


# ── Direct run ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
