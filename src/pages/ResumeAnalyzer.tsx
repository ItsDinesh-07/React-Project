import React, { useState, useEffect } from "react";
import { User, ResumeReport } from "../types";
import ProgressBar from "../components/ProgressBar";
import { FileText, Upload, Sparkles, AlertCircle, CheckCircle, FilePlus, RefreshCw, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<ResumeReport[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const curUser = localStorage.getItem("currentUser");
    if (curUser) {
      setUser(JSON.parse(curUser));
    }
    const reportsStr = localStorage.getItem("resumeReports") || "[]";
    setReports(JSON.parse(reportsStr));
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    triggerAnalysis(file.name);
  };

  const triggerAnalysis = (fileName: string) => {
    setAnalyzing(true);
    
    // Simulate ATS analysis parsing delay
    setTimeout(() => {
      const targetRole = user?.selectedRole || "Frontend Developer";
      
      const mathRand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
      
      // Customize recommendations based on role
      let missingSkills: string[] = [];
      let feedback: string[] = [];

      switch (targetRole) {
        case "Frontend Developer":
          missingSkills = ["Tailwind CSS", "TypeScript type-guards", "Next.JS SSR rendering", "Jest Unit testing"];
          feedback = [
            "Your profile mentions JavaScript, but adding modern TypeScript syntax patterns will enhance ATS keyword strength.",
            "Incorporate quantitative metrics under your projects, e.g. 'Improved speed index by 25% using code bundling'."
          ];
          break;
        case "Java Developer":
          missingSkills = ["Spring Boot Microservices", "JUnit 5", "Hibernate JPA", "Docker containers"];
          feedback = [
            "Your experience has classic J2EE frameworks, but microservices architecture with Spring Boot shows larger ATS alignment.",
            "Format your work experiences to emphasize thread management optimizations and cloud deployments."
          ];
          break;
        case "Backend Developer":
          missingSkills = ["Redis Caching", "PostgreSQL database optimization", "REST API versioning", "CI/CD Deployment pipelines"];
          feedback = [
            "Database querying keywords are vague. State specific databases (PostgreSQL/MongoDB) rather than generic 'DB systems'.",
            "Add containerization strategies like Docker/Kubernetes experiences."
          ];
          break;
        case "Data Analyst":
          missingSkills = ["Tableau Visualizations", "Advanced SQL queries", "Pandas DataFrames", "Data warehousing"];
          feedback = [
            "Include your expertise in statistical packages and dashboard automation.",
            "Refine project bullets to show business outcome metrics, e.g., 'saved 14 engineering hours per week with automation'."
          ];
          break;
        default:
          missingSkills = ["Agile Sprint leadership", "System architecture patterns", "Unit test coverage", "Cloud Hosting"];
          feedback = [
            "Make your bullet points active and objective-oriented.",
            "Ensure core tech stack keywords are fully itemized in a dedicated skills partition."
          ];
      }

      const ratingATS = mathRand(75, 93);
      const ratingForm = mathRand(80, 95);
      const ratingKey = mathRand(70, 90);
      const ratingExp = mathRand(72, 92);

      const newReport: ResumeReport = {
        id: "rep_" + Math.random().toString(36).substring(2, 9),
        fileName,
        atsScore: ratingATS,
        formattingScore: ratingForm,
        keywordsScore: ratingKey,
        experienceScore: ratingExp,
        missingSkills,
        feedback,
        timestamp: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      };

      const updated = [newReport, ...reports];
      setReports(updated);
      localStorage.setItem("resumeReports", JSON.stringify(updated));
      setAnalyzing(false);
    }, 2000);
  };

  const deleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem("resumeReports", JSON.stringify(updated));
  };

  const activeReport = reports[0];

  return (
    <div className="space-y-6">
      
      {/* Page header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider">
          <FileText size={14} className="stroke-indigo-600" />
          <span>Resume Analyzer Engine</span>
        </div>
        <h2 className="text-xl font-bold font-sans text-slate-800">
          ATS Matching & Skills Gap Audit
        </h2>
        <p className="text-xs text-slate-500">
          Drag and drop your professional resume or CV file to assess compatibility against your selected carrier profile: <span className="font-bold text-indigo-600">{user?.selectedRole || "Frontend Developer"}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload and History Section */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* File Drag Zone */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`cursor-pointer min-h-64 border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col justify-center items-center text-center space-y-4 ${
              dragActive 
                ? "border-indigo-600 bg-indigo-50/40" 
                : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50/40 bg-white"
            }`}
          >
            {analyzing ? (
              <div className="space-y-3">
                <RefreshCw size={32} className="text-indigo-600 mx-auto animate-spin" />
                <p className="text-xs font-bold text-indigo-900">Parsing Resume PDF Structure...</p>
                <p className="text-[10px] text-slate-400">Comparing text keywords with ATS vocabulary indices</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-normal">
                    Drag & Drop CV PDF File here, or <span className="text-indigo-600 underline">Browse File</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports standard PDF / DOCX up to 5MB</p>
                </div>
                <input 
                  type="file" 
                  accept=".pdf,.docx,.doc" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="resume-upload-input" 
                />
                <label 
                  htmlFor="resume-upload-input"
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl pointer-events-none transition-colors"
                >
                  Locate PDF File
                </label>
              </>
            )}
          </div>

          {/* Previous Reports List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Audit History Logs</h3>
            
            {reports.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-4">No analysis history logged yet</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {reports.map((rep) => (
                  <div 
                    key={rep.id}
                    className="p-3 bg-slate-50/55 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs group transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5 truncate flex-1">
                      <p className="font-bold text-slate-800 truncate leading-snug">{rep.fileName}</p>
                      <p className="text-[10px] text-slate-400">{rep.timestamp}</p>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-slate-700 bg-white border border-slate-100 px-1.5 py-0.5 rounded">
                        {rep.atsScore}%
                      </span>
                      <button 
                        onClick={(e) => deleteReport(rep.id, e)}
                        className="text-slate-400 hover:text-rose-600 h-6 w-6 rounded-md hover:bg-rose-50 flex items-center justify-center transition-colors"
                        title="Delete historic entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Audit Results Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeReport ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
              
              {/* ATS Headline Score */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-150">
                <div className="space-y-2">
                  <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-[#F0FDF4] text-[#16A34A] rounded shadow-xs uppercase">
                    Audit Status: Optimized
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-slate-800 leading-tight">
                    ATS Audit parsing matches: <span className="text-indigo-600">{activeReport.atsScore}% Score</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Calculated for current targeted preparation persona: <span className="font-bold text-slate-700">{user?.selectedRole || "Frontend Developer"}</span>
                  </p>
                </div>
                
                {/* Visual Circle Gauge */}
                <div className="w-20 h-20 rounded-full bg-[#EEF2F6] flex items-center justify-center p-1.5 shadow-inner shrink-0 relative">
                  <div className="w-full h-full rounded-full border-4 border-indigo-600 border-r-transparent animate-spin duration-1000 absolute hidden" />
                  <div className="w-full h-full rounded-full bg-white flex flex-col justify-center items-center text-center">
                    <span className="text-[11px] font-bold text-slate-400 leading-none">ATS</span>
                    <span className="text-lg font-black text-indigo-700 leading-tight">{activeReport.atsScore}%</span>
                  </div>
                </div>
              </div>

              {/* Sub-Category Scores Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Formatting & Syntax</p>
                  <p className="text-xl font-bold text-slate-850 leading-none">{activeReport.formattingScore}%</p>
                  <ProgressBar progress={activeReport.formattingScore} heightClass="h-1.5" />
                  <span className="text-[9px] text-slate-400">Simple font & layouts applied</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keywords density</p>
                  <p className="text-xl font-bold text-slate-850 leading-none">{activeReport.keywordsScore}%</p>
                  <ProgressBar progress={activeReport.keywordsScore} heightClass="h-1.5" fillColorClass="bg-purple-600" />
                  <span className="text-[9px] text-slate-400">Competency vocabulary tags matching</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience metrics</p>
                  <p className="text-xl font-bold text-slate-850 leading-none">{activeReport.experienceScore}%</p>
                  <ProgressBar progress={activeReport.experienceScore} heightClass="h-1.5" fillColorClass="bg-emerald-500" />
                  <span className="text-[9px] text-slate-400">Action verbs and numerical metrics</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* A. Missing Industry Skills Key */}
                <div className="space-y-3 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#b45309]">
                    <AlertCircle size={15} />
                    <span>Missing Skills gaps detected</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Inject these key terms into your skills description box to bypass Automated ATS filtering:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeReport.missingSkills.map((sk) => (
                      <span key={sk} className="text-[10px] bg-amber-50 border border-amber-200/50 text-amber-800 px-2.5 py-1 rounded-full font-bold">
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* B. Actionable recommendations list */}
                <div className="space-y-3 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                    <CheckCircle size={15} />
                    <span>Actionable Improvements List</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-slate-600">
                    {activeReport.feedback.map((feed, idx) => (
                      <div key={idx} className="flex gap-2 items-start leading-relaxed">
                        <span className="inline-block w-4 h-4 rounded-full bg-emerald-55 text-emerald-700 font-bold text-[9px] flex items-center justify-center shrink-0">✓</span>
                        <p>{feed}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Study Plan recommendations shortcut */}
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-semibold gap-3">
                <p className="text-indigo-800">Analyze completed! Want to practice custom syllabus tasks optimized around these parsed skill gaps?</p>
                <button
                  onClick={() => navigate("/study-plan")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shrink-0 shadow-sm cursor-pointer transition-colors text-[11px]"
                >
                  Configure Study Plan
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-xs flex flex-col justify-center items-center text-center space-y-4 min-h-96">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <FilePlus size={28} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase">CV Analyzer Sandbox Ready</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">Upload your resume to calculate formatting averages, search keywords overlap metrics, and extract concrete CV optimizations within seconds.</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
