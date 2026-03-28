#!/usr/bin/env python3
"""
Thin CLI wrapper around the JobSpy scraper.
Called by Node.js via child_process.spawn.
Reads JSON args from stdin, writes JSON result to stdout.
All errors go to stderr so stdout stays clean JSON.
"""
import sys
import json

def main():
    try:
        raw = sys.stdin.read()
        args = json.loads(raw)
    except Exception as e:
        json.dump({"error": f"Failed to parse input: {e}"}, sys.stdout)
        sys.exit(1)

    try:
        from enhanced_job_scraper import scrape_jobs_with_filters
        jobs = scrape_jobs_with_filters(
            search_term=args.get("search", ""),
            location=args.get("location", ""),
            sites=args.get("site", "indeed,linkedin"),
            results_per_site=int(args.get("results", 10)),
            days_old=int(args.get("days_old", 7)),
            remote_only=bool(args.get("remote_only", False)),
        )
        json.dump({"success": True, "jobs": jobs, "count": len(jobs)}, sys.stdout, default=str)
    except Exception as e:
        import traceback
        print(traceback.format_exc(), file=sys.stderr)
        json.dump({"success": False, "error": str(e), "jobs": [], "count": 0}, sys.stdout)

if __name__ == "__main__":
    main()
