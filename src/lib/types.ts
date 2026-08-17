import { z } from "zod";

/**
 * Zod Schema for Resume AI Analysis Output.
 * This guarantees that whether data comes from a mock generator
 * or future Gemini API responses, it adheres to this exact contract.
 */
export const AnalysisResultSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall percentage match between 0 and 100"),
  summary: z
    .string()
    .min(10)
    .describe("Executive summary of candidate fit for the target role"),
  matchedSkills: z
    .array(z.string())
    .describe("Key skills and qualifications found in both resume and job description"),
  missingSkills: z
    .array(z.string())
    .describe("Important skills from the job description that are missing in the resume"),
  strengths: z
    .array(z.string())
    .describe("Top strengths and standout achievements of the candidate"),
  improvements: z
    .array(z.string())
    .describe("Actionable suggestions to improve the resume for this specific position"),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export interface UploadState {
  file: File | null;
  error: string | null;
}
