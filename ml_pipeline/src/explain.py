import numpy as np


def extract_top_influential_words(text_cleaned: str, model, vectorizer, top_k: int = 6):
    """
    Extracts the most influential words in a given article that contributed to
    the model's prediction using linear feature contribution weights.
    
    Contribution: c_j = w_j * tfidf_j
    - If c_j > 0: word pushed towards FAKE
    - If c_j < 0: word pushed towards REAL
    
    Returns:
        List of dicts: [{"word": str, "weight": float, "direction": "fake"|"real"}]
    """
    if not text_cleaned or not text_cleaned.strip():
        return []

    tfidf_vec = vectorizer.transform([text_cleaned])
    feature_names = np.array(vectorizer.get_feature_names_out())
    
    # Non-zero indices in this document
    row = tfidf_vec.tocoo()
    if row.nnz == 0:
        return []

    # Get model weights (coefficients or log-odds)
    if hasattr(model, "coef_"):
        # For LogisticRegression & PassiveAggressiveClassifier
        weights = model.coef_[0]
    elif hasattr(model, "feature_log_prob_"):
        # For MultinomialNB: log P(w|Fake) - log P(w|Real)
        weights = model.feature_log_prob_[1] - model.feature_log_prob_[0]
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
            "score": round(contrib, 4),
            "direction": "fake" if contrib >= 0 else "real"
        })

    # Sort descending by absolute impact
    contributions.sort(key=lambda x: x["weight"], reverse=True)
    return contributions[:top_k]
