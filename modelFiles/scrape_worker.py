"""
Standalone job-scraping subprocess worker.

Runs jobspy in its own process to avoid DLL conflicts with PyTorch on Windows.
Called by engine.py via subprocess. Communicates via JSON over stdin/stdout.

Input (stdin):  JSON with keys: site_names, search_term, location, results_wanted, country_indeed
Output (stdout): {"success": true, "jobs": [...]} or {"success": false, "error": "..."}

CRITICAL: stdout is reserved for the single JSON result line only.
          All diagnostics are written to stderr so they don't corrupt the JSON output.
NO imports of torch, sentence_transformers, or sklearn — isolation is the point.
"""

import json
import os
import sys

# Prefer the local fork of JobSpy at <repo_root>/JobSpy over the (older,
# broken) `jobspy` package installed in Backend/venv. The bundled fork
# supports indeed/linkedin/glassdoor/google/zip_recruiter/bayt/naukri and
# fixes the 403 errors from the old Indeed scraper.
_HERE = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.dirname(_HERE)
_LOCAL_JOBSPY = os.path.join(_REPO_ROOT, "JobSpy")
if os.path.isdir(os.path.join(_LOCAL_JOBSPY, "jobspy")) and _LOCAL_JOBSPY not in sys.path:
    sys.path.insert(0, _LOCAL_JOBSPY)


def _err(msg: str) -> None:
    """Write a diagnostic message to stderr (never stdout — stdout is JSON-only)."""
    print(f"[scrape_worker] {msg}", file=sys.stderr, flush=True)


def main():
    # Read params from stdin
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            json.dump({"success": False, "error": "No input provided"}, sys.stdout)
            sys.stdout.flush()
            return
        args = json.loads(raw)
    except json.JSONDecodeError as e:
        json.dump({"success": False, "error": f"Invalid JSON: {e}"}, sys.stdout)
        sys.stdout.flush()
        return

    try:
        from jobspy import scrape_jobs

        _err(f"Scraping '{args.get('search_term')}' on {args.get('site_names')} "
             f"in {args.get('location')} (want {args.get('results_wanted')} results)")

        # Build kwargs, only including optional params when provided
        kwargs = dict(
            site_name=args.get("site_names", ["linkedin"]),
            search_term=args["search_term"],
            location=args.get("location", "India"),
            results_wanted=args.get("results_wanted", 50),
            country_indeed=args.get("country_indeed", "india"),
        )

        # Optional JobSpy parameters — only pass if caller provided them
        if args.get("hours_old") is not None:
            kwargs["hours_old"] = int(args["hours_old"])
        if args.get("job_type"):
            kwargs["job_type"] = args["job_type"]  # fulltime, parttime, internship, contract
        if args.get("is_remote") is not None:
            kwargs["is_remote"] = bool(args["is_remote"])
        if args.get("easy_apply") is not None:
            kwargs["easy_apply"] = bool(args["easy_apply"])
        if args.get("linkedin_fetch_description"):
            kwargs["linkedin_fetch_description"] = True
        if args.get("description_format"):
            kwargs["description_format"] = args["description_format"]  # markdown or html
        if args.get("offset") is not None:
            kwargs["offset"] = int(args["offset"])
        if args.get("verbose") is not None:
            kwargs["verbose"] = int(args["verbose"])
        if args.get("distance") is not None:
            kwargs["distance"] = int(args["distance"])
        if args.get("linkedin_company_ids"):
            kwargs["linkedin_company_ids"] = args["linkedin_company_ids"]
        if args.get("google_search_term"):
            kwargs["google_search_term"] = args["google_search_term"]
        if args.get("enforce_annual_salary"):
            kwargs["enforce_annual_salary"] = True
        if args.get("proxies"):
            kwargs["proxies"] = args["proxies"]
        if args.get("user_agent"):
            kwargs["user_agent"] = args["user_agent"]

        _err(f"JobSpy kwargs: { {k: v for k, v in kwargs.items() if k != 'proxies'} }")

        try:
            df = scrape_jobs(**kwargs)
        except TypeError as e:
            # Some versions of jobspy don't support all optional params.
            # Retry with only the essential params.
            _err(f"TypeError with full kwargs: {e}")
            _err("Retrying with core params only ...")
            core_kwargs = dict(
                site_name=kwargs["site_name"],
                search_term=kwargs["search_term"],
                location=kwargs.get("location", "India"),
                results_wanted=kwargs.get("results_wanted", 50),
            )
            df = scrape_jobs(**core_kwargs)

        if df is not None and len(df) > 0:
            _err(f"Raw results: {len(df)} rows")
            # Convert NaN/NaT to None for JSON serialisation
            df = df.where(df.notnull(), None)
            # Convert date columns to strings
            for col in df.columns:
                if hasattr(df[col], "dt"):
                    df[col] = df[col].astype(str)
            records = df.to_dict("records")
            _err(f"Returning {len(records)} jobs")
            json.dump({"success": True, "jobs": records}, sys.stdout, default=str)
            sys.stdout.flush()
        else:
            _err("No results returned by jobspy")
            json.dump({"success": True, "jobs": []}, sys.stdout)
            sys.stdout.flush()

    except Exception as e:
        import traceback
        _err(f"Exception: {e}\n{traceback.format_exc()}")
        json.dump({"success": False, "error": str(e)}, sys.stdout)
        sys.stdout.flush()


if __name__ == "__main__":
    main()
