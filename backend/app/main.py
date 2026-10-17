from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import Base, engine
from app.api import api_router
from app.services.ml_service import ml_service
import app.models  # Ensure all SQLAlchemy models are registered

# Ensure tables exist immediately on import
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[STARTUP] ML Model Ready: {ml_service.is_ready()} ({ml_service.model_name})")
    yield
    print("[SHUTDOWN] Server shutting down cleanly.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade AI/ML API for real-time fake news detection with NLP explainability and administrative telemetry.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all local Vite & deployed frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "docs_url": "/docs",
        "model_loaded": ml_service.is_ready(),
        "model_name": ml_service.model_name
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "model_ready": ml_service.is_ready(),
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
