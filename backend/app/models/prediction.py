from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    # Store snippet of raw text and clean text
    raw_text = Column(Text, nullable=False)
    cleaned_text = Column(Text, nullable=True)
    
    # Prediction results
    prediction = Column(String(50), nullable=False)  # "REAL" or "FAKE"
    confidence = Column(Float, nullable=False)       # 0.0 to 1.0 (or percentage)
    model_name = Column(String(100), nullable=False)
    top_words = Column(Text, nullable=True)          # JSON string of influential words
    processing_time_ms = Column(Float, nullable=False)
    
    # User feedback: "CORRECT", "INCORRECT", or None
    user_feedback = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="predictions")
