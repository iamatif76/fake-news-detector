# 20 Comprehensive Viva Questions & Expert Answers

### Q1: What is the fundamental difference between Stemming and Lemmatization?
**Answer:**  
Stemming uses crude heuristic rule-based chopping of word suffixes (e.g., Porter Stemmer cutting "running" to "run", but converting "studies" to "studi"). Lemmatization uses morphological vocabularies and lexical dictionaries (like WordNet) to return the actual valid canonical base form (lemma) of a word based on its part of speech (e.g., converting "better" to "good", "was" to "be"). We chose Lemmatization to preserve semantic vocabulary integrity.

---

### Q2: Why is TF-IDF superior to a simple Bag of Words (CountVectorizer)?
**Answer:**  
Bag of Words simply tallies raw word occurrences. In longer articles, frequent but uninformative words will dominate raw counts. TF-IDF balances term frequency with corpus-wide inverse document frequency, giving high numerical weights to terms that are frequent in the specific document but rare across the general corpus, effectively filtering noise.

---

### Q3: What is the mathematical formulation of the F1-Score, and why use it over Accuracy?
**Answer:**  
$$\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$  
Raw accuracy is deceptive when class distribution is skewed (e.g., in a dataset of 95% real news and 5% fake news, a trivial model predicting everything as real achieves 95% accuracy while completely failing to detect fake news). The F1-score is the harmonic mean of precision and recall, penalizing extreme trade-offs between false positives and false negatives.

---

### Q4: Explain the four cells of the Confusion Matrix in the context of Fake News.
**Answer:**  
1. **True Positive (TP):** The article is actually Fake News, and the model correctly predicted it as FAKE.
2. **True Negative (TN):** The article is legitimate Real News, and the model correctly predicted it as REAL.
3. **False Positive (FP - Type I Error):** Legitimate Real News mistakenly classified as FAKE.
4. **False Negative (FN - Type II Error):** Dangerous Fake News mistakenly classified as REAL (the most critical risk).

---

### Q5: How does the PassiveAggressiveClassifier operate?
**Answer:**  
The Passive-Aggressive algorithm is an online margin-based linear classifier. It is **Passive** when a training sample is classified correctly with sufficient margin (no weight updates: $w_{t+1} = w_t$). It is **Aggressive** whenever an error or margin violation occurs, updating weight vector $w$ by the minimum step size necessary to correct the error while preserving previous knowledge. It is exceptionally fast and scalable for high-dimensional sparse text data.

---

### Q6: Why did you choose FastAPI over Flask or Django?
**Answer:**  
1. **Performance:** FastAPI is built on Starlette and Pydantic, achieving ASGI asynchronous throughput comparable to NodeJS and Go.
2. **Automatic Data Validation:** Pydantic models automatically enforce strict input/output type casting and JSON schema serialization.
3. **Interactive Documentation:** Generates interactive Swagger UI (`/docs`) and ReDoc (`/redoc`) without third-party plugins.
4. **Lightweight & Modular:** Unlike Django, FastAPI does not impose heavy ORM/admin overhead, making it ideal for microservice architectures.

---

### Q7: What is CORS, and why is CORS configuration essential in this project?
**Answer:**  
CORS stands for **Cross-Origin Resource Sharing**. It is a browser-enforced security mechanism that prevents web pages loaded on one domain (e.g., `localhost:5173` on Vite) from making AJAX requests to a different domain or port (e.g., `localhost:8000` on FastAPI) unless the server explicitly sends HTTP headers like `Access-Control-Allow-Origin`.

---

### Q8: How does JWT (JSON Web Token) authentication function?
**Answer:**  
A JWT is a compact, URL-safe token composed of three base64-encoded segments: `Header.Payload.Signature`. When a user logs in, the backend signs their user ID and expiration timestamp using a secret key with the HMAC-SHA256 algorithm. The frontend stores this token and sends it in the HTTP `Authorization: Bearer <token>` header. The server verifies the signature mathematically without needing to query a stateful session store in the database.

---

### Q9: Why is bcrypt superior to SHA-256 for password hashing?
**Answer:**  
SHA-256 is designed to be computationally rapid (ideal for file integrity), making it vulnerable to brute-force dictionary attacks and modern GPU cracking. **bcrypt** incorporates an adaptive computational work factor (cost parameter) and automatic random salting, intentionally slowing down hash calculation so that cracking billions of combinations per second becomes infeasible.

---

