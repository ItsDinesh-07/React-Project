import React, { useState, useEffect } from "react";
import { User, Question, PracticeSession } from "../types";
import { fetchAIQuestions } from "../utils/ai";
import QuestionCard from "../components/QuestionCard";
import { Video, HelpCircle, Activity, Award, Sparkles, AlertCircle, Bookmark, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MockInterview() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  // Simulation config parameters
  const [targetCategory, setTargetCategory] = useState<any>("Mixed");
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  
  // Interactive flow state machine
  const [state, setState] = useState<"Config" | "Loading" | "Active" | "Summary">("Config");
  
  // Running practice statistics variables
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(0);
  
  // Loading indicators
  const [loadingText, setLoadingText] = useState("Initializing model parameters...");

  useEffect(() => {
    const curUser = localStorage.getItem("currentUser");
    if (curUser) {
      const parsed = JSON.parse(curUser);
      setUser(parsed);
      if (parsed.selectedRole) {
        setTargetRole(parsed.selectedRole);
      }
    }
  }, []);

  const handleStartExam = async () => {
    setState("Loading");
    setLoadingText("Configuring dynamic context guidelines...");
    
    setTimeout(() => {
      setLoadingText("Querying Gemini API server-side endpoint...");
    }, 700);

    try {
      const liveQuestions = await fetchAIQuestions(targetCategory, targetRole, difficulty);
      setQuestions(liveQuestions);
      setCurrentIndex(0);
      setAnswers({});
      setIsLocked(false);
      setScore(0);
      setState("Active");
    } catch (err) {
      console.error(err);
      setState("Config");
      alert("Error building simulated assessment questions. Please try again.");
    }
  };

  const handleSelectAnswer = (option: string) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const handleCheckAnswer = () => {
    setIsLocked(true);
    const correct = questions[currentIndex].correctAnswer;
    if (answers[currentIndex] === correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsLocked(false);
    } else {
      // Simulation summary finalized
      handleFinalizeExam();
    }
  };

  const handleFinalizeExam = () => {
    const finalScorePercent = Math.round((score / questions.length) * 100);
    
    const newSessionState: PracticeSession = {
      id: "sess_" + Math.random().toString(36).substring(2, 9),
      category: targetCategory,
      role: targetRole,
      difficulty,
      questions,
      currentIdx: currentIndex,
      answers,
      score,
      completed: true,
      timestamp: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    // Save logs down to LocalStorage
    const historyStr = localStorage.getItem("questionHistory") || "[]";
    let history = [];
    try { history = JSON.parse(historyStr); } catch { history = []; }
    history.unshift(newSessionState);
    localStorage.setItem("questionHistory", JSON.stringify(history));

    // Also update overall metrics progress
    const progressStr = localStorage.getItem("progressData");
    if (progressStr) {
      try {
        const metrics = JSON.parse(progressStr);
        metrics.totalAttempted += questions.length;
        metrics.correctAnswers += score;
        metrics.wrongAnswers += (questions.length - score);
        
        // Boost category completion percentage relative to performance
        if (!metrics.categoryProgress[targetCategory]) {
          metrics.categoryProgress[targetCategory] = 20;
        }
        metrics.categoryProgress[targetCategory] = Math.min(100, metrics.categoryProgress[targetCategory] + 15);
        
        // Add streak bonus
        metrics.streak += 1;
        localStorage.setItem("progressData", JSON.stringify(metrics));
      } catch (e) {
        console.error(e);
      }
    }

    setState("Summary");
  };

  const activeQuestion = questions[currentIndex];

  return (
    <div className="space-y-6">
      
      {/* Upper header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider">
          <Video size={14} className="stroke-indigo-600" />
          <span>Interactive Interview Preparation Simulation</span>
        </div>
        <h2 className="text-xl font-bold font-sans text-slate-800">Mock Assessment Board</h2>
        <p className="text-xs text-slate-500">
          Combine Technical knowledge, HR behaviors and Logical Aptitude questions within an immersive, automated assessment cycle.
        </p>
      </div>

      {/* State A: Configuration Screen */}
      {state === "Config" && (
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 max-w-2xl">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase">Simulate Target Board Environment</h3>
            <p className="text-[10px] text-slate-400">Configure parameters relative to custom client target standards or institution criteria.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* 1. Category */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Assessment Field Set</label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 text-slate-800"
              >
                <option value="Mixed">Mixed (Standard Core Compilations)</option>
                <option value="Technical">Technical Competency</option>
                <option value="Aptitude">Quantitative Logical Aptitude</option>
                <option value="Communication">Active Communicator Behavior</option>
                <option value="HR">HR & Management Leadership</option>
              </select>
            </div>

            {/* 2. Role */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Career Profile Target</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="E.g., Full Stack Developer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 text-slate-800"
              />
            </div>

            {/* 3. Difficulty */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Complexity Threshold</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 text-slate-800"
              >
                <option value="Easy">Easy (Foundation Concepts)</option>
                <option value="Medium">Medium (Developer Benchmark)</option>
                <option value="Hard">Hard (Expert Architecture)</option>
              </select>
            </div>

            {/* Core Assistance Info */}
            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-start gap-2 text-[10px] text-slate-600 leading-relaxed sm:col-span-2">
              <Sparkles size={14} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-indigo-900 mb-0.5">Automated Question Fetching Framework</p>
                <p>Bespoke client-side simulations fetch custom MCQs dynamically. ElevateLMS pairs actual Gemini server endpoints with structured fallback assets to guarantee immediate feedback.</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleStartExam}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Initialize Board Simulation</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* State B: Loading Screen */}
      {state === "Loading" && (
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-center items-center text-center space-y-3 min-h-64 max-w-2xl">
          <RefreshCw size={24} className="text-indigo-600 animate-spin" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Generating Dynamic Interview Questions</h4>
            <p className="text-[11px] text-slate-450">{loadingText}</p>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-400 max-w-sm italic">
            "Tip: Bypassing generic templates gives you a key evaluating edge"
          </div>
        </div>
      )}

      {/* State C: Active Simulation Round */}
      {state === "Active" && activeQuestion && (
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center justify-between text-[11px] bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <p className="text-slate-500 font-bold">
              Active Focus: <span className="text-indigo-600">{targetRole} • {targetCategory}</span>
            </p>
            <p className="text-slate-500 font-bold">
              Score: <span className="text-indigo-600">{score} Points</span>
            </p>
          </div>

          <QuestionCard
            question={activeQuestion}
            selectedAnswer={answers[currentIndex]}
            onAnswerSelect={handleSelectAnswer}
            questionIndex={currentIndex + 1}
            totalQuestions={questions.length}
            isLocked={isLocked}
            onCheckAnswer={handleCheckAnswer}
            onNext={handleNext}
          />
        </div>
      )}

      {/* State D: Simulation Summary Results dashboard */}
      {state === "Summary" && (
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] max-w-xl space-y-4">
          
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Award size={20} />
            </div>
            
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-slate-800">Exam Round Completed Successfully!</h3>
              <p className="text-[10px] text-slate-400 font-medium">Your mock metrics have been compiled and exported to your progress logs.</p>
            </div>
          </div>

          {/* Aggregate metrics widgets */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 space-y-0.5">
              <span className="text-[9px] tracking-wider font-bold text-slate-400 uppercase">Mock Score</span>
              <p className="text-sm font-black text-indigo-700">{score} / {questions.length}</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 space-y-0.5">
              <span className="text-[9px] tracking-wider font-bold text-slate-400 uppercase">Correct Ratio</span>
              <p className="text-sm font-black text-emerald-600">{Math.round((score / questions.length) * 100)}%</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 space-y-0.5">
              <span className="text-[9px] tracking-wider font-bold text-slate-400 uppercase">Status Scale</span>
              <p className="text-[10px] font-bold text-slate-700 uppercase leading-normal">
                {score >= 4 ? "🥇 Mastery" : score >= 3 ? "🥈 Ready" : "🥉 Practice"}
              </p>
            </div>
          </div>

          {/* Conceptual critique feedback summary */}
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-slate-700 text-xs leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1 text-indigo-900 font-bold">
              <AlertCircle size={14} />
              <span>Simulated Performance Evaluation Feedback</span>
            </div>
            <p className="text-[11px]">
              Excellent effort in completed assessment categories of <strong>{targetCategory}</strong>! Your results indicate solid foundation concept retention. Continue implementing specific study checklist items to guarantee higher performance.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5 font-semibold">
            <button
              onClick={() => setState("Config")}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center"
            >
              Start New Round
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-all shadow-xs cursor-pointer text-center"
            >
              Back to Dashboard
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
