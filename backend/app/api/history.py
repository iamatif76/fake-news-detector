from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.prediction import Prediction
from app.models.user import User
from app.schemas.prediction import PredictionOut
from app.api.deps import get_optional_current_user

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=List[PredictionOut])
def get_prediction_history(
    limit: int = 50,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetches prediction history.
    - If user is authenticated, returns their personal prediction history.
    - If guest, returns the latest public predictions.
    """
    query = db.query(Prediction)
    if current_user:
        query = query.filter(Prediction.user_id == current_user.id)
    
    predictions = query.order_by(Prediction.created_at.desc()).limit(limit).all()
    return predictions
