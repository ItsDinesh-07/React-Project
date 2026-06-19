import React, { useState, useEffect } from "react";
import { StudyPlanTask } from "../types";
import ProgressBar from "../components/ProgressBar";
import { Calendar, Plus, Trash2, CheckCircle2, Bookmark, Flame, Sparkles } from "lucide-react";

export default function StudyPlan() {
  const [tasks, setTasks] = useState<StudyPlanTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Technical");
  const [newTaskDifficulty, setNewTaskDifficulty] = useState("Medium");
  const [newTaskDuration, setNewTaskDuration] = useState("1h");

  useEffect(() => {
    const stored = localStorage.getItem("studyPlans");
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      const defaultPlans: StudyPlanTask[] = [
        { id: "task_1", title: "Complete HTML5 Semantic structure review", category: "Technical", difficulty: "Easy", duration: "1h", completed: true },
        { id: "task_2", title: "Solve 10 Quantitative Profit/Loss equations", category: "Aptitude", difficulty: "Medium", duration: "1.5h", completed: false },
        { id: "task_3", title: "Record 2 Communication STAR behavioral briefs", category: "Communication", difficulty: "Medium", duration: "45m", completed: false },
        { id: "task_4", title: "Review Java Garbage Collection heap segments", category: "Technical", difficulty: "Hard", duration: "2h", completed: false }
      ];
      localStorage.setItem("studyPlans", JSON.stringify(defaultPlans));
      setTasks(defaultPlans);
    }
  }, []);

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setTasks(updated);
    localStorage.setItem("studyPlans", JSON.stringify(updated));

    // Update aggregate progress variables
    const progressStr = localStorage.getItem("progressData");
    if (progressStr) {
      try {
        const m = JSON.parse(progressStr);
        const resolvedCount = updated.filter(u => u.completed).map(u => u.id);
        m.completedTasks = resolvedCount;
        localStorage.setItem("progressData", JSON.stringify(m));
      } catch {}
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: StudyPlanTask = {
      id: "task_" + Math.random().toString(36).substring(2, 6),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      difficulty: newTaskDifficulty,
      duration: newTaskDuration,
      completed: false
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem("studyPlans", JSON.stringify(updated));
    setNewTaskTitle("");
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem("studyPlans", JSON.stringify(updated));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressRatio = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Upper header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider">
          <Calendar size={14} className="stroke-indigo-600" />
          <span>Syllabus Checklist Tracker</span>
        </div>
        <h2 className="text-xl font-bold font-sans text-slate-800">Custom Study Plan</h2>
        <p className="text-xs text-slate-500">Configure daily, structured preparation routines. Add personalized checklist goals or track custom schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Goal Creator Form */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4 lg:col-span-1 h-fit">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Add Study Objective</h3>
            <p className="text-[11px] text-slate-400">Add customizable checklist tasks tailored around your focus gaps.</p>
          </div>

          <form onSubmit={handleAddTask} className="space-y-3 pt-2">
            
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Task Title</label>
              <input
                type="text"
                required
                maxLength={80}
                placeholder="E.g., Complete 3 dynamic HR interviews"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-250 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-650 text-slate-850 font-medium"
              />
            </div>

            {/* Category / Track Choice */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Assessment category</label>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-250 text-xs rounded-xl focus:outline-hidden text-slate-750 font-semibold"
              >
                <option value="Technical">Technical Competencies</option>
                <option value="Aptitude">Quantitative Logic / Aptitude</option>
                <option value="Communication">Active Communication STAR</option>
                <option value="HR">HR behavior patterns</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Difficulty */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Difficulty</label>
                <select
                  value={newTaskDifficulty}
                  onChange={(e) => setNewTaskDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 text-xs rounded-xl focus:outline-hidden text-slate-750 font-semibold"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Estimate Duration */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Duration</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 45m"
                  value={newTaskDuration}
                  onChange={(e) => setNewTaskDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 text-xs rounded-xl focus:outline-hidden text-slate-705 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 pt-3 shadow-xs"
            >
              <Plus size={14} />
              <span>Register Study Task</span>
            </button>

          </form>
        </div>

        {/* Right Side: Active Checklist Dashboard */}
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-xs lg:col-span-2 space-y-6">
          
          {/* Progress dashboard bar */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Plan Performance Completion</span>
              </span>
              <span>{completedCount} / {tasks.length} Completed</span>
            </div>
            <ProgressBar progress={progressRatio} heightClass="h-2" showText />
          </div>

          {/* Checklist items registry */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase leading-none pb-2 border-b border-slate-50">Active Objectives Checklist</h3>
            
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6 leading-relaxed">No study targets loaded. Insert custom requirements using the Creator panel on your left!</p>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((tk) => {
                  
                  return (
                    <div 
                      key={tk.id}
                      onClick={() => toggleTask(tk.id)}
                      className="p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Selector checkbox */}
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                          tk.completed 
                            ? "bg-[#27272A] border-[#27272A] text-white" 
                            : "border-slate-350 bg-white group-hover:border-indigo-600"
                        }`}>
                          {tk.completed && <span className="text-[10px] font-black">✓</span>}
                        </div>
                        
                        <div className="truncate">
                          <p className={`text-xs font-bold leading-normal truncate ${
                            tk.completed ? "line-through text-slate-400 font-medium" : "text-slate-800 font-bold"
                          }`}>
                            {tk.title}
                          </p>
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-0.5 uppercase tracking-wide font-bold">
                            <span>{tk.category}</span>
                            <span>•</span>
                            <span className="text-indigo-600">{tk.difficulty}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right action controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 font-semibold bg-white border px-2 py-0.5 rounded-md shrink-0">
                          {tk.duration}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(tk.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                          title="Remove study goal"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
