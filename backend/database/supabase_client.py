"""
Supabase client singleton for Nirvana backend.
Uses the service-role key so server-side operations bypass RLS safely.
"""
from supabase import create_client, Client
from backend.config import settings

_client: Client | None = None

def get_supabase() -> Client:
    global _client
    if _client is None:
        url = settings.SUPABASE_URL
        role_key = settings.SUPABASE_SERVICE_ROLE_KEY
        if role_key and ("truncated" in role_key or "..." in role_key):
            role_key = None
        key = role_key or settings.SUPABASE_ANON_KEY

        if not url or not key:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY must be set in .env"
            )

        # Strip /rest/v1/ suffix if accidentally included in .env
        url = url.rstrip("/")
        if url.endswith("/rest/v1"):
            url = url[: -len("/rest/v1")]

        _client = create_client(url, key)
    return _client

