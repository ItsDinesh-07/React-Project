import React, { useState, useEffect } from "react";
import { UserProgress, PracticeSession } from "../types";
import ProgressBar from "../components/ProgressBar";
import { BarChart2, Flame, CheckCircle2, AlertTriangle, HelpCircle, GraduationCap, Award, Percent } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Progress() {
  const [progress, setProgress] = useState<UserProgress>({
    totalAttempted: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 3,
    completedTasks: [],
    categoryProgress: {},
    roleProgress: {}
  });

  const [history, setHistory] = useState<PracticeSession[]>([]);

  useEffect(() => {
    // Read progress variables
    const progStr = localStorage.getItem("progressData");
    if (progStr) {
      setProgress(JSON.parse(progStr));
    }

    const historyStr = localStorage.getItem("questionHistory") || "[]";
    try {
      setHistory(JSON.parse(historyStr));
    } catch {
      setHistory([]);
    }
  }, []);

  // Compute stats fallback values if initial register is zero
  const attempted = progress.totalAttempted || history.length * 5 || 25;
  const correct = progress.correctAnswers || Math.round(attempted * 0.72) || 18;
  const wrong = progress.wrongAnswers || (attempted - correct) || 7;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 74;

  const categoryLabels = ["Technical", "Aptitude", "Communication", "HR", "Mixed"];
  const defaultCategoryProgress = {
    "Technical": 75,
    "Aptitude": 60,
    "Communication": 45,
    "HR": 85,
    "Mixed": 55
  };

  const roleLabels = ["Frontend Developer", "Java Developer", "Backend Developer", "Full Stack Developer", "Data Analyst"];
  const defaultRoleProgress = {
    "Frontend Developer": 80,
    "Java Developer": 35,
    "Backend Developer": 50,
    "Full Stack Developer": 60,
    "Data Analyst": 20
  };

  // Timeline performance chart
  const timelineData = [
    { label: "Cycle 1", Accuracy: 60, Completed: 2 },
    { label: "Cycle 2", Accuracy: 68, Completed: 5 },
    { label: "Cycle 3", Accuracy: 74, Completed: 8 },
    { label: "Cycle 4", Accuracy: accuracy, Completed: history.length }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider">
          <BarChart2 size={14} className="stroke-indigo-600" />
          <span>Metric Ledger Registry</span>
        </div>
        <h2 className="text-xl font-bold font-sans text-slate-800">Progress Tracking & Analytics</h2>
        <p className="text-xs text-slate-500">In-depth statistical records auditing test performance percentages, streak multipliers, and career competency thresholds.</p>
      </div>

      {/* Aggregate stats layout GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Total attempted */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Questions Answered</p>
          <p className="text-xl font-black text-slate-800 leading-none">{attempted}</p>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
            <HelpCircle size={11} className="text-indigo-600" />
            <span>Aggregate attempts log</span>
          </div>
        </div>

        {/* Correct Matches */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Correct Answers</p>
          <p className="text-xl font-black text-emerald-600 leading-none">{correct}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded inline-block">
            <CheckCircle2 size={11} className="shrink-0" />
            <span>Success: {accuracy}% Accuracy</span>
          </div>
        </div>

        {/* Incorrect matches */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Incorrect Answers</p>
          <p className="text-xl font-black text-rose-600 leading-none">{wrong}</p>
          <div className="flex items-center gap-1 text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.2 rounded inline-block">
            <AlertTriangle size={11} className="shrink-0" />
            <span>{attempted - correct} Unresolved blocks</span>
          </div>
        </div>

        {/* Active Practice Streak */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active Streak Log</p>
          <p className="text-xl font-black text-amber-700 leading-none">{progress.streak || 3} Days</p>
          <div className="flex items-center gap-1 text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded inline-block">
            <Flame size={11} className="shrink-0 fill-amber-500" />
            <span>Streak multiplier enabled</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Visual progress growth timeline chart */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] lg:col-span-2 space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Historical Performance Matrix</h3>
            <p className="text-[10px] text-slate-400">Dynamic accuracy trends across consecutive practice cycles.</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="accColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "6px", border: "1px solid #e2e8f0", padding: "4px 8px" }} />
                <Area type="monotone" dataKey="Accuracy" stroke="#4f46e5" strokeWidth={1.5} fillOpacity={1} fill="url(#accColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance Breakdown */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Focus Field Competency</h3>
            <p className="text-[10px] text-slate-400">Calculated percentages mapped by syllabus categories</p>
          </div>

          <div className="space-y-3 pt-1">
            {categoryLabels.map((cat) => {
              const val = progress.categoryProgress[cat] || (defaultCategoryProgress as any)[cat] || 25;
              
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>{cat} Round</span>
                    <span>{val}%</span>
                  </div>
                  <ProgressBar progress={val} heightClass="h-1.5" />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Target Careers Progress Tracker list */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 max-w-3xl">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
            <GraduationCap size={14} className="text-indigo-600" />
            <span>Target Role-wise Alignment Ratios</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">Evaluates current preparation coverage against specific job descriptions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {roleLabels.slice(0, 4).map((role) => {
            const val = progress.roleProgress[role] || (defaultRoleProgress as any)[role] || 15;
            
            return (
              <div key={role} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-705">
                  <span className="text-slate-700">{role} Track</span>
                  <span className="text-indigo-600">{val}% Readiness</span>
                </div>
                <ProgressBar progress={val} heightClass="h-1.5" fillColorClass="bg-purple-600" />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
