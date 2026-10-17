from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.prediction import Prediction
from app.schemas.prediction import FeedbackRequest

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.post("")
def submit_feedback(feedback_in: FeedbackRequest, db: Session = Depends(get_db)):
    """
    Records whether a user considered a specific prediction correct or incorrect.
    Enables tracking of live real-world accuracy on the admin dashboard.
    """
    prediction = db.query(Prediction).filter(Prediction.id == feedback_in.prediction_id).first()
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found."
        )

    prediction.user_feedback = feedback_in.feedback
    db.commit()
    db.refresh(prediction)

    return {
        "status": "success",
        "message": f"Feedback '{feedback_in.feedback}' registered for prediction #{prediction.id}."
    }
