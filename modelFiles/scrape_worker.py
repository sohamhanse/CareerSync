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
import sys


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

        df = scrape_jobs(
            site_name=args.get("site_names", ["linkedin"]),
            search_term=args["search_term"],
            location=args.get("location", "India"),
            results_wanted=args.get("results_wanted", 50),
            country_indeed=args.get("country_indeed", "india"),
        )

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
