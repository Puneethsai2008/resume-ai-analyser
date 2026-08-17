"use client";

import React from "react";
import { Briefcase, Wand2, Trash2 } from "lucide-react";
import { SAMPLE_JOB_DESCRIPTION } from "@/lib/mockData";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  const handleFillSample = () => {
    onChange(SAMPLE_JOB_DESCRIPTION);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="job-description"
          className="text-sm font-semibold text-slate-800 flex items-center gap-2"
        >
          <Briefcase className="w-4 h-4 text-blue-600" />
          Job Description
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillSample}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Fill Sample Job
          </button>
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="text-xs text-slate-400 hover:text-rose-600 p-1 transition-colors"
              title="Clear job description"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          id="job-description"
          rows={7}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the target job description or role requirements here (e.g. key responsibilities, required technical skills, years of experience)..."
          className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-hidden transition-all resize-y min-h-[160px] disabled:opacity-60"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
};
