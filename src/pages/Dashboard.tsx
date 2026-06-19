import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, ResumeReport, PracticeSession, StudyPlanTask, UserProgress } from "../types";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import { 
  FileText, 
  Video, 
  Award, 
  Flame, 
  ChevronRight, 
  Sparkles, 
  Play, 
  Users, 
  DollarSign, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Plus, 
  Trash2,
  Lock,
  UserPlus
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  // Localized statistics loaded from LocalStorage
  const [progress, setProgress] = useState<UserProgress>({
    totalAttempted: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 3,
    completedTasks: [],
    categoryProgress: {},
    roleProgress: {}
  });

  const [resumeReports, setResumeReports] = useState<ResumeReport[]>([]);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [tasks, setTasks] = useState<StudyPlanTask[]>([]);
  
  // Custom states for Administrator Role dashboards
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [newVendorCourse, setNewVendorCourse] = useState({ title: "", category: "Technical", duration: "1h" });
  const [newCollegeTask, setNewCollegeTask] = useState({ title: "", difficulty: "Medium", duration: "1h" });
  
  // Transaction catalog for Main Admin
  const [transactions, setTransactions] = useState([
    { id: "TX_901", client: "Boston State College", amount: 4800, date: "2026-06-15", status: "Completed" },
    { id: "TX_902", client: "Dev Corp Direct", amount: 1250, date: "2026-06-14", status: "Completed" },
    { id: "TX_903", client: "Texas Tech High", amount: 3100, date: "2026-06-11", status: "Completed" }
  ]);

  useEffect(() => {
    // Read secure session state
    const curUserStr = localStorage.getItem("currentUser");
    if (!curUserStr) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(curUserStr);
    setUser(parsedUser);

    // Initial Data Hydration
    const progressStr = localStorage.getItem("progressData");
    if (progressStr) {
      setProgress(JSON.parse(progressStr));
    } else {
      const defaultProgress: UserProgress = {
        totalAttempted: 18,
        correctAnswers: 12,
        wrongAnswers: 6,
        streak: 3,
        completedTasks: ["task_1"],
        categoryProgress: { "Technical": 60, "Aptitude": 45, "Communication": 30, "HR": 80, "Mixed": 50 },
        roleProgress: { "Frontend Developer": 65, "Java Developer": 40 }
      };
      localStorage.setItem("progressData", JSON.stringify(defaultProgress));
      setProgress(defaultProgress);
    }

    const resumesStr = localStorage.getItem("resumeReports") || "[]";
    const parsedResumes = JSON.parse(resumesStr);
    setResumeReports(parsedResumes);

    const historyStr = localStorage.getItem("questionHistory") || "[]";
    const parsedHistory = JSON.parse(historyStr);
    setSessions(parsedHistory);

    const tasksStr = localStorage.getItem("studyPlans") || "[]";
    const parsedTasks = JSON.parse(tasksStr);
    setTasks(parsedTasks);

    // Fetch user pool for Admins
    const usersStr = localStorage.getItem("users") || "[]";
    setAllUsers(JSON.parse(usersStr));
  }, [navigate]);

  // Handle tasks completion status switches inline
  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        // Update user metrics
        setProgress(prev => {
          const nextArr = nextState 
            ? [...prev.completedTasks, taskId] 
            : prev.completedTasks.filter(id => id !== taskId);
          const nextProgress = { ...prev, completedTasks: nextArr };
          localStorage.setItem("progressData", JSON.stringify(nextProgress));
          return nextProgress;
        });
        return { ...t, completed: nextState };
      }
      return t;
    });
    setTasks(updatedTasks);
    localStorage.setItem("studyPlans", JSON.stringify(updatedTasks));
  };

  // Vendor Action: Create custom Syllabus Quiz
  const handleVendorCourseAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorCourse.title) return;

    const newTask: StudyPlanTask = {
      id: "task_vendor_" + Math.random().toString(36).substring(2, 6),
      title: `[Vendor Pack] ${newVendorCourse.title}`,
      category: newVendorCourse.category,
      difficulty: "Medium",
      duration: newVendorCourse.duration,
      completed: false
    };

    const nextTasks = [newTask, ...tasks];
    setTasks(nextTasks);
    localStorage.setItem("studyPlans", JSON.stringify(nextTasks));
    setNewVendorCourse({ title: "", category: "Technical", duration: "1h" });
    alert("Vendor Custom course module successfully published to user plans!");
  };

  // Direct College Action: Assign syllabus checklists
  const handleCollegeTaskAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeTask.title) return;

    const newTask: StudyPlanTask = {
      id: "task_college_" + Math.random().toString(36).substring(2, 6),
      title: `[College Assignment] ${newCollegeTask.title}`,
      category: "Technical",
      difficulty: newCollegeTask.difficulty,
      duration: newCollegeTask.duration,
      completed: false
    };

    const nextTasks = [newTask, ...tasks];
    setTasks(nextTasks);
    localStorage.setItem("studyPlans", JSON.stringify(nextTasks));
    setNewCollegeTask({ title: "", difficulty: "Medium", duration: "1h" });
    alert("New Academic performance target successfully dispatched to assigned students!");
  };

  // Admin User Deletion
  const deleteUserId = (id: string) => {
    const nextUsers = allUsers.filter(u => u.id !== id);
    setAllUsers(nextUsers);
    localStorage.setItem("users", JSON.stringify(nextUsers));
  };

  // Computed fields
  const mockInterviewsCount = sessions.filter(s => s.category === "Mixed").length;
  const recentResume = resumeReports[0];
  const avgScore = sessions.length > 0
    ? Math.round((sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length) * 20) // out of 100
    : 72;

  // Recharts metric timeline data
  const chartData = [
    { name: "Mon", score: 65, avg: 60 },
    { name: "Tue", score: progress.totalAttempted > 0 ? Math.min(avgScore, 85) : 70, avg: 62 },
    { name: "Wed", score: 75, avg: 64 },
    { name: "Thu", score: 82, avg: 67 },
    { name: "Fri", score: avgScore, avg: 72 },
    { name: "Sat", score: 88, avg: 71 },
    { name: "Sun", score: avgScore + 4 > 100 ? 100 : avgScore + 4, avg: 73 }
  ];

  return (
    <div className="space-y-4">
      
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/10 via-white to-white">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
            <Sparkles size={11} className="stroke-indigo-600" />
            <span>AI Practice Dashboard</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-800">
            Elevate Interview Preparation Suite
          </h2>
          <p className="text-[11px] text-slate-500">
            Configure mock categories, test with fallback parameters, or review premium ATS criteria.
          </p>
        </div>
        
        <button
          onClick={() => navigate("/mock-interview")}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Play size={11} className="fill-white" />
          <span>Continue Direct Practice</span>
        </button>
      </div>

      {/* Top dashboard summary states */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Resume Score"
          value={recentResume ? `${recentResume.atsScore}%` : "74%"}
          icon={FileText}
          trend="+4% from upload"
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Mock Interviews"
          value={mockInterviewsCount || 3}
          icon={Video}
          trend={`${mockInterviewsCount + 1} targeted`}
          colorClass="bg-purple-100 text-purple-700"
        />
        <StatCard
          title="Average Score"
          value={`${avgScore}%`}
          icon={Award}
          trend="+2.5% this month"
          colorClass="bg-[#F0FDF4] text-[#16A34A]"
        />
        <StatCard
          title="Practice Streak"
          value={`${progress.streak || 3} Days`}
          icon={Flame}
          trend="Maintain consistency!"
          colorClass="bg-amber-50 text-amber-700"
        />
      </div>

      {/* -------------------- DYNAMIC ROLE-BASED DASHBOARDS -------------------- */}

      {/* A. MAIN ADMIN DASHBOARD SECTION */}
      {user?.role === "Main Admin" && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center gap-3">
            <span className="p-1 px-2.5 rounded-lg bg-indigo-600 text-white text-xs font-black">CEO</span>
            <div>
              <p className="text-xs font-bold text-indigo-900">Main Admin Core Ledger Access Enabled</p>
              <p className="text-[11px] text-indigo-700">Displaying aggregate system financial logs, colleges billing matrices, and user allocations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pricing metrics */}
            <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <DollarSign size={18} />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Total System Revenue</h4>
              </div>
              <p className="text-2xl font-black text-slate-800">$24,950</p>
              <ProgressBar progress={72} label="Direct College Subscriptions" showText />
            </div>

            <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <Users size={18} />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Enterprise Clients</h4>
              </div>
              <p className="text-2xl font-black text-slate-800">14 Partners</p>
              <ProgressBar progress={85} label="Contract Fulfillment Quotient" fillColorClass="bg-emerald-500" showText />
            </div>

            <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-purple-600">
                <GraduationCap size={18} />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">College Users Subscribed</h4>
              </div>
              <p className="text-2xl font-black text-slate-800">1,250 Students</p>
              <ProgressBar progress={58} label="Active Test Run Ratios" fillColorClass="bg-purple-600" showText />
            </div>
          </div>

          {/* System users & financial transaction registers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* System Users Ledger */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Core Registered Platform Accounts ({allUsers.length})</h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-semibold">Live Registry</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="pb-2 font-bold uppercase text-[10px]">Candidate</th>
                      <th className="pb-2 font-bold uppercase text-[10px]">Auth Role</th>
                      <th className="pb-2 font-bold uppercase text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allUsers.map((u: any) => (
                      <tr key={u.id} className="text-slate-700">
                        <td className="py-2.5">
                          <div>
                            <p className="font-bold">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded text-[9px] uppercase">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button 
                            disabled={u.id.includes("demo")}
                            onClick={() => deleteUserId(u.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-40"
                            title="Suspend session"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Transactions Registry */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Institutional Business Ledger</h3>
                <span className="text-[10px] bg-[#EEF2F6] text-indigo-700 font-bold px-2.5 py-0.5 rounded-full">Revenue Ledger</span>
              </div>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl transition-all border border-slate-100">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">{tx.client}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>ID: {tx.id}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-xs font-black text-indigo-600">${tx.amount.toLocaleString()}</span>
                      <p className="text-[9px] text-emerald-600 font-bold">Paid</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* B. STANDARD ADMIN DASHBOARD SECTION */}
      {user?.role === "Admin" && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
            <span className="p-1 px-2.5 rounded-lg bg-emerald-600 text-white text-xs font-black">ADMIN</span>
            <div>
              <p className="text-xs font-bold text-emerald-900">Platform Management Access Approved</p>
              <p className="text-[11px] text-emerald-700">You may examine student demographics and verify reports. Ledger transactions remain isolated.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Manage Users Registry */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Operational Canditates Pool</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">Standard Operations</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="pb-2 font-bold uppercase text-[10px]">User Account</th>
                      <th className="pb-2 font-bold uppercase text-[10px]">System Access</th>
                      <th className="pb-2 font-bold uppercase text-[10px] text-right">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allUsers.map((u: any) => (
                      <tr key={u.id} className="text-slate-700">
                        <td className="py-2.5">
                          <p className="font-bold">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </td>
                        <td className="py-2.5 font-bold text-slate-500">{u.role}</td>
                        <td className="py-2.5 text-right">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[9px] uppercase">
                            Approved
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Isolation Warning */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-center items-center text-center space-y-3 py-10">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <Lock size={20} />
              </div>
              <h4 className="text-xs font-bold text-slate-800 uppercase">Financial Account Isolation</h4>
              <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                As a standard Platform Administrator, business billing modules are restricted.
                No authorization is permitted to access the systems accounts ledger balance. Please contact the CEO / Main Admin if billing access is required.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* C. VENDOR DASHBOARD SECTION */}
      {user?.role === "Vendor" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Content Deployer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Vendor Curriculum Design Studio</h3>
              <p className="text-[11px] text-slate-400">Configure mock questions packages, tasks, or course lists to be injected right into candidate dashboards.</p>
            </div>
            
            <form onSubmit={handleVendorCourseAdd} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Curriculum Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., CSS Box Model Challenges or Advanced Go Concurrency"
                  value={newVendorCourse.title}
                  onChange={(e) => setNewVendorCourse({ ...newVendorCourse, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Practice Track</label>
                  <select
                    value={newVendorCourse.category}
                    onChange={(e) => setNewVendorCourse({ ...newVendorCourse, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-hidden text-slate-800"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Communication">Communication</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Estimated Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1.5h"
                    value={newVendorCourse.duration}
                    onChange={(e) => setNewVendorCourse({ ...newVendorCourse, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-hidden text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Publish Course Assignment</span>
              </button>
            </form>
          </div>

          {/* Assigned Candidates List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Users Assigned to Vendor Training</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">12 Active Users</span>
            </div>
            
            <div className="space-y-3.5 overflow-y-auto max-h-56">
              {[
                { name: "Rahul S.", email: "rahul@boston.edu", track: "Advanced Java", progress: 75 },
                { name: "Sneha G.", email: "sneha@boston.edu", track: "React JS Core", progress: 40 },
                { name: "Dinesh M.", email: "dinesh@recruit.com", track: "CommunicationSTAR", progress: 90 }
              ].map((learner, index) => (
                <div key={index} className="space-y-1.5 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <div>
                      <p className="font-bold text-slate-800">{learner.name}</p>
                      <p className="text-[10px] text-slate-400">{learner.email} • Track: {learner.track}</p>
                    </div>
                    <span>{learner.progress}% Complete</span>
                  </div>
                  <ProgressBar progress={learner.progress} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* D. DIRECT COLLEGE DASHBOARD SECTION */}
      {user?.role === "Direct College" && (
        <div className="space-y-6">
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-center gap-3">
            <span className="p-1 px-2.5 rounded-lg bg-purple-600 text-white text-xs font-black">COLLEGE</span>
            <div>
              <p className="text-xs font-bold text-purple-900">Academic Dean Portal Enabled</p>
              <p className="text-[11px] text-purple-700">Manage student practice checklists, enforce mock assessments, and audit performance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Task Assigner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase font-sans">Assign Training Task Checklist</h3>
                <p className="text-[11px] text-slate-400">Add mandatory technical or quant study goals to all college students.</p>
              </div>

              <form onSubmit={handleCollegeTaskAdd} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Goal Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Solve 10 dynamic Aptitude Equations"
                    value={newCollegeTask.title}
                    onChange={(e) => setNewCollegeTask({ ...newCollegeTask, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-hidden text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Difficulty</label>
                    <select
                      value={newCollegeTask.difficulty}
                      onChange={(e) => setNewCollegeTask({ ...newCollegeTask, difficulty: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-hidden text-slate-800"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Duration Limit</label>
                    <input
                      type="text"
                      required
                      value={newCollegeTask.duration}
                      onChange={(e) => setNewCollegeTask({ ...newCollegeTask, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-hidden text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Assign Academic Target</span>
                </button>
              </form>
            </div>

            {/* Academic Student Trackers */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Institutions Students Performance Registry</h3>
              
              <div className="space-y-3">
                {[
                  { name: "Ashwin K.", role: "Java Track", streak: 5, mockScore: 88, status: "Mastery" },
                  { name: "Priya Sharma", role: "Frontend Track", streak: 2, mockScore: 74, status: "Active" },
                  { name: "Nikhil Anand", role: "Full Stack Track", streak: 0, mockScore: 60, status: "Needs Practice" }
                ].map((std, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs transition-all">
                    <div>
                      <p className="font-bold text-slate-800">{std.name}</p>
                      <p className="text-[10px] text-slate-400">{std.role} • Streak: {std.streak} Days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">Mock: {std.mockScore}%</p>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-0.5 ${
                        std.status === "Mastery" 
                          ? "bg-emerald-50 text-emerald-600" 
                          : std.status === "Active" 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        {std.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- GENERAL STUDENT & CLIENTS & OTHER VIEWS -------------------- */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Progress Chart Core Container */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Performance Growth Metrics</h3>
              <p className="text-[10px] text-slate-400">Continuous daily analytical score tracking vs institutional averages</p>
            </div>
            
            <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>My Score</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Avg Target</span>
              </div>
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "6px", border: "1px solid #e2e8f0", padding: "4px 8px" }} />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={1.5} fillOpacity={1} fill="url(#scoreColor)" />
                <Area type="monotone" dataKey="avg" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Study Plan Checklist Card */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 flex flex-col justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase font-sans">Today's Study Plan</h3>
              <Link to="/study-plan" className="text-indigo-600 text-[11px] font-bold flex items-center hover:underline">
                <span>View Plan</span>
                <ChevronRight size={12} />
              </Link>
            </div>
            
            <p className="text-[10px] text-slate-400">Complete tasks to scale your personal performance milestones before testing starts</p>
            
            <div className="space-y-1.5 pt-1">
              {tasks.slice(0, 3).map((task) => (
                <div 
                   key={task.id} 
                   onClick={() => toggleTaskCompletion(task.id)}
                   className="p-2 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-md flex items-center justify-between gap-2.5 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                      task.completed 
                        ? "bg-slate-700 border-slate-700 text-white" 
                        : "border-slate-300 hover:border-indigo-600 bg-white"
                    }`}>
                      {task.completed && <span className="text-[8px] font-black">✓</span>}
                    </div>
                    <p className={`text-[11px] font-semibold truncate leading-none ${
                      task.completed ? "line-through text-slate-400 font-medium" : "text-slate-700"
                    }`}>
                      {task.title}
                    </p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold bg-white border border-slate-100 px-1 py-0.2 rounded shrink-0">
                    {task.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between bg-[#FCFCFD] -mx-4 -mb-4 p-3 rounded-b-lg">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Overall Goal Target</span>
              <p className="text-xs font-extrabold text-slate-700 leading-none">Complete Practice</p>
            </div>
            
            <button
               onClick={() => navigate("/study-plan")}
               className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded text-[10px] cursor-pointer transition-colors"
            >
              Configure Plan
            </button>
          </div>
        </div>

      </div>

      {/* Bottom widgets layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Resume Analyzer Summary Card */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase leading-none">ATS Resume Analyzer Brief</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded">Active File</span>
          </div>
          {recentResume ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-indigo-50/40 border border-indigo-100 rounded-lg">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-60">{recentResume.fileName}</p>
                  <p className="text-[10px] text-slate-400">Processed: {recentResume.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-indigo-700">ATS Score</p>
                  <span className="text-sm font-extrabold text-indigo-700 leading-none">{recentResume.atsScore}%</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-slate-50/50 text-center rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">Format</span>
                  <p className="text-xs font-extrabold text-slate-800">{recentResume.formattingScore}%</p>
                </div>
                <div className="p-2 bg-slate-50/50 text-center rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">Keywords</span>
                  <p className="text-xs font-extrabold text-slate-800">{recentResume.keywordsScore}%</p>
                </div>
                <div className="p-2 bg-slate-50/50 text-center rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">Experience</span>
                  <p className="text-xs font-extrabold text-slate-800">{recentResume.experienceScore}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">No resume uploaded; receive immediate granular layout and ATS feedback below!</p>
              <button
                onClick={() => navigate("/resume-analyzer")}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <span>Upload & Audit Resume</span>
                <ChevronRight size={10} />
              </button>
            </div>
          )}
        </div>

        {/* Technical Prep Preview Card */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase leading-none">Technical Coding Practice</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">Recommended Round</span>
            </div>
            
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Generate customizable coding challenges and review full algorithmic feedback targeting your career direction.
            </p>

            <div className="p-2 bg-slate-50/55 rounded-lg border border-slate-100 flex items-center justify-between gap-2.5 text-[11px] text-slate-700 font-semibold">
              <span>Target: {user?.selectedRole || "Frontend Developer"}</span>
              <span className="bg-white border border-slate-100 px-1.5 py-0.2 text-[10px] text-indigo-600 rounded">Medium Difficulty</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Dynamic question sets</span>
            <button
              onClick={() => navigate("/technical")}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
            >
              <span>Practice Now</span>
              <ChevronRight size={10} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
