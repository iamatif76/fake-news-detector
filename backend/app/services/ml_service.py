import os
import time
import json
import joblib
import numpy as np
from typing import Tuple, List, Dict, Any
from app.services.text_cleaner import preprocess_text

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models")

MODEL_FILE = os.path.join(SAVED_MODELS_DIR, "best_model.joblib")
VECTORIZER_FILE = os.path.join(SAVED_MODELS_DIR, "tfidf_vectorizer.joblib")
METRICS_FILE = os.path.join(SAVED_MODELS_DIR, "model_performance.json")


class MLInferenceService:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.model_performance = None
        self.model_name = "Logistic Regression"
        self._load_artifacts()

    def _load_artifacts(self):
        """Loads serialized model, vectorizer, and performance metadata."""
        if not os.path.exists(MODEL_FILE) or not os.path.exists(VECTORIZER_FILE):
            print(f"[Warning] ML model files not found in {SAVED_MODELS_DIR}. Inference will be unavailable until trained.")
            return

        try:
            self.model = joblib.load(MODEL_FILE)
            self.vectorizer = joblib.load(VECTORIZER_FILE)
            print(f"[INFO] ML Model & TF-IDF Vectorizer loaded successfully.")
        except Exception as e:
            print(f"[Error] Failed to load ML model artifacts: {e}")

        if os.path.exists(METRICS_FILE):
            try:
                with open(METRICS_FILE, "r", encoding="utf-8") as f:
                    self.model_performance = json.load(f)
                    self.model_name = self.model_performance.get("best_model", "Logistic Regression")
            except Exception as e:
                print(f"[Warning] Could not load model_performance.json: {e}")

    def is_ready(self) -> bool:
        return self.model is not None and self.vectorizer is not None

    def predict(self, raw_text: str) -> Dict[str, Any]:
        """
        Processes news text and returns prediction classification, confidence,
        influential tokens, and execution latency.
        """
        start_time = time.perf_counter()

        if not self.is_ready():
            self._load_artifacts()
            if not self.is_ready():
                raise RuntimeError("ML model has not been loaded. Please run model training first.")

        # 1. Clean input text
        cleaned_text = preprocess_text(raw_text)
        if not cleaned_text:
            cleaned_text = raw_text.lower().strip()

        # 2. Vectorize
        tfidf_vec = self.vectorizer.transform([cleaned_text])

        # 3. Predict & Confidence Calculation
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(tfidf_vec)[0]
            pred_class = int(np.argmax(probs))
            confidence = float(probs[pred_class]) * 100.0
        elif hasattr(self.model, "decision_function"):
            decision = float(self.model.decision_function(tfidf_vec)[0])
            pred_class = 1 if decision > 0 else 0
            # Sigmoid approximation of decision value to get percentage confidence
            prob_1 = 1.0 / (1.0 + np.exp(-decision))
            confidence = (prob_1 if pred_class == 1 else (1.0 - prob_1)) * 100.0
        else:
            pred_class = int(self.model.predict(tfidf_vec)[0])
            confidence = 85.0

        prediction_label = "FAKE" if pred_class == 1 else "REAL"

        # 4. Extract Top Influential Words
        top_words = self._extract_influential_words(tfidf_vec, top_k=6)

        elapsed_ms = round((time.perf_counter() - start_time) * 1000.0, 2)

        return {
            "prediction": prediction_label,
            "confidence": round(confidence, 2),
            "model_name": self.model_name,
            "processing_time_ms": elapsed_ms,
            "cleaned_text": cleaned_text,
            "top_words": top_words
        }

    def _extract_influential_words(self, tfidf_vec, top_k: int = 6) -> List[Dict[str, Any]]:
        """Identifies tokens in the input text that contributed most to the prediction."""
        try:
            feature_names = np.array(self.vectorizer.get_feature_names_out())
            row = tfidf_vec.tocoo()
            if row.nnz == 0:
                return []

            if hasattr(self.model, "coef_"):
                weights = self.model.coef_[0]
            elif hasattr(self.model, "feature_log_prob_"):
                weights = self.model.feature_log_prob_[1] - self.model.feature_log_prob_[0]
            else:
                weights = np.ones(len(feature_names))

            contributions = []
            for col_idx, tfidf_val in zip(row.col, row.data):
                word = feature_names[col_idx]
                w = weights[col_idx]
                contrib = float(w * tfidf_val)
                contributions.append({
                    "word": word,
                    "weight": round(abs(contrib), 4),
                    "direction": "fake" if contrib >= 0 else "real"
                })

            contributions.sort(key=lambda x: x["weight"], reverse=True)
            return contributions[:top_k]
        except Exception:
            return []


# Singleton service instance
ml_service = MLInferenceService()
