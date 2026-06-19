import React from "react";

interface ProgressBarProps {
  progress: number; // 0 to 100
  heightClass?: string;
  fillColorClass?: string;
  bgColorClass?: string;
  showText?: boolean;
  label?: string;
}

export default function ProgressBar({
  progress,
  heightClass = "h-2",
  fillColorClass = "bg-indigo-600",
  bgColorClass = "bg-[#F1F5F9]",
  showText = false,
  label
}: ProgressBarProps) {
  // Clamp progress to between 0 and 100
  const percentage = Math.min(Math.max(0, progress), 100);

  return (
    <div className="w-full space-y-1">
      {(label || showText) && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          {label && <span className="truncate">{label}</span>}
          {showText && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden ${bgColorClass} ${heightClass}`}>
        <div 
          className={`rounded-full transition-all duration-500 ease-out ${fillColorClass} h-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
