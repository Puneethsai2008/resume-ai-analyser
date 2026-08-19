import { z } from "zod";

/**
 * Zod Schema for Resume AI Analysis Output.
 * This guarantees that whether data comes from a mock generator
 * or future Gemini API responses, it adheres to this exact contract.
 */
export const AnalysisResultSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall percentage match score between 0 and 100"),
  summary: z
    .string()
    .min(10)
    .describe("Executive summary of candidate fit and alignment with the target role"),
  matchedSkills: z
    .array(z.string())
    .describe("Key skills and qualifications found in both the resume and the job description"),
  missingSkills: z
    .array(z.string())
    .describe("Important skills, qualifications, or requirements from the job description that are missing in the resume"),
  suggestions: z
    .array(z.string())
    .describe("Concrete, actionable recommendations to improve the resume for this specific position"),
  disclaimer: z
    .string()
    .describe("Standard disclaimer stating that this analysis is AI-assisted and should be used as guidance"),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export interface UploadState {
  file: File | null;
  error: string | null;
}
