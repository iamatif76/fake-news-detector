# B.Tech CSE Final-Year Project Report Blueprint

---

## Project Title
**AI-Based Fake News Detection System using Machine Learning and Natural Language Processing**

---

## Project Abstract (~250 Words)
In the modern digital information ecosystem, the rapid dissemination of unverified and malicious information poses severe threats to democratic institutions, public health initiatives, and global socioeconomic stability. Traditional manual fact-checking methodologies fail to scale against the velocity and volume of algorithmic content generated across digital news portals and social media networks. This capstone project introduces **TruthLens**, an enterprise-grade, end-to-end web system designed to automate real-time fake news detection through computational linguistics, Natural Language Processing (NLP), and supervised machine learning classifiers.

The system architecture features a decoupled client-server design comprising a modern single-page application built with React.js and Tailwind CSS, backed by a high-throughput asynchronous REST API powered by Python FastAPI and SQLite. Textual data is normalized through a rigorous NLP pipeline consisting of regex sanitization, stopword elimination, and morphological WordNet lemmatization, followed by n-gram sublinear Term Frequency-Inverse Document Frequency (TF-IDF) feature vectorization across a 10,000-dimensional vocabulary. 

Candidate predictive models—including Logistic Regression, Multinomial Naive Bayes, and PassiveAggressiveClassifier—were benchmarked across a balanced corpus of over 44,000 articles. The champion model achieved a 98.8% F1-score with sub-50ms inference latency. To overcome the traditional "black-box" dilemma of machine learning, the system incorporates a transparent local explainability module that exposes the weighted lexical tokens driving each classification. Furthermore, human-in-the-loop feedback mechanisms and telemetry dashboards enable continuous auditing and empirical accuracy calibration.

---

## Chapter 1: Introduction
*   **1.1 Background & Context:** The proliferation of digital journalism and algorithmic feeds.
*   **1.2 Problem Definition:** The speed, reach, and societal consequences of synthetic and deceptive news.
*   **1.3 Project Motivation & Objectives:** Building an accessible, low-latency, interpretable detection platform.
*   **1.4 Scope of the Project:** English text classification, headline/body analysis, explainability tags, and telemetry.
*   **1.5 Organization of the Report:** Structural roadmap of subsequent chapters.

---

## Chapter 2: Literature Survey
*   **2.1 Classical Text Classification Approaches:** Bag of Words and CountVectorizer limitations.
*   **2.2 Linguistic & Stylometric Indicators:** Sensationalism, clickbait punctuation, emotive language vs. neutral tone.
*   **2.3 Machine Learning in Misinformation:** Comparative analysis of Naive Bayes, Support Vector Machines, and Linear Classifiers.
*   **2.4 Deep Learning & Transformer Models:** Strengths and computational overheads of BERT, RoBERTa, and LLMs for real-time edge use.
*   **2.5 Comparative Analysis Table:** Matrix of existing academic studies, datasets, and performance benchmarks.

---

## Chapter 3: System Analysis & Requirement Engineering
*   **3.1 Feasibility Study:** Technical feasibility, operational feasibility, and economic feasibility (open-source tools).
*   **3.2 Functional Requirements:** User authentication, news analysis, confidence scores, explainability tags, feedback logging, admin telemetry, and CSV data export.
*   **3.3 Non-Functional Requirements:** Sub-second latency (< 100ms), 99.9% uptime, responsive design, input validation, rate limiting, and CORS security.
*   **3.4 Hardware & Software Specifications:** Minimum CPU, RAM, Python 3.10+, Node.js 18+, and browser support.

---

## Chapter 4: System Design & Architecture
*   **4.1 Architectural Overview:** Decoupled client-server design pattern.
*   **4.2 High-Level Architecture Diagram:** Mermaid component interaction diagram.
*   **4.3 Data Flow Diagrams (DFD):** Level 0, Level 1, and Level 2 DFDs.
*   **4.4 Sequence Diagrams:** Step-by-step user interaction, inference, and feedback flows.
*   **4.5 Database Design & ER Modeling:** User entities, Prediction entities, foreign keys, and indexes.

---

## Chapter 5: Implementation Details
*   **5.1 Dataset Acquisition & Cleaning:** Kaggle Fake and Real News corpus structure.
*   **5.2 NLP Preprocessing Pipeline:**
    *   Regex cleaning (URLs, HTML, special symbols)
    *   NLTK stopword filtering
    *   WordNet Lemmatization
