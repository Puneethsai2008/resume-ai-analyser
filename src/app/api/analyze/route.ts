import { NextRequest, NextResponse } from "next/server";
import { generateMockAnalysis } from "@/lib/mockData";
import { AnalysisResultSchema } from "@/lib/types";

// Maximum allowable file size: 3 MB
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
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

    // 5. Simulate AI Analysis Processing Time (1.5 seconds for realistic UX)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 6. Generate Mock Analysis & Validate with Zod
    const analysis = generateMockAnalysis(resumeFile.name, jobDescription);
    const validatedData = AnalysisResultSchema.parse(analysis);

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
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during resume analysis.",
      },
      { status: 500 }
    );
  }
}
