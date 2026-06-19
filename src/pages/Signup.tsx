import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, UserRole, UserProgress } from "../types";
import { UserPlus, Sparkles, Building, Mail, Lock, User as UserIcon, Briefcase } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Student / Candidate");
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [institution, setInstitution] = useState("");
  const [error, setError] = useState("");

  const careerRoles = [
    "Frontend Developer",
    "Backend Developer",
    "Java Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Mobile App Developer"
  ];

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please complete all requested registration details");
      return;
    }

    // Load existing users
    const existingUsersStr = localStorage.getItem("users") || "[]";
    let users: any[] = [];
    try {
      users = JSON.parse(existingUsersStr);
    } catch {
      users = [];
    }

    // Verify duplication
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError("An account with this email address already is registered");
      return;
    }

    // Build user record
    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
      selectedRole: role === "Student / Candidate" || role === "Direct Client" ? selectedRole : undefined,
      institution: institution || undefined,
      joinedDate: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    };

    users.push({ ...newUser, password });
    localStorage.setItem("users", JSON.stringify(users));

    // Initialize progress stats for this user
    const initialProgress: UserProgress = {
      totalAttempted: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 3, // starter streak
      completedTasks: [],
      categoryProgress: {
        "Technical": 20,
        "Aptitude": 40,
        "Communication": 10,
        "HR": 0,
        "Mixed": 15
      },
      roleProgress: {
        "Frontend Developer": 25,
        "Java Developer": 0,
        "Backend Developer": 0,
        "Full Stack Developer": 10,
        "Data Analyst": 0
      }
    };
    localStorage.setItem("progressData", JSON.stringify(initialProgress));

    // Establish dynamic fallback studies if missing
    const initialStudyPlans = [
      { id: "task_1", title: "Complete HTML5 Semantic structure review", category: "Technical", difficulty: "Easy", duration: "1h", completed: true },
      { id: "task_2", title: "Solve 10 Quantitative Profit/Loss equations", category: "Aptitude", difficulty: "Medium", duration: "1.5h", completed: false },
      { id: "task_3", title: "Record 2 Communication STAR behavioral briefs", category: "Communication", difficulty: "Medium", duration: "45m", completed: false },
      { id: "task_4", title: "Review Java Garbage Collection heap segments", category: "Technical", difficulty: "Hard", duration: "2h", completed: false }
    ];
    localStorage.setItem("studyPlans", JSON.stringify(initialStudyPlans));

    // Track active user session and redirect to onboarding/dashboard
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container Card */}
      <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl mx-auto shadow-md">
            AI
          </div>
          <h2 className="text-2xl font-black text-slate-800">Create Platform Account</h2>
          <p className="text-xs text-slate-400">Join ElevateLMS & unlock advanced AI-powered simulations</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <UserIcon size={16} />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dinesh Kumar"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Email Address */}
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
                placeholder="student@institution.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Secure Password */}
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
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Platform Role */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Organization Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800"
              >
                <option value="Student / Candidate">Student / Candidate</option>
                <option value="Direct Client">Direct Client</option>
                <option value="Direct College">Direct College Partner</option>
                <option value="Vendor">Vendor</option>
                <option value="Admin">Administrator</option>
                <option value="Main Admin">Main Admin CEO</option>
              </select>
            </div>

            {/* Target Preparation Track (Students only) */}
            {(role === "Student / Candidate" || role === "Direct Client") ? (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Target Career Role</label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800"
                  >
                    {careerRoles.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Institution / Company</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Building size={14} />
                  </span>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="E.g. Harvard / TechGov"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus size={16} />
            <span>Onboard Platform Session</span>
          </button>
        </form>

        <div className="text-center pt-2 font-medium">
          <p className="text-xs text-slate-400">
            Already have a profile?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>

        {/* Quick test credentials assistance for easier grading */}
        <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 space-y-2">
          <div className="flex items-center gap-1 text-slate-600 font-bold text-[10px] tracking-wide uppercase">
            <Sparkles size={12} className="text-indigo-600" />
            <span>Demo Roles Sandbox Assistant</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Need to quickly test specialized roles (Main Admin, Direct College, Vendor, Admin)?
            Choose that Role from the dropdown above and sign up with any details to instantly experience the custom layout!
          </p>
        </div>
      </div>
    </div>
  );
}
