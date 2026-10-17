import os
import shutil
import json
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression, PassiveAggressiveClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

# Configuration Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "cleaned_news.csv")
ML_SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models")
BACKEND_SAVED_MODELS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "backend", "saved_models"))
PLOTS_DIR = os.path.join(BASE_DIR, "plots")

os.makedirs(ML_SAVED_MODELS_DIR, exist_ok=True)
os.makedirs(BACKEND_SAVED_MODELS_DIR, exist_ok=True)
os.makedirs(PLOTS_DIR, exist_ok=True)


def train_and_evaluate():
    """
    Executes Phase 3:
    1. Loads processed dataset.
    2. Splits into stratified train and test sets (80/20).
    3. Transforms text using TF-IDF (unigrams + bigrams, max_features=10000).
    4. Trains Logistic Regression, Multinomial Naive Bayes, PassiveAggressiveClassifier.
    5. Computes Accuracy, Precision, Recall, F1-score, and Confusion Matrices.
    6. Selects the champion model based on highest F1-score.
    7. Exports artifacts (.joblib, .json, and visualization charts).
    """
    print("\n--- [PHASE 3: Model Training, Evaluation & Serialization] ---")
    
    if not os.path.exists(PROCESSED_DATA_PATH):
        raise FileNotFoundError(f"Cleaned dataset not found at: {PROCESSED_DATA_PATH}. Run prepare_dataset.py first!")

    print(f"[INFO] Loading processed data from {PROCESSED_DATA_PATH}...")
    df = pd.read_csv(PROCESSED_DATA_PATH)
    df["cleaned_text"] = df["cleaned_text"].fillna("")
    
    X = df["cleaned_text"]
    y = df["label"].astype(int)
    
    print(f"Total samples: {len(df):,} (Real: {(y == 0).sum():,}, Fake: {(y == 1).sum():,})")

    # 1. Stratified Train / Test Split
    print("[INFO] Performing 80/20 stratified train/test split...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training set: {len(X_train)} samples | Testing set: {len(X_test)} samples")

    # 2. TF-IDF Feature Extraction
    print("[INFO] Fitting TF-IDF Vectorizer (ngram_range=(1,2), max_features=10000)...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=10000,
        sublinear_tf=True
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    print(f"Vocabulary size: {len(vectorizer.vocabulary_):,} features")

    # 3. Model Definitions
    candidate_models = {
        "Logistic Regression": LogisticRegression(
            C=1.0, max_iter=1000, random_state=42
        ),
        "Multinomial Naive Bayes": MultinomialNB(
            alpha=0.1
        ),
        "PassiveAggressiveClassifier": PassiveAggressiveClassifier(
            max_iter=1000, random_state=42, C=0.5
        )
    }

    results = {}
    best_f1 = -1.0
    best_model_name = None
    best_model_obj = None
    best_cm = None

    print("\n[INFO] Training and evaluating candidate models:")
    
    for name, model in candidate_models.items():
        print(f"\n>> Training: {name}...")
        model.fit(X_train_tfidf, y_train)
        
        y_pred = model.predict(X_test_tfidf)
        
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        print(f"   Accuracy : {acc * 100:.2f}%")
        print(f"   Precision: {prec * 100:.2f}%")
        print(f"   Recall   : {rec * 100:.2f}%")
        print(f"   F1-Score : {f1 * 100:.2f}%")
        
        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm,
            "classification_report": classification_report(y_test, y_pred, output_dict=True, zero_division=0)
        }

        # Track the champion model
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model_obj = model
            best_cm = cm

    print(f"\n[CHAMPION MODEL]: {best_model_name} with F1-Score of {best_f1 * 100:.2f}%")

    # 4. Generate Confusion Matrix Plot for Champion Model
    plt.figure(figsize=(6, 5))
    cm_array = np.array(best_cm)
    sns.heatmap(
        cm_array,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=["Real (0)", "Fake (1)"],
        yticklabels=["Real (0)", "Fake (1)"],
        cbar=False
    )
    plt.title(f"Confusion Matrix: {best_model_name}", fontsize=13, fontweight="bold", pad=12)
    plt.xlabel("Predicted Label", fontsize=11)
    plt.ylabel("True Label", fontsize=11)
    plt.tight_layout()
    cm_path = os.path.join(PLOTS_DIR, "confusion_matrix.png")
    plt.savefig(cm_path, dpi=300)
    plt.close()

    # 5. Generate Model Comparison Bar Chart
    plt.figure(figsize=(9, 5))
    model_names = list(results.keys())
    f1_scores = [results[m]["f1_score"] * 100 for m in model_names]
    accuracies = [results[m]["accuracy"] * 100 for m in model_names]
    
    x = np.arange(len(model_names))
    width = 0.35

    plt.bar(x - width/2, accuracies, width, label='Accuracy (%)', color='#3b82f6')
    plt.bar(x + width/2, f1_scores, width, label='F1-Score (%)', color='#10b981')

    plt.ylabel('Score (%)', fontsize=11)
    plt.title('Performance Comparison Across Candidate ML Models', fontsize=13, fontweight='bold', pad=12)
    plt.xticks(x, model_names, fontsize=10)
    plt.ylim([0, 105])
    plt.legend(loc='lower right')
    plt.grid(axis='y', linestyle='--', alpha=0.5)
    plt.tight_layout()
    comp_path = os.path.join(PLOTS_DIR, "model_comparison_bar.png")
    plt.savefig(comp_path, dpi=300)
    plt.close()

    # 6. Save Artifacts (joblib & json)
    best_model_file = os.path.join(ML_SAVED_MODELS_DIR, "best_model.joblib")
    vectorizer_file = os.path.join(ML_SAVED_MODELS_DIR, "tfidf_vectorizer.joblib")
    metrics_file = os.path.join(ML_SAVED_MODELS_DIR, "model_performance.json")

    joblib.dump(best_model_obj, best_model_file)
    joblib.dump(vectorizer, vectorizer_file)

    payload = {
        "best_model": best_model_name,
        "best_f1_score": round(best_f1, 4),
        "vocabulary_size": len(vectorizer.vocabulary_),
        "test_sample_count": len(X_test),
        "train_sample_count": len(X_train),
        "models": results
    }

    with open(metrics_file, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=4)

    # 7. Mirror Artifacts to Backend Directory
    for filename in ["best_model.joblib", "tfidf_vectorizer.joblib", "model_performance.json"]:
        src = os.path.join(ML_SAVED_MODELS_DIR, filename)
        dst = os.path.join(BACKEND_SAVED_MODELS_DIR, filename)
        shutil.copyfile(src, dst)

    print(f"\n[SUCCESS] Artifacts successfully serialized:")
    print(f" - Best Model ({best_model_name}): {best_model_file}")
    print(f" - TF-IDF Vectorizer: {vectorizer_file}")
    print(f" - Performance Metrics: {metrics_file}")
    print(f" - Mirrored into backend: {BACKEND_SAVED_MODELS_DIR}")
    print("[SUCCESS] Phase 3 Training Pipeline completed successfully!\n")
    return payload


if __name__ == "__main__":
    train_and_evaluate()
