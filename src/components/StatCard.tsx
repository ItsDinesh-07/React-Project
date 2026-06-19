import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  colorClass?: string; // e.g., "bg-indigo-50 text-indigo-600"
}

export default function StatCard({ 
  title, 
  value, 
  icon: IconComponent, 
  trend, 
  trendDirection = "up", 
  colorClass = "bg-[#EEF2F6] text-[#475569]" 
}: StatCardProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:shadow-xs hover:border-slate-300 flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[10px] font-bold tracking-tight uppercase text-slate-400">{title}</span>
        <h3 className="text-lg font-extrabold font-sans text-slate-800 leading-none">{value}</h3>
        
        {trend && (
          <div className="flex items-center gap-1 mt-0.5 text-[10px]">
            <span className={`font-semibold shrink-0 ${
              trendDirection === "up" 
                ? "text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded" 
                : trendDirection === "down" 
                ? "text-rose-700 bg-rose-50 px-1 py-0.2 rounded" 
                : "text-slate-650 bg-slate-100 px-1 py-0.2 rounded"
            }`}>
              {trend}
            </span>
          </div>
        )}
      </div>

      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 shadow-xs ${colorClass}`}>
        <IconComponent size={14} />
      </div>
    </div>
  );
}
