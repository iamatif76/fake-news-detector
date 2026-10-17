import React, { useState } from "react";
import api from "../services/api";
import ResultCard from "../components/ResultCard";
import {
  Search,
  Sparkles,
  Trash2,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle,
} from "lucide-react";

const DEMO_SAMPLES = [
  {
    label: "Sample 1: Real News (Economy)",
    type: "real",
    text: "WASHINGTON (Reuters) - The Federal Reserve held benchmark interest rates unchanged on Wednesday, pointing to persistent inflation signs while maintaining economic growth projections across key industrial and labor sectors. Chairman Jerome Powell emphasized that future monetary adjustments will remain data-dependent as core consumer price metrics continue their gradual descent toward the central bank's two percent target.",
  },
  {
    label: "Sample 2: Fake News (Conspiracy)",
    type: "fake",
    text: "URGENT BOMBSHELL ALERT: Secret underground government laboratory discovered operating beneath the international airport! Leaked blueprints prove military scientists have been manufacturing artificial hurricanes and deploying electromagnetic mind-control radiation through telecommunication towers to manipulate the upcoming election! Share this report before globalist censors scrub it!",
  },
  {
    label: "Sample 3: Real News (Space Tech)",
    type: "real",
    text: "CAPE CANAVERAL - NASA's James Webb Space Telescope transmitted unprecedented high-resolution imagery of stellar nurseries in nearby galaxies. Astrophysicists confirmed the data reveals new mechanisms of primordial star cluster formation that challenge previous cosmological accretion models.",
  },
  {
    label: "Sample 4: Fake News (Medical Hoax)",
    type: "fake",
    text: "BIG PHARMA PANIC: Doctors banned this secret Amazonian jungle fruit that permanently cures and erases all cancer stages in 24 hours! Medical elites and hospitals have silenced whistleblowers because this free natural root costs zero dollars and destroys their multi-billion dollar chemotherapy monopoly!",
  },
];

const AnalyzePage = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [loadingStep, setLoadingStep] = useState("Cleaning input text...");

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!text.trim() || text.trim().length < 10) {
      setError("Please enter at least 10 characters to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate animated pipeline feedback for user engagement
    setLoadingStep("1. Preprocessing & Lemmatizing text...");
    const t1 = setTimeout(() => setLoadingStep("2. Transforming TF-IDF feature space..."), 300);
    const t2 = setTimeout(() => setLoadingStep("3. Running champion classifier & XAI..."), 600);

    try {
      const response = await api.post("/predict", { text });
      setResult(response.data);
    } catch (err) {
      console.error("Prediction error:", err);
      const msg =
        err.response?.data?.detail ||
        "Could not connect to FastAPI prediction server. Ensure the backend is running.";
      setError(msg);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  const handleLoadSample = (sampleText) => {
    setText(sampleText);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Natural Language Inference</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          News Credibility Analyzer
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Paste a news article body, social media broadcast, or headline to detect credibility.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        {/* Quick Sample Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Quick Demo Test Cases (Click to populate)</span>
            </span>
            {text && (
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Text</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample.text)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  sample.type === "fake"
                    ? "bg-rose-500/5 hover:bg-rose-500/15 text-rose-300 border-rose-500/20"
                    : "bg-blue-500/5 hover:bg-blue-500/15 text-blue-300 border-blue-500/20"
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="relative">
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste article content or headline here (e.g. 'Federal Reserve held benchmark interest rates unchanged on Wednesday...')"
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 p-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 mt-1">
              <span>Minimum 10 characters required</span>
              <span>
                {text.length.toLocaleString()} characters ({text.trim() ? text.trim().split(/\s+/).length : 0} words)
              </span>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Pipeline applies Regex normalization &gt; Stopword stripping &gt; WordNet lemmatization</span>
            </div>

            <button
              type="submit"
              disabled={loading || text.trim().length < 10}
              className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all ${
                loading || text.trim().length < 10
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{loadingStep}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze Credibility</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display Section */}
      {result && (
        <div className="space-y-4">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
