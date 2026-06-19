import React, { useState, useEffect } from "react";
import { User, Question } from "../types";
import { fetchAIQuestions } from "../utils/ai";
import QuestionCard from "../components/QuestionCard";
import { Award, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Aptitude() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<"Config" | "Loading" | "Active" | "Summary">("Config");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const curUser = localStorage.getItem("currentUser");
    if (curUser) {
      setUser(JSON.parse(curUser));
    }
  }, []);

  const handleStartExam = async () => {
    setState("Loading");
    try {
      const q = await fetchAIQuestions("Aptitude", user?.selectedRole || "Frontend Developer", difficulty);
      setQuestions(q);
      setCurrentIndex(0);
      setAnswers({});
      setIsLocked(false);
      setScore(0);
      setState("Active");
    } catch {
      setState("Config");
      alert("Error occurred configuring your custom Aptitude challenges.");
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
        id: "sess_apt_" + Math.random().toString(36).substring(2, 6),
        category: "Aptitude",
        role: user?.selectedRole || "Student",
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
          m.categoryProgress["Aptitude"] = Math.min(100, (m.categoryProgress["Aptitude"] || 20) + 12);
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
        <h2 className="text-xl font-bold text-slate-800">Quantitative Logical Aptitude Round</h2>
        <p className="text-xs text-slate-500">Practice logical, numerical, ratio progression, and algebraic equations.</p>
      </div>

      {state === "Config" && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-xl space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 uppercase">Aptitude Round Settings</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-800 font-semibold"
              >
                <option value="Easy">Easy (Focus on simple Ratios / math averages)</option>
                <option value="Medium">Medium (Corporate Entry standard Algebra)</option>
                <option value="Hard">Hard (Expert Analytical Probability matrices)</option>
              </select>
            </div>
            
            <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
              <Zap size={16} className="text-indigo-600 shrink-0 mt-0.5" />
              <span>Quantitative puzzles optimize logic speed indexing, a major metric evaluated by Top Client hiring divisions.</span>
            </div>
          </div>
          <button 
            onClick={handleStartExam}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer transition-all"
          >
            Start Aptitude Practice Set
          </button>
        </div>
      )}

      {state === "Loading" && (
        <div className="bg-white border border-slate-200 p-10 rounded-2xl flex flex-col justify-center items-center text-center space-y-3 min-h-68">
          <RefreshCw size={28} className="text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-slate-700 uppercase">Formatting Arithmetic Practice sets</p>
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
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 leading-snug">Practice set cleared!</h3>
            <p className="text-xs text-slate-400 mt-1">Successfully stored results. Let's see your correct matches:</p>
          </div>
          <div className="py-2.5 bg-slate-50 border rounded-xl flex items-center justify-around">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</p>
              <p className="text-lg font-black text-indigo-700">{Math.round((score / questions.length) * 100)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Correct Answers</p>
              <p className="text-lg font-black text-emerald-600">{score} / {questions.length}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setState("Config")}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
            >
              Start Again
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
