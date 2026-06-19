import React, { useState, useEffect } from "react";
import { PracticeSession } from "../types";
import { History, Trash2, Calendar, Award, AlertCircle } from "lucide-react";

export default function InterviewHistory() {
  const [history, setHistory] = useState<PracticeSession[]>([]);

  useEffect(() => {
    const historyStr = localStorage.getItem("questionHistory") || "[]";
    try {
      setHistory(JSON.parse(historyStr));
    } catch {
      setHistory([]);
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to flush all completed practice logs? This will reset your progress chart timeline.")) {
      localStorage.removeItem("questionHistory");
      setHistory([]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider">
            <History size={14} className="stroke-indigo-600" />
            <span>Completed Practice Registry</span>
          </div>
          <h2 className="text-xl font-bold font-sans text-slate-800">Interview History & Logs</h2>
          <p className="text-xs text-slate-500">Review all completed technical practices, soft skills speech mock tests, and logic rounds.</p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 text-rose-600 hover:bg-rose-50 border border-rose-150 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 size={14} />
            <span>Clear All logs</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-slate-200 p-10 py-16 rounded-2xl shadow-xs text-center flex flex-col justify-center items-center space-y-4">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
            <History size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-755 uppercase">No logged attempts discovered</h4>
            <p className="text-xs text-slate-400 max-w-sm">Complete your first Aptitude practice round or take a full AI Mock Interview to compile aggregate performance records here.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((sess) => {
            const correctPercent = Math.round((sess.score / (sess.questions?.length || 5)) * 100);
            
            return (
              <div 
                key={sess.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-indigo-200 transition-all space-y-4"
              >
                {/* Upper stats info */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-755 rounded uppercase tracking-wider">
                      {sess.category} Round
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 mt-1">
                      {sess.role}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Calendar size={12} />
                      <span>{sess.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400">SCORE</p>
                    <p className="text-sm font-black text-indigo-700 leading-tight">
                      {sess.score} / {sess.questions?.length || 5} Matches
                    </p>
                  </div>
                </div>

                {/* Accuracy feedback segment */}
                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <AlertCircle size={14} className="text-indigo-650" />
                    <span>Complexity Parameter: <strong>{sess.difficulty || "Medium"}</strong></span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    correctPercent >= 80 
                      ? "bg-emerald-55 text-emerald-650" 
                      : correctPercent >= 60 
                      ? "bg-indigo-55 text-indigo-650" 
                      : "bg-amber-55 text-amber-650"
                  }`}>
                    {correctPercent >= 80 ? "Pass Optimized" : correctPercent >= 60 ? "Proficient" : "Needs Review"}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
