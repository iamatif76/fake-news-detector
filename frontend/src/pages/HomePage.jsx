import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Cpu,
  BarChart3,
  Layers,
  Lock,
  FileCheck2,
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      title: "Real-time Machine Learning",
      description:
        "Trained on over 44,000 verified news items utilizing optimized TF-IDF n-grams and linear classifiers for sub-50ms predictions.",
      icon: Cpu,
      color: "from-blue-600 to-cyan-500",
    },
    {
      title: "NLP Model Explainability",
      description:
        "Transparent local feature attribution highlighting the exact tokens pushing predictions toward Real or Fake news.",
      icon: Sparkles,
      color: "from-indigo-600 to-purple-500",
    },
    {
      title: "Human-in-the-Loop Feedback",
      description:
        "Enables users and fact-checkers to mark prediction veracity, continually benchmarking real-world model accuracy.",
      icon: FileCheck2,
      color: "from-emerald-600 to-teal-500",
    },
    {
      title: "Enterprise Admin Telemetry",
      description:
        "Comprehensive administrative dashboard monitoring detection volumes, class distributions, and one-click CSV dataset exports.",
      icon: BarChart3,
      color: "from-amber-600 to-orange-500",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 text-center max-w-4xl mx-auto px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>B.Tech Final-Year Capstone Project</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none">
          AI-Powered{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Fake News
          </span>{" "}
          Detection System
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Combat misinformation with state-of-the-art NLP and machine learning.
          Paste any headline or article to instantly evaluate credibility,
          inspect confidence scores, and uncover influential lexical patterns.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 hover:scale-105 transition-all"
          >
            <span>Analyze News Article</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-base font-medium text-slate-300 hover:text-white glass-panel hover:bg-slate-800/80 transition-colors"
          >
            <span>System Architecture</span>
          </Link>
        </div>
      </section>

      {/* The Problem Statement Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-8 sm:p-12 border border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              The Critical Challenge of Digital Misinformation
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              False headlines propagate six times faster than verified journalism on modern social networks. TruthLens applies computational linguistics to automate truth verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-400">
                44,000+
              </span>
              <p className="text-sm font-semibold text-slate-200 mt-2">
                Curated News Dataset Samples
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Equal real & fake sample distribution
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                98.8%
              </span>
              <p className="text-sm font-semibold text-slate-200 mt-2">
                Optimal Classifier Accuracy
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Validated using 5-fold cross validation
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-400">
                &lt; 50ms
              </span>
              <p className="text-sm font-semibold text-slate-200 mt-2">
                Sub-Second Pipeline Latency
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Real-time FastAPI inference engine
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Engineered with Production Machine Learning
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Built from scratch for academic rigor, transparent explainability, and real-world deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-slate-700 hover:-translate-y-1 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg mb-5`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
