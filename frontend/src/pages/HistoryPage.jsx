import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL, REAL, FAKE

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/history?limit=50");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesFilter = filter === "ALL" || item.prediction === filter;
    const matchesSearch =
      search === "" ||
      (item.raw_text && item.raw_text.toLowerCase().includes(search.toLowerCase())) ||
      (item.model_name && item.model_name.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Telemetry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Prediction History</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review past classifications, confidence metrics, and user feedback logs.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="flex items-center space-x-1.5 self-start sm:self-center px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-panel hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search snippet or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-700/80 pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-1 self-start sm:self-center">
          <span className="text-xs text-slate-500 mr-2 flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          {["ALL", "REAL", "FAKE"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 bg-slate-900/50 hover:bg-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History Table / Cards */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Loading audit records from SQLite database...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Predictions Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {search || filter !== "ALL"
              ? "No records match your selected filter criteria."
              : "No prediction history exists yet. Analyze your first article now!"}
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/25"
          >
            <span>Analyze News</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isFake = item.prediction === "FAKE";
            return (
              <div
                key={item.id}
                className="glass-panel rounded-xl p-4 sm:p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isFake
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {isFake ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      <span>{item.prediction}</span>
                    </span>

                    <span className="text-xs font-semibold text-slate-300">
                      {item.confidence}% Confidence
                    </span>

                    <span className="text-xs text-slate-500 hidden sm:inline">•</span>

                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {item.model_name}
                    </span>

                    {item.user_feedback && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.user_feedback}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                    {item.raw_text}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-xs text-slate-500 flex-shrink-0">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(item.created_at).toLocaleDateString()}{" "}
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-600 sm:mt-1 font-mono">
                    {item.processing_time_ms} ms
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