### Q10: How does your Local Model Explainability feature determine influential words?
**Answer:**  
In our linear model, the classification score is the dot product of feature weights and TF-IDF values: $z = \sum (w_j \cdot x_j) + b$. For any document, we inspect all non-zero TF-IDF features $x_j$, multiply each by its trained model weight $w_j$, and rank them descending by absolute contribution $|w_j \cdot x_j|$. If $w_j \cdot x_j > 0$, the token drove the prediction toward Fake News; if negative, toward Real News.

---

### Q11: How do you prevent overfitting during model training?
**Answer:**  
1. Using an 80/20 stratified split to ensure identical class distributions across training and testing sets.
2. Applying L2 regularization in Logistic Regression ($C=1.0$) to penalize excessively large feature weights.
3. Limiting maximum TF-IDF vocabulary size to 10,000 features and filtering single-letter noise words.
4. Eliminating duplicate articles during data preprocessing.

---

### Q12: What is the purpose of N-grams in TF-IDF?
**Answer:**  
Individual unigrams (single words) lose word-order context. For example, "not guilty" contains "not" and "guilty". If treated as isolated words, the model might associate "guilty" with crime. By configuring `ngram_range=(1, 2)`, the vectorizer extracts both unigrams ("not", "guilty") and contiguous pairs (bigrams: "not guilty"), capturing basic negations and compound terminology like "white house" and "breaking news".

---

### Q13: What is sublinear term frequency scaling?
**Answer:**  
In standard TF, a word appearing twenty times has twenty times the weight of a word appearing once. However, an article mentioning "election" 20 times is rarely 20 times more informative than one mentioning it once. Sublinear TF replaces raw frequency $f$ with $1 + \ln(f)$, dampening the effect of extreme repetitions.

---

### Q14: How does your in-memory rate limiter work?
**Answer:**  
It implements a sliding-window counter tracking client IP addresses. Each request stores a UNIX timestamp in a queue. On every incoming request, timestamps older than 60 seconds are popped. If the remaining count exceeds our configured limit (e.g., 60 requests/minute), the server responds immediately with HTTP `429 Too Many Requests`.

---

### Q15: Why did you use SQLite for development, and how would you scale to production?
**Answer:**  
SQLite is serverless, zero-configuration, and stores the entire relational database in a single local file (`fake_news.db`), making it ideal for local testing, college demonstrations, and portable evaluation. For high-concurrency cloud production, we would update `DATABASE_URL` in `.env` to point to a managed PostgreSQL cluster (e.g., on Supabase or AWS RDS) with zero changes to our SQLAlchemy code.

---

### Q16: How do you handle empty strings, foreign characters, and emojis in user inputs?
**Answer:**  
Input validation begins at the Pydantic schema level (`min_length=10`, `max_length=100000`). In the text preprocessor, regex removes non-alphanumeric noise and URLs while UTF-8 encoding safely normalizes characters. If an article ends up containing no recognized vocabulary after cleaning, a fallback mechanism preserves the raw lowercase string to prevent vectorizer dimension errors.

---

### Q17: What is the purpose of the `/api/feedback` endpoint?
**Answer:**  
It provides a **Human-in-the-Loop (HITL)** validation mechanism. Real-world users can flag whether a prediction was correct or incorrect. These labels are logged in the database and aggregated on the `/admin` dashboard to calculate the live user satisfaction rate, providing a continuous feedback loop for dataset retraining.

---

### Q18: What is the difference between Word2Vec/GloVe and TF-IDF?
**Answer:**  
TF-IDF produces sparse, high-dimensional document vectors where words are represented as independent dimensions without semantic proximity (e.g., "doctor" and "physician" are completely separate dimensions). Word2Vec and GloVe generate dense, low-dimensional word embeddings where semantically similar words have vectors located close to each other in vector space based on cosine similarity.

---

### Q19: Why not use a deep Transformer like BERT directly for real-time inference?
**Answer:**  
While models like BERT offer superior contextual comprehension, they require significant memory footprint (hundreds of megabytes to gigabytes), GPU acceleration, and introduce 300ms–2000ms inference latency per query. Our TF-IDF + Logistic Regression pipeline executes in **under 40 milliseconds on standard CPU hardware**, making it lightweight, instantaneous, and cost-effective for high-throughput public deployment.

---

### Q20: If you change or expand the dataset, how is the model retrained?
**Answer:**  
Retraining is fully automated:
1. Place new raw CSV files into `ml_pipeline/data/raw/` or export the logged user predictions via the `/api/admin/export` CSV endpoint.
2. Run `python ml_pipeline/src/prepare_dataset.py` to regenerate cleaned features and EDA plots.
3. Run `python ml_pipeline/src/train.py` which trains all candidate models, evaluates metrics, and automatically mirrors the new `best_model.joblib` and `tfidf_vectorizer.joblib` into `backend/saved_models/`.
4. Restart the FastAPI server.
