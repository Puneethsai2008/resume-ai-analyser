"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";

const STEPS = [
  "Validating PDF file & upload size limits...",
  "Extracting candidate skills and experience...",
  "Cross-referencing against job description requirements...",
  "Calculating match score and generating suggestions...",
];

export const LoadingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-blue-100 bg-linear-to-b from-blue-50/50 to-white p-8 shadow-sm text-center flex flex-col items-center justify-center space-y-6">
      {/* Animated Icon */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900">
          Analyzing Your Resume...
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Comparing resume competencies against target job requirements.
        </p>
      </div>

      {/* Progress steps */}
      <div className="w-full max-w-md space-y-2.5 text-left bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step}
              className={`flex items-center gap-3 text-xs transition-colors ${
                isDone
                  ? "text-emerald-700 font-medium"
                  : isCurrent
                  ? "text-blue-700 font-semibold"
                  : "text-slate-400"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : isCurrent
                    ? "bg-blue-100 text-blue-700 animate-pulse"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
              </div>
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
