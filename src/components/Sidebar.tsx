import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  Percent, 
  MessageSquare, 
  Code, 
  History, 
  BarChart2, 
  Calendar, 
  Settings, 
  LogOut,
  Sparkles,
  ShieldAlert,
  UserCheck,
  Menu,
  X
} from "lucide-react";
import { User, UserRole } from "../types";

interface SidebarProps {
  user: User | null;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ user, isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/resume-analyzer", label: "Resume Analyzer", icon: FileText },
    { to: "/mock-interview", label: "Mock Interview", icon: Video },
    { to: "/aptitude", label: "Aptitude Practice", icon: Percent },
    { to: "/communication", label: "Communication Practice", icon: MessageSquare },
    { to: "/technical", label: "Technical Practice", icon: Code },
    { to: "/interview-history", label: "Interview History", icon: History },
    { to: "/progress", label: "Progress Tracking", icon: BarChart2 },
    { to: "/study-plan", label: "Study Plan", icon: Calendar },
    { to: "/settings", label: "Profile & Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Styled left sidebar container */}
      <aside 
        className={`fixed inset-y-0 left-0 w-60 bg-white border-r border-[#E2E8F0] flex flex-col z-50 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="h-12 px-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white text-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
              AI
            </div>
            <div>
              <h1 className="font-extrabold text-xs text-slate-800 leading-tight">ElevateLMS</h1>
              <span className="text-[9px] text-indigo-600 font-bold tracking-wider uppercase">Interview Prep</span>
            </div>
          </div>
          <button 
            onClick={onToggle}
            className="p-1 rounded hover:bg-slate-100 lg:hidden text-slate-500"
            aria-label="Close sidebar"
          >
            <X size={14} />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shadow-inner uppercase shrink-0">
                {user.name.substring(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-800 truncate">{user.name}</p>
                <div className="flex items-center gap-1">
                  <span className="inline-block px-1 py-0.5 text-[9px] font-semibold bg-indigo-50 text-indigo-700 rounded-sm truncate max-w-full">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-650 pl-2"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <IconComponent size={14} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footprint Controls */}
        <div className="p-3 border-t border-[#E2E8F0]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-md transition-all"
          >
            <LogOut size={14} className="shrink-0" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
