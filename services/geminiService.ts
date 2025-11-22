import { GoogleGenAI } from "@google/genai";
import { Subject } from "../types";

export const generateAttendanceInsights = async (subjects: Subject[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Please configure your Gemini API Key to receive smart AI insights about your attendance.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const subjectSummary = subjects.map(s => 
      `${s.name}: ${s.attendedClasses}/${s.totalClasses} classes (${((s.attendedClasses/s.totalClasses)*100).toFixed(1)}%)`
    ).join('\n');

    const lowSubjects = subjects.filter(s => {
      const percentage = s.totalClasses > 0 ? s.attendedClasses/s.totalClasses : 1;
      return percentage < 0.75;
    }).map(s => s.name).join(', ');

    const prompt = `
      You are an encouraging academic advisor for a college student.
      Here is the student's current attendance data:
      ${subjectSummary}
      
      The target attendance is 75%.
      ${lowSubjects ? `ALERT: The student is below target in: ${lowSubjects}.` : 'Student is safe in all subjects.'}
      
      Provide a short, punchy, and motivating summary (max 3 sentences).
      1. IMMEDIATELY mention if there are subjects below 75% and warn the student.
      2. Highlight a positive achievement to keep balance.
      3. Give one specific actionable advice.
      Do not use markdown formatting like bold or asterisks. Keep it clean text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keep up the good work! Check your low attendance subjects.";
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return "Unable to generate AI insights at the moment. Please check your connection.";
  }
};