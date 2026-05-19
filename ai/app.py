import os
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.predictor import FailurePredictor

from contextlib import asynccontextmanager
import asyncio
import signal

startup_complete = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    global startup_complete
    # Simulate loading model weights or initialization
    startup_complete = True
    print("[AI Service] Startup complete, ready to accept requests.")
    yield
    print("[AI Service] Shutting down gracefully...")

app = FastAPI(title="DevPulse AI Service", lifespan=lifespan)
predictor = FailurePredictor()

class RepositoryMetadata(BaseModel):
    id: int
    name: str
    fullName: str
    language: Optional[str] = None
    openIssuesCount: int
    stargazersCount: int
    updatedAt: str
    size: int

class AnalysisRequest(BaseModel):
    repository: RepositoryMetadata
    securityScan: Optional[dict] = None

class SecuritySummary(BaseModel):
    critical: int
    high: int
    medium: int
    low: int
    unknown: int

class SecurityScan(BaseModel):
    status: str
    severityScore: float
    summary: SecuritySummary
    vulnerabilities: List[dict]

class PredictionResult(BaseModel):
    probability: float
    label: str
    rationale: str

class AnalysisResponse(BaseModel):
    riskScore: int
    decision: str
    failurePrediction: PredictionResult
    securityScan: SecurityScan
    suggestions: List[str]
    generatedAt: str
    source: str

@app.get("/health/startup")
async def health_startup():
    if startup_complete:
        return {"status": "started"}
    raise HTTPException(status_code=503, detail="starting")

@app.get("/health/live")
async def health_live():
    return {"status": "alive", "timestamp": datetime.utcnow().isoformat()}

@app.get("/health/ready")
async def health_ready():
    # Model is loaded in predictor by default
    return {
        "status": "ready",
        "checks": {"model": "ok"},
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/model-info")
async def model_info():
    """Returns metadata about the predictor for transparency and debugging."""
    return predictor.model_info()

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: AnalysisRequest):
    try:
        result = predictor.predict(request.repository, request.securityScan)
        return {
            **result,
            "generatedAt": datetime.utcnow().isoformat(),
            "source": "devpulse-ai-v1"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
