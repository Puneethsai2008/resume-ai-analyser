import React from "react";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  // Clamped between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Determine tier & colors
  let colorClass = "text-emerald-600";
  let strokeClass = "stroke-emerald-500";
  let bgBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let label = "Strong Match";
  let description = "Your resume shows high relevance for this job posting.";
  let Icon = CheckCircle;

  if (normalizedScore < 60) {
    colorClass = "text-rose-600";
    strokeClass = "stroke-rose-500";
    bgBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
    label = "Low Alignment";
    description = "Significant skill gaps detected. Targeted updates recommended.";
    Icon = AlertCircle;
  } else if (normalizedScore < 80) {
    colorClass = "text-amber-600";
    strokeClass = "stroke-amber-500";
    bgBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    label = "Moderate Match";
    description = "Good baseline skills, but key requirements could be highlighted better.";
    Icon = AlertTriangle;
  }

  // SVG circular progress calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
      {/* Radial Meter */}
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated active stroke */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className={`${strokeClass} transition-all duration-1000 ease-out`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center score text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold tracking-tight ${colorClass}`}>
            {normalizedScore}%
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Match Score
          </span>
        </div>
      </div>

      {/* Narrative status */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${bgBadgeClass}`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Overall Role Compatibility
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md">
          {description}
        </p>
      </div>
    </div>
  );
};
