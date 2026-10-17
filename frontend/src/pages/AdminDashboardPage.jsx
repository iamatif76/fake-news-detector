import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  LayoutDashboard,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  RefreshCw,
  BarChart2,
  Users,
} from "lucide-react";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load admin telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDownloadCSV = async () => {
    setExporting(true);
    try {
      const response = await api.get("/admin/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `truthlens_predictions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("CSV download error:", err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400">Loading system telemetry & telemetry metrics...</p>
      </div>
    );
  }

  const modelsData = stats?.model_performance?.models || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Administrative Telemetry & Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">System Operations Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time inference counts, accuracy benchmarks, and training metrics for final evaluation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStats}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-panel hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            disabled={exporting}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? "Generating CSV..." : "Export Predictions CSV"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Inferences</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">
            {stats?.total_predictions.toLocaleString() || 0}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Articles Processed</span>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Fake News Detected</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-400 mt-2">
            {stats?.fake_count.toLocaleString() || 0}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {stats?.fake_percentage}% of total requests
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Real News Verified</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-2">
            {stats?.real_count.toLocaleString() || 0}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {stats?.real_percentage}% of total requests
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">User Satisfaction Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-400 mt-2">
            {stats?.user_satisfaction_rate}%
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {stats?.feedback_correct} Correct / {stats?.feedback_incorrect} Incorrect
          </span>
        </div>
      </div>

      {/* Class Distribution Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">Live Traffic Ratio</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Real ({stats?.real_percentage}%)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Fake ({stats?.fake_percentage}%)</span>
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all duration-700"
            style={{ width: `${stats?.real_percentage || 50}%` }}
          ></div>
          <div
            className="bg-rose-500 transition-all duration-700"
            style={{ width: `${stats?.fake_percentage || 50}%` }}
          ></div>
        </div>
      </div>

      {/* Candidate Model Performance Comparison Table */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              Trained Candidate Models Performance Comparison
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            Champion: {stats?.model_performance?.best_model || "Logistic Regression"}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Evaluation scores computed across holdout test sets during offline model training.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {Object.keys(modelsData).map((mName) => {
                const m = modelsData[mName];
                const isChampion = mName === stats?.model_performance?.best_model;
                return (
                  <tr key={mName} className={isChampion ? "bg-blue-600/5 font-semibold" : ""}>
                    <td className="py-3.5 px-4 text-white flex items-center space-x-2">
                      <span>{mName}</span>
                      {isChampion && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Active Champion
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4">{(m.precision * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4">{(m.recall * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">
                      {(m.f1_score * 100).toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Evaluated
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">Recent System Predictions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Snippet</th>
                <th className="py-3 px-4">Prediction</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Feedback</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stats?.recent_predictions && stats.recent_predictions.length > 0 ? (
                stats.recent_predictions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-mono text-slate-400">#{p.id}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-200">
                      {p.raw_text}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.prediction === "FAKE"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {p.prediction}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{p.confidence}%</td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {p.processing_time_ms} ms
                    </td>
                    <td className="py-3 px-4">
                      {p.user_feedback ? (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {p.user_feedback}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(p.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500 italic">
                    No predictions logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
