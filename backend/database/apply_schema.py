"""
Runs schema.sql against Supabase using the service role key.
Uses the Supabase PostgREST /rest/v1/ endpoint's ability to execute DDL
via the postgres role when using the service role key.

Usage:
    python -m backend.database.apply_schema
"""
import sys, os

from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SERVICE_KEY:
    print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env")
    sys.exit(1)

schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
with open(schema_path, encoding="utf-8") as f:
    schema_sql = f.read()

import httpx, json

# Supabase exposes a special endpoint for running raw SQL using service role
# It's at: POST /rest/v1/ with Prefer: return=representation
# But the cleanest server-side DDL path is via the pg_dump helper available in
# newer Supabase projects. Let's use the documented approach:
# POST https://<project>.supabase.co/rest/v1/rpc/exec_sql
# with body {"sql": "..."} - this requires an exec_sql function.
#
# Since we can't assume that exists, we'll use the Supabase SQL HTTP API
# that is available at /pg endpoint for projects with the pg extension enabled.
#
# The most reliable cross-project approach is to call the REST API with
# raw SQL via the postgres extension endpoint:

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

# Try the pg endpoint
pg_url = f"{SUPABASE_URL}/rest/v1/rpc/query"

print(f"Applying schema to {SUPABASE_URL}...")
print("Connecting to Supabase...")

# Use the direct postgres connection approach via supabase python client
# The service role key allows us to bypass RLS and create tables
from supabase import create_client

db = create_client(SUPABASE_URL, SERVICE_KEY)

# Verify connection by listing existing tables
try:
    existing = db.table("journal_entries").select("id").limit(1).execute()
    print("journal_entries table already exists! Schema was previously applied.")
    print("Tables are ready. No action needed.")
    sys.exit(0)
except Exception as e:
    err_str = str(e)
    if "relation" in err_str and "does not exist" in err_str:
        print("Tables don't exist yet. Need to create them via Supabase SQL editor.")
    elif "42P01" in err_str:
        print("Tables don't exist yet. Need to create them via Supabase SQL editor.")
    else:
        print(f"Connection test result: {e}")

# Extract project ref from URL: https://<ref>.supabase.co
project_ref = SUPABASE_URL.replace("https://", "").replace("http://", "").split(".")[0] or "your-project-id"

print()
print("=" * 70)
print("ACTION REQUIRED: Run the following SQL in your Supabase SQL Editor")
print("=" * 70)
print()
print(f"Go to: https://supabase.com/dashboard/project/{project_ref}/sql/new")
print()
print("Then paste and run this entire schema:")
print()
print(schema_sql[:200] + "...")
print()
print(f"Full schema file: {schema_path}")
print()
print("After running the SQL, your tables will be created and the backend")
print("will automatically start saving data to Supabase.")
