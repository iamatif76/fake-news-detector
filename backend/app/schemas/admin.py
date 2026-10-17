from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.schemas.prediction import PredictionOut


class StatsResponse(BaseModel):
    total_predictions: int
    real_count: int
    fake_count: int
    real_percentage: float
    fake_percentage: float
    feedback_correct: int
    feedback_incorrect: int
    user_satisfaction_rate: float
    recent_predictions: List[PredictionOut]
    model_performance: Optional[Dict[str, Any]] = None
