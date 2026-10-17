import React from "react";
import {
  BrainCircuit,
  Binary,
  Layers,
  Database,
  ShieldCheck,
  Cpu,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Project Report Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          System Architecture & ML Pipeline
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Comprehensive technical documentation of the NLP data pipeline, model training, and mathematical formulations.
        </p>
      </div>

      {/* End-to-End Pipeline Workflow */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span>End-to-End System Workflow</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-blue-400 font-mono">STAGE 01</span>
            <h3 className="text-sm font-semibold text-slate-100">Data Preprocessing</h3>
            <p className="text-xs text-slate-400">
              Regex cleans URLs, HTML tags, brackets, and punctuation. NLTK removes stopwords and applies WordNet lemmatization.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 font-mono">STAGE 02</span>
            <h3 className="text-sm font-semibold text-slate-100">TF-IDF Vectorization</h3>
            <p className="text-xs text-slate-400">
              Converts text into unigrams and bigrams $(1, 2)$ weighted by inverse document frequency across a 10,000-word vocabulary.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-purple-400 font-mono">STAGE 03</span>
            <h3 className="text-sm font-semibold text-slate-100">Inference Classifier</h3>
            <p className="text-xs text-slate-400">
              Champion Logistic Regression / PassiveAggressive classifier evaluates feature dot product to yield REAL vs FAKE and confidence.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 font-mono">STAGE 04</span>
            <h3 className="text-sm font-semibold text-slate-100">Explainability (XAI)</h3>
            <p className="text-xs text-slate-400">
              Calculates linear feature contributions $(w_j \cdot x_j)$ to isolate the specific tokens that swayed the prediction decision.
            </p>
          </div>
        </div>
      </div>

      {/* Mathematical Principles */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Binary className="w-5 h-5 text-purple-400" />
          <span>Key Mathematical Formulations (Viva Reference)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-100">1. Term Frequency - Inverse Document Frequency (TF-IDF)</h3>
            <p className="text-slate-400">
              Evaluates the relative informational significance of word $t$ in article $d$ relative to the total corpus of $N$ documents:
            </p>
            <div className="p-3 rounded-lg bg-black/40 font-mono text-center text-blue-300 border border-slate-800">
              TF-IDF(t, d) = TF(t, d) × ln[(1 + N) / (1 + DF(t))] + 1
            </div>
            <p className="text-slate-400 text-[11px]">
              Sublinear term frequency scaling is applied to prevent heavily repeated words from dominating features.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-100">2. Evaluation Metrics & F1-Score</h3>
            <p className="text-slate-400">
              Harmonic mean of Precision and Recall chosen over raw accuracy to prevent skew from class imbalances:
            </p>
            <div className="p-3 rounded-lg bg-black/40 font-mono text-center text-emerald-300 border border-slate-800">
              F1-Score = 2 × (Precision × Recall) / (Precision + Recall)
            </div>
            <p className="text-slate-400 text-[11px]">
              Precision = TP / (TP + FP) | Recall = TP / (TP + FN)
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Technology Stack</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-blue-400 block">FastAPI</span>
            <span className="text-slate-500 text-[11px]">Backend API</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-cyan-400 block">React 19 + Vite</span>
            <span className="text-slate-500 text-[11px]">Frontend Client</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-indigo-400 block">Tailwind CSS</span>
            <span className="text-slate-500 text-[11px]">Responsive UI</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-amber-400 block">Scikit-Learn</span>
            <span className="text-slate-500 text-[11px]">ML Algorithms</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-emerald-400 block">NLTK</span>
            <span className="text-slate-500 text-[11px]">Text Normalization</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-purple-400 block">SQLite + JWT</span>
            <span className="text-slate-500 text-[11px]">Persistence & Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
