import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResultSchema } from "@/lib/types";

// Maximum allowable file size: 3 MB
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured on the server. Please ensure your API key is set in .env.local.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    // 1. Validation: File Existence
    if (!resumeFile) {
      return NextResponse.json(
        { error: "Please upload a resume file." },
        { status: 400 }
      );
    }

    // 2. Validation: PDF Format Only
    const isPdfType =
      resumeFile.type === "application/pdf" ||
      resumeFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdfType) {
      return NextResponse.json(
        { error: "Invalid file format. Only PDF files are supported." },
        { status: 400 }
      );
    }

    // 3. Validation: 3 MB Size Limit
    if (resumeFile.size > MAX_FILE_SIZE_BYTES) {
      const sizeInMb = (resumeFile.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          error: `File size (${sizeInMb} MB) exceeds the 3 MB upload limit. Please upload a smaller PDF.`,
        },
        { status: 400 }
      );
    }

    // 4. Validation: Job Description Existence
    if (!jobDescription || jobDescription.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Please provide a meaningful job description (at least 20 characters) for accurate comparison.",
        },
        { status: 400 }
      );
    }

    // 5. Convert PDF file buffer directly to Base64 in memory (never stored on disk or logged)
    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

    // 6. Initialize Google Gen AI client with server-side API key
    const ai = new GoogleGenAI({ apiKey });

    const promptText = `You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
Analyze the attached resume PDF against the following target job description carefully.

Target Job Description:
"""
${jobDescription.trim()}
"""

Provide an objective, constructive evaluation and return a JSON object with:
1. "score": An overall compatibility match score as an integer from 0 to 100 based on relevant skills, experience, and domain alignment.
2. "summary": A clear 2-4 sentence executive summary evaluating how well the candidate fits the target role.
3. "matchedSkills": An array of specific skills, technologies, or qualifications found in both the resume and the job description.
4. "missingSkills": An array of critical skills, certifications, or requirements mentioned in the job description that are missing or weakly demonstrated in the resume.
5. "suggestions": An array of actionable, high-impact suggestions to improve the resume's alignment and ATS compatibility.
6. "disclaimer": A concise disclaimer stating that this AI-generated assessment is intended for informational and career guidance purposes only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            data: base64Pdf,
            mimeType: "application/pdf",
          },
        },
        promptText,
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "Overall percentage match between 0 and 100",
            },
            summary: {
              type: Type.STRING,
              description: "Executive summary of candidate fit for the target role",
            },
            matchedSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key skills found in both resume and job description",
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Important skills from job description missing in the resume",
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable recommendations to improve the resume",
            },
            disclaimer: {
              type: Type.STRING,
              description: "Disclaimer note regarding AI evaluation",
            },
          },
          required: [
            "score",
            "summary",
            "matchedSkills",
            "missingSkills",
            "suggestions",
            "disclaimer",
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received an empty response from the AI model.");
    }

    // 7. Parse JSON & Validate with Zod
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(responseText);
    } catch {
      throw new Error("Failed to parse AI model response as JSON.");
    }

    const validatedData = AnalysisResultSchema.parse(parsedJson);

    return NextResponse.json({
      success: true,
      data: validatedData,
      meta: {
        fileName: resumeFile.name,
        fileSizeBytes: resumeFile.size,
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "Resume analysis error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while analyzing the resume with Gemini.",
      },
      { status: 500 }
    );
  }
}
