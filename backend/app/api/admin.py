import io
import csv
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.prediction import Prediction
from app.schemas.admin import StatsResponse
from app.services.ml_service import ml_service
from app.api.deps import get_optional_current_user

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


@router.get("/stats", response_model=StatsResponse)
def get_admin_stats(db: Session = Depends(get_db)):
    """
    Returns aggregate platform statistics for the administrator analytics dashboard:
    - Total, fake, and real counts
    - Real-world user feedback accuracy
    - Latest 10 predictions
    - Model comparison performance metrics
    """
    total = db.query(Prediction).count()
    real_count = db.query(Prediction).filter(Prediction.prediction == "REAL").count()
    fake_count = db.query(Prediction).filter(Prediction.prediction == "FAKE").count()

    correct_feedback = db.query(Prediction).filter(Prediction.user_feedback == "CORRECT").count()
    incorrect_feedback = db.query(Prediction).filter(Prediction.user_feedback == "INCORRECT").count()
    total_feedback = correct_feedback + incorrect_feedback

    satisfaction_rate = round((correct_feedback / total_feedback * 100.0), 2) if total_feedback > 0 else 100.0

    recent_preds = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(10).all()

    real_pct = round((real_count / total * 100.0), 2) if total > 0 else 50.0
    fake_pct = round((fake_count / total * 100.0), 2) if total > 0 else 50.0

    return {
        "total_predictions": total,
        "real_count": real_count,
        "fake_count": fake_count,
        "real_percentage": real_pct,
        "fake_percentage": fake_pct,
        "feedback_correct": correct_feedback,
        "feedback_incorrect": incorrect_feedback,
        "user_satisfaction_rate": satisfaction_rate,
        "recent_predictions": recent_preds,
        "model_performance": ml_service.model_performance
    }


@router.get("/export")
def export_predictions_csv(db: Session = Depends(get_db)):
    """
    Exports all predictions as a downloadable CSV dataset for audit,
    retraining, and academic presentation demonstration.
    """
    predictions = db.query(Prediction).order_by(Prediction.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        "ID", "User ID", "Prediction", "Confidence (%)", "Model Name",
        "Processing Time (ms)", "User Feedback", "Created At", "Snippet"
    ])

    for p in predictions:
        snippet = (p.raw_text[:120] + "...").replace("\n", " ") if p.raw_text else ""
        writer.writerow([
            p.id,
            p.user_id or "Guest",
            p.prediction,
            p.confidence,
            p.model_name,
            p.processing_time_ms,
            p.user_feedback or "None",
            p.created_at.strftime("%Y-%m-%d %H:%M:%S") if p.created_at else "",
            snippet
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=fake_news_predictions.csv"}
    )
