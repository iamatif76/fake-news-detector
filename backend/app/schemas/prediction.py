from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime


class InfluentialWord(BaseModel):
    word: str
    weight: float
    direction: str  # "fake" or "real"


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=100000, description="News headline or full article text to analyze")


class PredictResponse(BaseModel):
    id: int
    prediction: str              # "REAL" or "FAKE"
    confidence: float            # 0.0 to 100.0 percentage
    model_name: str
    processing_time_ms: float
    top_words: List[InfluentialWord]
    user_feedback: Optional[str] = None
    created_at: datetime


class FeedbackRequest(BaseModel):
    prediction_id: int
    feedback: str = Field(..., pattern="^(CORRECT|INCORRECT)$")


class PredictionOut(BaseModel):
    id: int
    raw_text: str
    prediction: str
    confidence: float
    model_name: str
    processing_time_ms: float
    top_words: Optional[str]
    user_feedback: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
