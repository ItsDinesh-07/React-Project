import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { User } from "./types";

// Page Views
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import MockInterview from "./pages/MockInterview";
import Aptitude from "./pages/Aptitude";
import Communication from "./pages/Communication";
import Technical from "./pages/Technical";
import InterviewHistory from "./pages/InterviewHistory";
import Progress from "./pages/Progress";
import StudyPlan from "./pages/StudyPlan";
import SettingsPage from "./pages/Settings";

// Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check user session dynamically on location change
  useEffect(() => {
    const sessionUser = localStorage.getItem("currentUser");
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const isAuthScreen = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/role-selection";

  if (isAuthScreen) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      
      {/* Sidebar drawer panel */}
      <Sidebar 
        user={user} 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />

      {/* Primary layout body block */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        
        {/* Personalized header navigation bar */}
        <Header 
          user={user} 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        {/* Core dynamic content viewer */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>

        <footer className="h-12 border-t border-slate-200/50 flex items-center justify-between px-6 text-[10px] text-slate-400 font-semibold bg-white mt-auto">
          <span>ElevateLMS Platform © 2026</span>
          <span className="hidden sm:block">Crafted for Student & Institutional Excellence</span>
        </footer>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* Unprotected Auth Portals */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Main Views */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resume-analyzer" 
            element={
              <ProtectedRoute>
                <ResumeAnalyzer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mock-interview" 
            element={
              <ProtectedRoute>
                <MockInterview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/aptitude" 
            element={
              <ProtectedRoute>
                <Aptitude />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/communication" 
            element={
              <ProtectedRoute>
                <Communication />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/technical" 
            element={
              <ProtectedRoute>
                <Technical />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/interview-history" 
            element={
              <ProtectedRoute>
                <InterviewHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study-plan" 
            element={
              <ProtectedRoute>
                <StudyPlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Redirections */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}
