from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
from app.api.endpoints import router as ai_router

app = FastAPI(
    title="ASL Bridge AI Service",
    description="Multimodal Context-Aware American Sign Language Translation & RAG Microservice",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    return response

# Include endpoints
app.include_router(ai_router, prefix="/ai", tags=["AI & Translation"])

@app.get("/health")
def root_health():
    return {
        "status": "healthy",
        "service": "asl-bridge-ai-service",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
