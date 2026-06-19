import React from "react";
import { Check, X, Award, Info, ChevronRight, HelpCircle } from "lucide-react";
import { Question } from "../types";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | undefined;
  onAnswerSelect: (answer: string) => void;
  questionIndex: number;
  totalQuestions: number;
  isLocked: boolean; // Has the user submitted/checked this question
  onCheckAnswer: () => void;
  onNext: () => void;
  explanationText?: string;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionIndex,
  totalQuestions,
  isLocked,
  onCheckAnswer,
  onNext,
  explanationText
}: QuestionCardProps) {
  
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all">
      {/* Header index status banner */}
      <div className="bg-indigo-50/50 border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-indigo-600 shrink-0" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
            PRACTICE QUESTION {questionIndex} OF {totalQuestions}
          </span>
        </div>
        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
          Progress: {Math.round((questionIndex / totalQuestions) * 100)}%
        </span>
      </div>

      {/* Actual Question Text */}
      <div className="p-6 md:p-8 space-y-6">
        <h3 className="text-base md:text-lg font-bold text-slate-800 leading-snug">
          {question.question}
        </h3>

        {/* Option Selectors Grid */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            
            let btnStyle = "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/55";
            let letterStyle = "bg-slate-100 text-slate-700";
            
            if (isSelected) {
              btnStyle = "border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/20";
              letterStyle = "bg-indigo-600 text-white";
            }
            
            if (isLocked) {
              // Highlight option coloring post submission
              if (option === question.correctAnswer) {
                btnStyle = "border-emerald-600 bg-emerald-50/80 text-emerald-900";
                letterStyle = "bg-emerald-600 text-white";
              } else if (isSelected && !isCorrect) {
                btnStyle = "border-rose-300 bg-rose-50/80 text-rose-900";
                letterStyle = "bg-rose-500 text-white";
              } else {
                btnStyle = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                letterStyle = "bg-slate-200 text-slate-400";
              }
            }

            return (
              <button
                key={option}
                disabled={isLocked}
                onClick={() => onAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-xl border flex items-center gap-3.5 transition-all text-xs font-medium cursor-pointer ${btnStyle}`}
              >
                <span className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs shrink-0 shadow-xs ${letterStyle}`}>
                  {letter}
                </span>
                <span className="flex-1 leading-relaxed">{option}</span>
                
                {isLocked && option === question.correctAnswer && (
                  <Check size={16} className="text-emerald-600 shrink-0" />
                )}
                {isLocked && isSelected && !isCorrect && (
                  <X size={16} className="text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            {!selectedAnswer && (
              <p className="text-xs text-amber-600 font-medium">Please pick a scenario select choice to evaluate</p>
            )}
            {selectedAnswer && !isLocked && (
              <p className="text-xs text-indigo-600 font-semibold">Press trigger to check answer validity</p>
            )}
          </div>

          <div className="flex gap-3">
            {selectedAnswer && !isLocked && (
              <button
                onClick={onCheckAnswer}
                className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl text-xs flex items-center transition-all cursor-pointer shadow-sm"
              >
                Submit Answer
              </button>
            )}

            {isLocked && (
              <button
                onClick={onNext}
                className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <span>{questionIndex === totalQuestions ? "See Evaluation" : "Next Question"}</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Explanation Drawer */}
        {isLocked && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed transition-all ${
            isCorrect 
              ? "bg-emerald-50/50 border-emerald-100 text-slate-700" 
              : "bg-rose-50/50 border-rose-100 text-slate-700"
          }`}>
            <Info size={16} className={`shrink-0 mt-0.5 ${isCorrect ? "text-emerald-600" : "text-rose-500"}`} />
            <div>
              <p className="font-bold mb-1">
                {isCorrect ? "✓ Absolutely Correct!" : `✗ Incorrect Answer. (Correct: ${question.correctAnswer})`}
              </p>
              <p>{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
