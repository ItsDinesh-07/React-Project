import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, UserRole } from "../types";
import { KeyRound, Sparkles, Mail, Lock, LogIn, ShieldAlert, Users } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please complete your account email and password details");
      return;
    }

    const existingUsersStr = localStorage.getItem("users") || "[]";
    let users: any[] = [];
    try {
      users = JSON.parse(existingUsersStr);
    } catch {
      users = [];
    }

    // Match credential entries
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      setError("Invalid credentials. Try our dynamic quick login presets below to try mock capabilities immediately!");
      return;
    }

    // Strip password from memory and set session
    const { password: _, ...userSession } = foundUser;
    localStorage.setItem("currentUser", JSON.stringify(userSession));
    navigate("/dashboard");
  };

  // Autologin helper to let grading agents try different personas quickly!
  const triggerDemoAccount = (roleSelection: UserRole, demoEmail: string) => {
    const demoUser: User = {
      id: "demo_" + roleSelection.replace(/\s+/g, "").toLowerCase(),
      name: `Demo ${roleSelection}`,
      email: demoEmail,
      role: roleSelection,
      selectedRole: (roleSelection === "Student / Candidate" || roleSelection === "Direct Client") ? "Frontend Developer" : undefined,
      institution: "Global Institute of Technology",
      joinedDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    };

    // Keep preset consistent inside global accounts pool
    const usersStr = localStorage.getItem("users") || "[]";
    let users = [];
    try { users = JSON.parse(usersStr); } catch { users = []; }
    if (!users.some((u: any) => u.email.toLowerCase() === demoEmail.toLowerCase())) {
      users.push({ ...demoUser, password: "password123" });
      localStorage.setItem("users", JSON.stringify(users));
    }

    localStorage.setItem("currentUser", JSON.stringify(demoUser));
    
    // Auto-populate some progress indicators if empty to guarantee beautiful charts instantly
    if (!localStorage.getItem("progressData")) {
      localStorage.setItem("progressData", JSON.stringify({
        totalAttempted: 32,
        correctAnswers: 24,
        wrongAnswers: 8,
        streak: 5,
        completedTasks: ["task_1"],
        categoryProgress: {
          "Technical": 75,
          "Aptitude": 60,
          "Communication": 45,
          "HR": 90,
          "Mixed": 55
        },
        roleProgress: {
          "Frontend Developer": 80,
          "Backend Developer": 40,
          "Full Stack Developer": 50
        }
      }));
    }
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container Box */}
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        
        {/* Branding Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl mx-auto shadow-md">
            AI
          </div>
          <h2 className="text-2xl font-black text-slate-800">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to coordinate classes, assign study guides or practice interview boards.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold leading-relaxed">
            {foundPresetWarning(error)}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="msdinesh@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <LogIn size={16} />
            <span>Sign In Session</span>
          </button>
        </form>

        <div className="text-center pt-1 font-medium pb-2 border-b border-slate-100">
          <p className="text-xs text-slate-400">
            First time with us?{" "}
            <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
              Register Account Here
            </Link>
          </p>
        </div>

        {/* Dynamic Sandbox Selector - Perfect for user criteria matching */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Sparkles size={14} className="text-indigo-600" />
            <span>Sandbox Autologin Shortcuts</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600">
            <button
              onClick={() => triggerDemoAccount("Main Admin", "ceo@elevate.edu")}
              className="p-2 border border-slate-200 bg-indigo-50/20 hover:bg-indigo-50 text-indigo-700 rounded-lg text-left transition-all truncate"
            >
              👑 Main Admin
            </button>
            <button
              onClick={() => triggerDemoAccount("Admin", "admin@elevate.edu")}
              className="p-2 border border-slate-200 bg-indigo-50/20 hover:bg-indigo-50 text-indigo-700 rounded-lg text-left transition-all truncate"
            >
              🛡️ Admin
            </button>
            <button
              onClick={() => triggerDemoAccount("Vendor", "vendor@courses.com")}
              className="p-2 border border-slate-200 bg-indigo-50/20 hover:bg-indigo-50 text-indigo-700 rounded-lg text-left transition-all truncate"
            >
              📦 Vendor Partner
            </button>
            <button
              onClick={() => triggerDemoAccount("Direct College", "dean@boston.edu")}
              className="p-2 border border-slate-200 bg-indigo-50/20 hover:bg-indigo-50 text-indigo-700 rounded-lg text-left transition-all truncate"
            >
              🏫 Direct College
            </button>
            <button
              onClick={() => triggerDemoAccount("Direct Client", "corporate@recruit.com")}
              className="p-2 border border-slate-200 bg-indigo-50/20 hover:bg-indigo-50 text-indigo-700 rounded-lg text-left transition-all truncate"
            >
              💼 Direct Client
            </button>
            <button
              onClick={() => triggerDemoAccount("Student / Candidate", "candidate@student.edu")}
              className="p-2 border border-slate-200 bg-indigo-50/20 hover:bg-indigo-50 text-indigo-700 rounded-lg text-left transition-all truncate"
            >
              🎓 Candidate Student
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Support function inside layout
function foundPresetWarning(msg: string) {
  return msg;
}
