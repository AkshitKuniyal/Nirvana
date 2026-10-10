import sys
import time
from pathlib import Path

# Ensure package root is present in sys.path when deployed in Vercel services mode with root="backend"
_root = str(Path(__file__).resolve().parent.parent)
if _root not in sys.path:
    sys.path.insert(0, _root)

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
    version="1.0.0"
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

# Mount domain routers
app.include_router(companion_router)
app.include_router(memory_router)
app.include_router(journal_router)
app.include_router(mood_router)
app.include_router(wellness_router)
app.include_router(gita_router)
app.include_router(insights_router)
app.include_router(privacy_router)

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
