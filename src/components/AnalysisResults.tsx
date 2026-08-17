"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Award,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  FileText,
  FileCheck2,
} from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import { ScoreGauge } from "./ScoreGauge";

interface AnalysisResultsProps {
  data: AnalysisResult;
  fileName?: string;
  onReset: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  data,
  fileName,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = async () => {
    const reportText = `=== RESUME AI ANALYSIS REPORT ===
Candidate Resume: ${fileName || "Uploaded Resume"}
Match Score: ${data.matchScore}%

SUMMARY:
${data.summary}

MATCHED SKILLS (${data.matchedSkills.length}):
${data.matchedSkills.map((s) => `• ${s}`).join("\n")}

MISSING / REQUIRED SKILLS (${data.missingSkills.length}):
${data.missingSkills.map((s) => `• ${s}`).join("\n")}

KEY STRENGTHS:
${data.strengths.map((s) => `• ${s}`).join("\n")}

RECOMMENDED IMPROVEMENTS:
${data.improvements.map((s) => `• ${s}`).join("\n")}
=================================`;

    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy report:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Analysis Results
          </h2>
          {fileName && (
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-medium truncate max-w-[200px]">
              {fileName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze Another</span>
          </button>
        </div>
      </div>

      {/* 1. Score Gauge Card */}
      <ScoreGauge score={data.matchScore} />

      {/* 2. Executive Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3>Executive Summary</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* 3. Skills Comparison Grid (Matched vs Missing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3>Matched Skills</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {data.matchedSkills.length} Found
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white text-emerald-800 border border-emerald-200/90 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-950">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3>Missing / Gaps Identified</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {data.missingSkills.length} Gaps
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white text-rose-800 border border-rose-200/90 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Strengths & Improvement Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Award className="w-4 h-4 text-amber-500" />
            <h3>Key Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {data.strengths.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600"
              >
                <span className="w-4 h-4 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Improvements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <h3>Improvement Action Plan</h3>
          </div>
          <ul className="space-y-2.5">
            {data.improvements.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600"
              >
                <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
