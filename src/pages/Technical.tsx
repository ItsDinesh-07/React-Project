import React, { useState, useEffect } from "react";
import { User, Question } from "../types";
import { fetchAIQuestions } from "../utils/ai";
import QuestionCard from "../components/QuestionCard";
import { Award, Code, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Technical() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<"Config" | "Loading" | "Active" | "Summary">("Config");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(0);

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
    try {
      const q = await fetchAIQuestions("Technical", targetRole, difficulty);
      setQuestions(q);
      setCurrentIndex(0);
      setAnswers({});
      setIsLocked(false);
      setScore(0);
      setState("Active");
    } catch {
      setState("Config");
      alert("Error occurred configuring Technical practice compiler.");
    }
  };

  const handleSelectAnswer = (option: string) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const handleCheckAnswer = () => {
    setIsLocked(true);
    if (answers[currentIndex] === questions[currentIndex].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setIsLocked(false);
    } else {
      // Save results
      const historyStr = localStorage.getItem("questionHistory") || "[]";
      let history = [];
      try { history = JSON.parse(historyStr); } catch { history = []; }
      
      history.unshift({
        id: "sess_tech_" + Math.random().toString(36).substring(2, 6),
        category: "Technical",
        role: targetRole,
        difficulty,
        questions,
        score,
        completed: true,
        timestamp: new Date().toLocaleDateString()
      });
      localStorage.setItem("questionHistory", JSON.stringify(history));

      // Update aggregate metrics
      const progressStr = localStorage.getItem("progressData");
      if (progressStr) {
        try {
          const m = JSON.parse(progressStr);
          m.totalAttempted += questions.length;
          m.correctAnswers += score;
          m.wrongAnswers += (questions.length - score);
          m.categoryProgress["Technical"] = Math.min(100, (m.categoryProgress["Technical"] || 20) + 18);
          m.streak += 1;
          localStorage.setItem("progressData", JSON.stringify(m));
        } catch {}
      }

      setState("Summary");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Technical Developer Practice Round</h2>
        <p className="text-xs text-slate-500">Practice core syntax structures, algorithm analysis, optimization patterns, and architecture principles.</p>
      </div>

      {state === "Config" && (
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl max-w-xl space-y-5 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase">Technical practice parameters</h3>
            <p className="text-[11px] text-slate-400">Tailor the assessment around specific engineering profiles.</p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Target Career Role Track</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="E.g. Java Developer"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:ring-1 focus:ring-indigo-600 text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-850 font-semibold"
              >
                <option value="Easy">Easy (Syntax foundations & standard API endpoints)</option>
                <option value="Medium">Medium (Algorithmic optimization & concurrency principles)</option>
                <option value="Hard">Hard (Expert design architecture & legacy JVM memory structures)</option>
              </select>
            </div>
            
            <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
              <Sparkles size={16} className="text-indigo-600 shrink-0 mt-0.5" />
              <span>Advanced reasoning models format dynamic coding evaluations based specifically on your active selected profile track.</span>
            </div>
          </div>
          <button 
            onClick={handleStartExam}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer transition-all"
          >
            Start Technical Practice Set
          </button>
        </div>
      )}

      {state === "Loading" && (
        <div className="bg-white border border-slate-200 p-10 rounded-2xl flex flex-col justify-center items-center text-center space-y-3 min-h-68">
          <RefreshCw size={28} className="text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-slate-700 uppercase">Compiling targeted challenge suite...</p>
        </div>
      )}

      {state === "Active" && questions[currentIndex] && (
        <div className="max-w-2xl">
          <QuestionCard
            question={questions[currentIndex]}
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

      {state === "Summary" && (
        <div className="bg-white border border-slate-205 p-8 rounded-2xl text-center max-w-md space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Code size={24} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 leading-snug">Developer Challenges Completed!</h3>
            <p className="text-xs text-slate-400 mt-1">Excellent job! Your results have been integrated into your progress timeline:</p>
          </div>
          <div className="py-2.5 bg-slate-50 border rounded-xl flex items-center justify-around">
            <div>
              <p className="text-[10px] text-[#94A3B8] uppercase font-bold">Accuracy</p>
              <p className="text-lg font-black text-indigo-750">{Math.round((score / questions.length) * 100)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-[#94A3B8] uppercase font-bold">Passing Blocks</p>
              <p className="text-lg font-black text-emerald-650">{score} / {questions.length}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setState("Config")}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-705 font-bold rounded-lg text-xs"
            >
              Start New Set
            </button>
            <button 
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
