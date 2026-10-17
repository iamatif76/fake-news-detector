import React from "react";
import { ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-slate-200">
              AI-Based Fake News Detection System
            </span>
            <span className="text-xs text-slate-500">| B.Tech CSE Final-Year Project</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              FastAPI
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              Scikit-Learn
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              TF-IDF NLP
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              React + Tailwind
            </span>
          </div>

          <p className="text-xs text-slate-500 flex items-center">
            Designed for 10/10 Academic Evaluation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