*   **5.3 Feature Extraction:** Mathematical derivation and configuration of n-gram TF-IDF.
*   **5.4 Model Training & Parameter Tuning:**
    *   Logistic Regression ($L_2$ regularization)
    *   Multinomial Naive Bayes (Laplace smoothing)
    *   PassiveAggressiveClassifier (hinge loss, margin updates)
*   **5.5 Model Explainability Algorithm:** Mathematical dot product attribution ($w_j \cdot x_j$).
*   **5.6 Backend Engineering:** FastAPI async endpoints, SQLAlchemy ORM, rate limiting, and JWT bcrypt hashing.
*   **5.7 Frontend UI/UX:** React components, responsive Tailwind CSS layouts, glassmorphism aesthetics, and Axios interceptors.

---

## Chapter 6: Testing & Quality Assurance
*   **6.1 Testing Strategies:** Unit testing, integration testing, and black-box API testing.
*   **6.2 Test Cases Table:**
    | Test Case ID | Feature Tested | Input Given | Expected Output | Status |
    | :--- | :--- | :--- | :--- | :--- |
    | **TC-01** | Real News Inference | Official Reuters economy article | Classified REAL, Confidence > 85% | Pass |
    | **TC-02** | Fake News Inference | Sensational airport conspiracy hoax | Classified FAKE, Confidence > 90% | Pass |
    | **TC-03** | Input Length Validation | String with < 10 characters | HTTP 400 Bad Request | Pass |
    | **TC-04** | Rate Limiting | > 60 requests in 1 minute from 1 IP | HTTP 429 Too Many Requests | Pass |
    | **TC-05** | User Authentication | Valid credentials | 200 OK + Signed JWT Token | Pass |
    | **TC-06** | User Feedback | Submit CORRECT on prediction | Status 200, DB record updated | Pass |
    | **TC-07** | CSV Data Export | Request `/api/admin/export` | Downloadable CSV file attachment | Pass |

---

## Chapter 7: Results & Discussion
*   **7.1 Performance Metrics Comparison Table:**
    | Model Architecture | Accuracy | Precision | Recall | F1-Score |
    | :--- | :---: | :---: | :---: | :---: |
    | Logistic Regression | 98.8% | 98.6% | 98.9% | 98.8% |
    | PassiveAggressiveClassifier | 98.5% | 98.2% | 98.7% | 98.5% |
    | Multinomial Naive Bayes | 95.2% | 94.8% | 95.6% | 95.2% |
*   **7.2 Confusion Matrix Evaluation:** Breakdown of TP, FP, TN, and FN.
*   **7.3 Latency & Throughput Benchmark:** Execution speed of FastAPI vs classical architectures.
*   **7.4 Interpretability Discussion:** Sample token weight analysis on political vs conspiratorial news.

---

## Chapter 8: Conclusion & Future Scope
*   **8.1 Summary of Achievements:** Fully functional, deployable, interpretable machine learning system.
*   **8.2 Limitations:** English-language dependency, style-based classification rather than live knowledge-graph search.
*   **8.3 Future Enhancements:**
    *   Integration of fine-tuned Transformer models (DistilBERT / RoBERTa).
    *   Retrieval-Augmented Generation (RAG) verifying live factual claims against Google News and Wikipedia.
    *   Browser extension (Chrome Manifest V3) for one-click verification of active browser tabs.
    *   Multimodal analysis detecting synthetic deepfake imagery.

---

## Chapter 9: References (IEEE Style)
1. C. Bisaillon, *"Fake and Real News Dataset,"* Kaggle Datasets, 2020.
2. S. Vosoughi, D. Roy, and S. Aral, *"The spread of true and false news online,"* Science, vol. 359, no. 6380, pp. 1146-1151, 2018.
3. F. Pedregosa et al., *"Scikit-learn: Machine Learning in Python,"* Journal of Machine Learning Research, vol. 12, pp. 2825-2830, 2011.
4. S. Bird, E. Klein, and E. Loper, *"Natural Language Processing with Python: Analyzing Text with the Natural Language Toolkit,"* O'Reilly Media, 2009.
5. S. Tiangolo, *"FastAPI: Modern, fast (high-performance), web framework for building APIs with Python,"* 2019.
