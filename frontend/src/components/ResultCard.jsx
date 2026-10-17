import React, { useState } from "react";
import api from "../services/api";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Share2,
  Check,
} from "lucide-react";

const ResultCard = ({ result, onFeedbackSubmitted }) => {
  const [feedback, setFeedback] = useState(result.user_feedback || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const isFake = result.prediction === "FAKE";

  const handleFeedback = async (type) => {
    if (feedback || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await api.post("/feedback", {
        prediction_id: result.id,
        feedback: type,
      });
      setFeedback(type);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(type);
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const textToCopy = `TruthLens Analysis:
Prediction: ${result.prediction} NEWS (${result.confidence}% Confidence)
Model: ${result.model_name}
Latency: ${result.processing_time_ms}ms`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-6 sm:p-8 transition-all animate-in fade-in duration-500 border ${
        isFake
          ? "border-rose-500/40 glow-red"
          : "border-emerald-500/40 glow-green"
      }`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isFake ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {isFake ? (
              <AlertTriangle className="w-7 h-7" />
            ) : (
              <CheckCircle2 className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isFake
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                Classification Result
              </span>
              <span className="text-xs text-slate-500">ID #{result.id}</span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${
                isFake ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {result.prediction} NEWS
            </h2>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? "Copied Report" : "Share Analysis"}</span>
        </button>
      </div>

      {/* Confidence & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-b border-slate-800">
        {/* Confidence Meter */}
        <div className="glass-card rounded-xl p-4 md:col-span-1">
          <span className="text-xs text-slate-400 font-medium">Confidence Score</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black text-white">{result.confidence}%</span>
            <span className="text-xs text-slate-400">Certainty</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isFake ? "bg-rose-500" : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(result.confidence, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Model Info */}
        <div className="glass-card rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Inference Model</span>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{result.model_name}</p>
            <span className="text-xs text-slate-500">TF-IDF Vectorized</span>
          </div>
        </div>

        {/* Latency */}
        <div className="glass-card rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Processing Time</span>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{result.processing_time_ms} ms</p>
            <span className="text-xs text-slate-500">Real-time pipeline</span>
          </div>
        </div>
      </div>

      {/* Influential Features / Explainability */}
      <div className="py-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Top Influential NLP Tokens (Local Explainability)
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Words that exerted the highest weighted impact on the classification decision:
        </p>

        {result.top_words && result.top_words.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {result.top_words.map((token, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  token.direction === "fake"
                    ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                    : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                }`}
              >
                <span className="font-semibold">{token.word}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  (wt: {token.weight})
                </span>
                <span
                  className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold ${
                    token.direction === "fake"
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {token.direction}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            No specific dominant tokens isolated (generic vocabulary distribution).
          </p>
        )}
      </div>

      {/* Human-in-the-Loop Feedback Section */}
      <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-slate-300">
            Is this prediction accurate?
          </span>
          <p className="text-xs text-slate-500">
            Helps calibrate system accuracy telemetry for admin evaluation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {feedback ? (
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                feedback === "CORRECT"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-400 border-rose-500/30"
              }`}
            >
              ✓ Marked as {feedback}
            </span>
          ) : (
            <>
              <button
                disabled={isSubmitting}
                onClick={() => handleFeedback("CORRECT")}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 transition-all"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Correct</span>
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleFeedback("INCORRECT")}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 transition-all"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Incorrect</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
