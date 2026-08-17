import { AnalysisResult, AnalysisResultSchema } from "./types";

export const SAMPLE_JOB_DESCRIPTION = `Senior Frontend Engineer (React & Next.js)

About the Role:
We are looking for an experienced Frontend Engineer to build high-performance web applications using modern web technologies. You will collaborate closely with product managers and designers to deliver seamless user experiences.

Key Responsibilities:
- Design, develop, and maintain robust client-facing web applications using Next.js, React, and TypeScript.
- Build responsive, accessible UI components with modern Tailwind CSS.
- Optimize web applications for performance, accessibility, and SEO (Core Web Vitals).
- Integrate RESTful APIs and modern state management solutions.
- Write unit and end-to-end tests to ensure application reliability.
- Participate in code reviews and mentor junior developers.

Requirements:
- 3+ years of professional experience with React, TypeScript, and modern JavaScript (ES6+).
- Strong proficiency with Next.js (App Router, Server Components).
- Experience with Tailwind CSS and responsive design principles.
- Familiarity with CI/CD workflows, Git, and automated testing (Jest, Cypress, or Playwright).
- Excellent communication and problem-solving skills.
- Nice to have: Experience with AI SDKs, Node.js backends, or cloud deployments (Vercel/AWS).`;

export const DEFAULT_MOCK_ANALYSIS: AnalysisResult = {
  matchScore: 84,
  summary:
    "Strong candidate fit! The resume demonstrates solid hands-on experience with modern React, TypeScript, and Tailwind CSS. The profile aligns closely with the core frontend responsibilities, though adding quantifiable metrics and automated testing experience will boost ATS ranking.",
  matchedSkills: [
    "React.js",
    "Next.js (App Router)",
    "TypeScript",
    "Tailwind CSS",
    "JavaScript (ES6+)",
    "REST APIs Integration",
    "Git & GitHub",
    "Responsive UI Design",
  ],
  missingSkills: [
    "End-to-End Testing (Cypress / Playwright)",
    "Core Web Vitals Optimization",
    "CI/CD Pipeline Automation",
    "Mentoring & Code Review Leadership",
  ],
  strengths: [
    "Demonstrated hands-on experience building full-stack Next.js and TypeScript projects.",
    "Strong eye for responsive design and clean component architecture using Tailwind CSS.",
    "Clear project descriptions showcasing practical API integration and state management.",
  ],
  improvements: [
    "Add quantifiable results to bullet points (e.g., 'Reduced page load time by 35%' or 'Built features used by 10k+ users').",
    "Explicitly mention unit and E2E testing tools like Jest or Playwright to match all job requirements.",
    "Include a dedicated 'Technical Skills' section highlighting Next.js App Router and TypeScript proficiency near the top.",
    "Tailor the professional summary to specifically highlight frontend performance and scalable UI development.",
  ],
};

/**
 * Generates dynamic mock analysis based on the resume name and job description keywords,
 * then validates through Zod before returning.
 */
export function generateMockAnalysis(
  fileName: string,
  jobDescription: string
): AnalysisResult {
  const jdLower = jobDescription.toLowerCase();
  
  // Extract custom matched keywords dynamically
  const candidateKeywords = [
    { name: "React.js", test: jdLower.includes("react") },
    { name: "TypeScript", test: jdLower.includes("typescript") },
    { name: "Next.js", test: jdLower.includes("next") },
    { name: "Tailwind CSS", test: jdLower.includes("tailwind") || jdLower.includes("css") },
    { name: "REST APIs", test: jdLower.includes("api") || jdLower.includes("rest") },
    { name: "Git & Version Control", test: jdLower.includes("git") },
    { name: "State Management", test: jdLower.includes("state") || jdLower.includes("redux") },
    { name: "Responsive Design", test: jdLower.includes("responsive") || jdLower.includes("mobile") },
  ];

  const matchedSkills = candidateKeywords
    .filter((k) => k.test)
    .map((k) => k.name);

  // Fallback if no matching keywords found
  if (matchedSkills.length === 0) {
    matchedSkills.push("React.js", "TypeScript", "Frontend Development", "Component Architecture");
  }

  const rawData = {
    matchScore: Math.floor(75 + Math.random() * 15), // Realistic score between 75 and 89
    summary: `Analysis complete for "${fileName}". The resume displays good alignment with key frontend technical expectations found in the job description. With targeted enhancements to testing and performance metrics, candidate fit score can increase significantly.`,
    matchedSkills,
    missingSkills: [
      "Automated Testing (Playwright/Jest)",
      "CI/CD Workflow Integration",
      "Performance Benchmarking (LCP / INP)",
      "Cloud Deployment & Serverless Architecture",
    ],
    strengths: [
      "Demonstrates core competencies required for the position.",
      "Clear experience with modern web development toolchains.",
      "Strong foundation in component-based UI engineering.",
    ],
    improvements: [
      "Quantify project achievements with business impact and metrics (% speed increase, user growth).",
      "Highlight automated testing and test coverage experience.",
      "Align technical vocabulary directly with the job description keywords for ATS compatibility.",
      "Add links to live demos or GitHub repositories demonstrating relevant architecture.",
    ],
  };

  // Validate using Zod
  return AnalysisResultSchema.parse(rawData);
}
