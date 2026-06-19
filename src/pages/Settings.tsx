import React, { useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { Settings, Save, Sparkles, Key, UserCheck, ShieldCheck, Mail, Building, Briefcase } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState<UserRole>("Student / Candidate");
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [statusMessage, setStatusMessage] = useState("");

  const careerRoles = [
    "Frontend Developer",
    "Backend Developer",
    "Java Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Mobile App Developer"
  ];

  const userRolesList: UserRole[] = [
    "Student / Candidate",
    "Direct Client",
    "Direct College",
    "Vendor",
    "Admin",
    "Main Admin"
  ];

  useEffect(() => {
    const curUser = localStorage.getItem("currentUser");
    if (curUser) {
      const parsed: User = JSON.parse(curUser);
      setUser(parsed);
      setName(parsed.name);
      setInstitution(parsed.institution || "");
      setRole(parsed.role);
      setSelectedRole(parsed.selectedRole || "Frontend Developer");
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name,
      institution: institution || undefined,
      role,
      selectedRole: (role === "Student / Candidate" || role === "Direct Client") ? selectedRole : undefined
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
    // Propagate profile to registered accounts pool
    const usersStr = localStorage.getItem("users") || "[]";
    try {
      const parsedUsers = JSON.parse(usersStr);
      const index = parsedUsers.findIndex((u: any) => u.id === user.id);
      if (index !== -1) {
        parsedUsers[index] = { ...parsedUsers[index], ...updatedUser };
        localStorage.setItem("users", JSON.stringify(parsedUsers));
      }
    } catch {}

    setStatusMessage("Profile settings successfully preserved in LocalStorage!");
    
    // Automatically fade status message after brief period
    setTimeout(() => {
      setStatusMessage("");
      // Force system reloads to update the sidebars
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider">
          <Settings size={14} className="stroke-indigo-600" />
          <span>Platform Controls Panel</span>
        </div>
        <h2 className="text-xl font-bold font-sans text-slate-800">Profile & Settings</h2>
        <p className="text-xs text-slate-500">Edit demographic fields, shift authorization presets or review server-side AI configurations.</p>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-800 text-xs font-bold transition-all">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Settings Box */}
        <div className="bg-white border border-slate-205 p-6 md:p-8 rounded-2xl shadow-xs lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide leading-none pb-2 border-b border-slate-50">Operational Identity</h3>
          
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Personal Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <UserCheck size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:ring-1 focus:ring-indigo-600 text-slate-850 font-medium"
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 block">System Account Email (Immutable)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-300 pointer-events-none">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 text-xs rounded-xl text-slate-405 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Profile Role Sandbox Switcher */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Platform Authority Persona</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-800 font-bold"
                >
                  {userRolesList.map((ur) => (
                    <option key={ur} value={ur}>{ur}</option>
                  ))}
                </select>
              </div>

              {/* Targets or Institution Choice */}
              {role === "Student / Candidate" || role === "Direct Client" ? (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Developer Target Track</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-800 font-bold"
                  >
                    {careerRoles.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Partner Institution Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Building size={16} />
                    </span>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:ring-1 focus:ring-indigo-600 text-slate-850 font-medium"
                    />
                  </div>
                </div>
              )}

            </div>

            <div className="pt-3 border-t border-slate-50 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto"
              >
                <Save size={14} />
                <span>Save Profile Parameters</span>
              </button>
            </div>

          </form>
        </div>

        {/* Dynamic AI Architecture explanation panel */}
        <div className="space-y-6 lg:col-span-1">
          
          <div className="bg-white border border-slate-205 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="space-y-0.5">
              <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-755 rounded uppercase">
                Architecture Info
              </span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Developer AI API Pipeline</h3>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ElevateLMS is engineered on top of a highly secure <strong>Two-Tier Full-Stack Server-Proxy</strong> architecture. No credentials leak down to browser consoles:
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-905">
                  <Key size={13} className="text-indigo-600" />
                  <span>Injected API Keys</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Our system extracts keys server-side via process environment parameter: <strong>process.env.GEMINI_API_KEY</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-905">
                  <ShieldCheck size={13} className="text-indigo-600" />
                  <span>Live Endpoint Pipeline</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  When challenging sets are initiated, the React client fires a POST request to <strong>/api/generate-questions</strong>. The Express server initiates a secure GoogleGenAI schema fetch and feeds returned lists back.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              *To update or inspect active secret values, simply expand the Secrets settings drawer in Google AI Studio.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
