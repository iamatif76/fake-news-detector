TruthLens — AI-Based Fake News Detection System
TruthLens is a web application that uses Natural Language Processing (NLP) and machine learning to classify submitted news text as Real News or Fake News. It combines a React-based frontend with a Python FastAPI backend and a TF-IDF + Logistic Regression classification pipeline.
Important: A model prediction is not proof that a claim is true or false. Use TruthLens as an initial screening tool and verify important claims with reliable, independent sources.
✨ Features
News-text classification — predicts whether submitted text is likely to be real or fake.
Confidence score — displays the model's confidence information with the result.
TF-IDF text representation — converts text into numerical features for machine learning.
Logistic Regression model — the classifier loaded by the current backend setup.
Web interface — a modern frontend for submitting and reviewing text predictions.
FastAPI backend — serves the prediction functionality and provides interactive API documentation.
Machine-learning pipeline — project scripts and dependencies are organized separately under ml_pipeline/.
Local development support — run the frontend and backend separately on your computer.
🧰 Tech Stack
Component
Technology
Frontend
React, Vite, JavaScript, Tailwind CSS
Backend
Python, FastAPI, Uvicorn
Machine Learning
scikit-learn, TF-IDF, Logistic Regression
Data / local storage
SQLite (project database file)
Version control
Git and GitHub
🏗️ How It Works
flowchart TD
    A[User enters news text] --> B[React frontend]
    B --> C[FastAPI backend]
    C --> D[Text preprocessing]
    D --> E[TF-IDF vectorizer]
    E --> F[Logistic Regression classifier]
    F --> G[Prediction and confidence information]
    G --> B
📁 Project Structure
fake-news-detector/
├── backend/
│   ├── app/                 # FastAPI application
│   ├── saved_models/        # Saved model/vectorizer files
│   ├── requirements.txt     # Backend Python dependencies
│   ├── .env.example         # Example environment configuration, if present
│   └── ...
├── frontend/
│   ├── src/                 # Frontend source code
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies and scripts
│   └── ...
├── ml_pipeline/
│   ├── src/                 # Dataset preparation and training scripts
│   └── ...
├── docs/                    # Project and viva documentation
└── README.md
✅ Prerequisites
Python 3.10 or a version supported by the packages in backend/requirements.txt
Node.js and npm (Node.js 18+ recommended)
Git
🚀 Run Locally
Run the backend and frontend in separate terminal windows.
1. Clone the repository
git clone https://github.com/iamatif76/fake-news-detector.git
cd fake-news-detector
2. Set up and start the backend
From the repository root:
cd backend
python -m venv venv
Activate the virtual environment if you want to use it.
Windows PowerShell:
.\venv\Scripts\Activate.ps1
macOS / Linux:
source venv/bin/activate
Install the backend dependencies:
pip install -r requirements.txt
Start the API server:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
When startup completes, open:
API root: http://127.0.0.1:8001
Swagger UI: http://127.0.0.1:8001/docs
ReDoc: http://127.0.0.1:8001/redoc
If port 8001 is already in use, choose another available port and keep the frontend's API configuration in sync.
3. Set up and start the frontend
Open a second terminal from the repository root:
cd frontend
npm install
npm run dev
Open the local URL printed by Vite in the terminal. It is commonly http://localhost:5173, but Vite may choose another port if that one is busy.
4. Configure the frontend API address
Make sure the frontend sends requests to the backend address you started above. Check the existing frontend configuration and use the environment-variable name expected by the source code. Do not add a guessed variable name without checking the code.
🧪 Machine-Learning Pipeline
The repository includes a separate ml_pipeline/ directory for dataset preparation and model training. If you want to retrain the model, first review the scripts and requirements in that directory.
Typical commands documented in the project are:
pip install -r ml_pipeline/requirements_ml.txt
python ml_pipeline/src/prepare_dataset.py
python ml_pipeline/src/train.py
These steps may require a suitable dataset and compatible dependencies. If the saved model files already exist in backend/saved_models/, you may be able to run the backend without retraining.
📡 API Documentation
While the backend is running, visit http://127.0.0.1:8001/docs to see the endpoints exposed by the current FastAPI application and try requests interactively.
The project README previously documented routes for prediction, authentication, feedback, history, and administrative statistics/export. Treat the live /docs page and the backend route definitions as the source of truth for which endpoints are currently implemented and what access controls they use.
🧠 Model Limitations
Predictions depend on the quality, coverage, and balance of the training data.
A model confidence score is not the same as a verified probability that a claim is true.
The model can misclassify satire, opinions, breaking news, unfamiliar topics, or text that differs from its training data.
The application does not replace independent fact-checking or trusted news sources.
Evaluate the model on a separate test set before making claims about accuracy or real-world performance.
🔐 Security Notes
Keep API keys, passwords, tokens, and other secrets out of source code and public GitHub commits.
Store local secrets in an untracked .env file when the application requires them; use example configuration files for documentation.
Do not publish real credentials in this README, screenshots, or issue reports.
If a secret has been committed to a public repository, revoke or rotate it.
📚 Academic Documentation
The repository includes a docs/ directory for supporting project documentation and viva preparation. Open that folder in GitHub to review the files available in the current repository.
👤 Author
Atif Ali
GitHub: https://github.com/iamatif76
📄 License
Check the repository for a LICENSE file to confirm the applicable license before redistributing or reusing this project.
