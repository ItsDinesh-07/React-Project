import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Award, Bell, Flame, UserCheck, Briefcase } from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  user: User | null;
  onSidebarToggle: () => void;
}

export default function Header({ user, onSidebarToggle }: HeaderProps) {
  const navigate = useNavigate();

  // Pick up local analytics to display active status in the bar
  const progressString = localStorage.getItem("progressData");
  const progress = progressString ? JSON.parse(progressString) : { streak: 3, totalAttempted: 12 };

  // Generate friendly time greetings
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="sticky top-0 z-30 h-12 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Left side actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSidebarToggle}
          className="p-1 rounded-md text-slate-500 hover:bg-slate-100 lg:hidden focus:outline-hidden"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu size={16} />
        </button>

        <div>
          <h2 className="text-xs font-bold text-slate-800 leading-tight">
            {getGreeting()}, {user?.name || "Guest"}!
          </h2>
          <p className="text-[10px] text-slate-500 hidden sm:block">
            Ready to enhance your conceptual skills and pass your benchmarks?
          </p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Streak indicator */}
        <div 
          onClick={() => navigate("/progress")}
          className="cursor-pointer flex items-center gap-1 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full text-amber-700 hover:bg-amber-100 transition-all text-[10px] font-semibold"
          title="Daily Streak Counter"
        >
          <Flame size={12} className="fill-amber-500 stroke-amber-600 accent-amber-500" />
          <span>{progress.streak || 1}d Streak</span>
        </div>

        {/* Selected target career role badge */}
        {user?.selectedRole && (
          <div className="hidden md:flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full text-indigo-700 text-[10px] font-semibold">
            <Briefcase size={10} className="text-indigo-600" />
            <span>Target: {user.selectedRole}</span>
          </div>
        )}

        {/* Link shortcuts */}
        <Link 
          to="/settings"
          className="w-6.5 h-6.5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          title="Profile Preferences"
        >
          <Award size={13} />
        </Link>
      </div>
    </header>
  );
}
