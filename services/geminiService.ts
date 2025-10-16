
import { GoogleGenAI } from "@google/genai";
import type { QCIssue } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateQCSummary = async (issues: QCIssue[]): Promise<string> => {
  if (!API_KEY) {
    return "Gemini API key not configured. Summary not available.";
  }
  
  if (issues.length === 0) {
    return "This file passed all quality control checks successfully.";
  }

  const prompt = `
    You are a media QC expert. Based on the following technical issues found in a media file, 
    provide a brief, one-sentence, non-technical summary of the file's condition for a media professional.

    Issues:
    ${issues.map(i => `- ${i.description} (Severity: ${i.severity})`).join('\n')}

    Example summaries:
    - "The file has critical errors, including a missing audio stream."
    - "The file is generally usable but has minor warnings like variable frame rate that could affect editing."
    - "The file has a few warnings related to metadata and stream synchronization."

    Generate a summary for the provided issues:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Could not generate AI summary due to an API error.";
  }
};
