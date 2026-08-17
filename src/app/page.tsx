"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { FileUpload } from "@/components/FileUpload";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { AnalysisResults } from "@/components/AnalysisResults";
import { LoadingState } from "@/components/LoadingState";
import { AnalysisResult } from "@/lib/types";
import { DEFAULT_MOCK_ANALYSIS, SAMPLE_JOB_DESCRIPTION } from "@/lib/mockData";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, AlertCircle } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Quick 1-click Demo helper to test the full analysis view immediately
  const handleLoadDemoData = () => {
    // Create a mock PDF file object
    const mockFile = new File(["dummy pdf content"], "Sample_Frontend_Resume.pdf", {
      type: "application/pdf",
    });
    setSelectedFile(mockFile);
    setFileError(null);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setAnalysisResult(DEFAULT_MOCK_ANALYSIS);
    setApiError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Validation 1: Resume file
    if (!selectedFile) {
      setFileError("Please select or drop a PDF resume first.");
      return;
    }

    // Validation 2: Job description length
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setApiError("Please provide a job description (at least 20 characters) to compare against.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Analysis failed. Please try again.");
      }

      setAnalysisResult(json.data);
    } catch (err) {
      console.error("Analysis request error:", err);
      setApiError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while analyzing the resume."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileError(null);
    setJobDescription("");
    setAnalysisResult(null);
    setApiError(null);
  };

  const isFormValid = !!selectedFile && jobDescription.trim().length >= 20;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Smart ATS Resume Analyzer & Optimization
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Match your resume to your{" "}
            <span className="text-blue-600">dream job</span> in seconds
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            Upload your resume PDF and paste the target job description to get an instant match score, skill gap identification, and actionable suggestions to pass ATS filters.
          </p>

          {!analysisResult && !isAnalyzing && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLoadDemoData}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-4 py-2 rounded-xl transition-all shadow-2xs hover:shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Try Instant Demo with Sample Data</span>
              </button>
            </div>
          )}
        </section>

        {/* Global API Error Alert */}
        {apiError && (
          <div className="max-w-3xl mx-auto flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-rose-700 text-xs mt-0.5">{apiError}</p>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-xs font-bold text-rose-500 hover:text-rose-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Main Workspace: Input Form vs Loading vs Results */}
        {isAnalyzing ? (
          <div className="max-w-2xl mx-auto">
            <LoadingState />
          </div>
        ) : analysisResult ? (
          <div className="max-w-4xl mx-auto">
            <AnalysisResults
              data={analysisResult}
              fileName={selectedFile?.name}
              onReset={handleReset}
            />
          </div>
        ) : (
          <form
            onSubmit={handleAnalyze}
            className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8"
          >
            {/* Input Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Step 1: Upload PDF */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Step 1: Your Resume
                  </span>
                </div>
                <FileUpload
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  error={fileError}
                  onError={setFileError}
                />
              </div>

              {/* Step 2: Job Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Step 2: Target Job
                  </span>
                </div>
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={(val) => {
                    setJobDescription(val);
                    if (apiError) setApiError(null);
                  }}
                  disabled={isAnalyzing}
                />
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Files processed securely
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  PDF only (max 3 MB)
                </span>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isAnalyzing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                <span>Analyze Resume Match</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Feature Highlights Grid */}
        <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              🎯
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              ATS Match Scoring
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculates keyword and competency alignment to predict applicant tracking system compatibility.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              🔍
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Skill Gap Detection
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instantly spots critical requirements and domain skills missing from your resume.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              💡
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Targeted Action Plan
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provides concrete, step-by-step suggestions to strengthen your resume before applying.
            </p>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-700">Resume AI Analyser · Full-Stack Next.js Project</p>
          <p>Built with TypeScript, Tailwind CSS, and Zod</p>
        </div>
      </footer>
    </div>
  );
}
