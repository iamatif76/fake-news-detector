import json
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.prediction import Prediction
from app.models.user import User
from app.schemas.prediction import PredictRequest, PredictResponse, InfluentialWord
from app.services.ml_service import ml_service
from app.utils.rate_limiter import rate_limiter
from app.api.deps import get_optional_current_user

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("", response_model=PredictResponse)
def analyze_news(
    predict_req: PredictRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Analyzes input news text using NLP and machine learning.
    Predicts REAL or FAKE, calculates confidence, highlights influential words,
    and logs the transaction to SQLite.
    """
    # 1. Check Rate Limit
    rate_limiter.check_rate_limit(request)

    text = predict_req.text.strip()
    if len(text) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text is too short. Please provide at least 10 characters."
        )

    # 2. Run ML Inference
    try:
        result = ml_service.predict(text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )

    # 3. Save to Database
    db_prediction = Prediction(
        user_id=current_user.id if current_user else None,
        raw_text=text[:2000],  # Store first 2000 chars for audit/history
        cleaned_text=result["cleaned_text"][:2000],
        prediction=result["prediction"],
        confidence=result["confidence"],
        model_name=result["model_name"],
        top_words=json.dumps(result["top_words"]),
        processing_time_ms=result["processing_time_ms"],
        user_feedback=None
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    # 4. Construct Response
    return {
        "id": db_prediction.id,
        "prediction": db_prediction.prediction,
        "confidence": db_prediction.confidence,
        "model_name": db_prediction.model_name,
        "processing_time_ms": db_prediction.processing_time_ms,
        "top_words": [InfluentialWord(**w) for w in result["top_words"]],
        "user_feedback": db_prediction.user_feedback,
        "created_at": db_prediction.created_at
    }
