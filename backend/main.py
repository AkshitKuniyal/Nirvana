import sys
import time
import types
from pathlib import Path

# Ensure package root is present in sys.path when deployed in Vercel services mode
_this_dir = str(Path(__file__).resolve().parent)
_repo_root = str(Path(__file__).resolve().parent.parent)

for p in [_repo_root, _this_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

# If 'backend' package cannot be found directly (e.g. root is 'backend/'), alias it
try:
    import backend
except ImportError:
    backend_pkg = types.ModuleType("backend")
    backend_pkg.__path__ = [_this_dir]
    sys.modules["backend"] = backend_pkg

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.config import settings

# Routers
from backend.routers.companion import router as companion_router
from backend.routers.memory import router as memory_router
from backend.routers.journal import router as journal_router
from backend.routers.mood import router as mood_router
from backend.routers.wellness import router as wellness_router
from backend.routers.gita import router as gita_router
from backend.routers.insights import router as insights_router
from backend.routers.privacy import router as privacy_router

app = FastAPI(
    title="Nirvana API",
    description="Adaptive Multimodal Mental Wellness & Emotional Support Platform Orchestration Engine",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows dev servers across local ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request duration & safe observability middleware (never logs private conversation bodies)
@app.middleware("http")
async def add_timing_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    response.headers["X-Response-Time"] = f"{duration:.4f}s"
    return response

# Friendly error boundary
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled system event on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Something went quiet for a moment. You can take a breath and try again."}
    )

# Mount domain routers under BOTH /api and root for universal compatibility
domain_routers = [
    companion_router,
    memory_router,
    journal_router,
    mood_router,
    wellness_router,
    gita_router,
    insights_router,
    privacy_router,
]
for r in domain_routers:
    app.include_router(r, prefix="/api")
    app.include_router(r)

@app.get("/")
@app.get("/api")
@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Nirvana Platform Engine",
        "mode": "production-ready",
        "gemini_connected": bool(settings.GEMINI_API_KEY),
        "inworld_connected": bool(settings.INWORLD_API_KEY),
        "supabase_connected": bool(settings.SUPABASE_URL)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main.app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
