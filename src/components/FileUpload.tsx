"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileCheck, AlertCircle, X, FileText } from "lucide-react";

interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  error: string | null;
  onError: (error: string | null) => void;
}

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB

export const FileUpload: React.FC<FileUploadProps> = ({
  selectedFile,
  onFileSelect,
  error,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateAndSetFile = (file: File) => {
    onError(null);

    // 1. Validate PDF extension or MIME type
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      onError("Please upload a PDF file (.pdf). Other formats are not supported.");
      return;
    }

    // 2. Validate 3MB file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      onError(
        `File is too large (${sizeMb} MB). The maximum allowed size is 3 MB.`
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    onError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Upload Resume
        </label>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          PDF only · Max 3 MB
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleInputChange}
      />

      {!selectedFile ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer transition-all duration-200 rounded-xl border-2 border-dashed p-6 text-center flex flex-col items-center justify-center gap-3 min-h-[190px] ${
            isDragging
              ? "border-blue-500 bg-blue-50/70 ring-4 ring-blue-100"
              : error
              ? "border-rose-300 bg-rose-50/40 hover:bg-rose-50/70"
              : "border-slate-300 bg-slate-50/60 hover:bg-slate-100/80 hover:border-blue-400"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-105">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-700">
              <span className="text-blue-600 font-semibold underline underline-offset-2">
                Click to browse
              </span>{" "}
              or drag & drop your resume PDF
            </p>
            <p className="text-xs text-slate-400">
              Supports single .pdf document up to 3 MB
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{formatFileSize(selectedFile.size)}</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  Ready to analyze
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove uploaded resume"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
