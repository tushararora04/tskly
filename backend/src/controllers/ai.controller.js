import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper: aaj ki date AI ko context ke liye bhejni hai
// taaki "friday" jaisi relative dates sahi se calculate ho
const getTodayContext = () => {
  const today = new Date();
  return today.toDateString(); // e.g. "Mon Jun 30 2026"
};

// ---- 1. Natural Language Card Creation ----
export const parseTaskFromText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const prompt = `
You are a task parser for a Trello-like app. Today's date is ${getTodayContext()}.
Convert the following user input into a single task card.

User input: "${text}"

Respond ONLY with valid JSON, no markdown, no extra text, in this exact shape:
{
  "title": "short clear task title",
  "description": "optional extra detail, empty string if none",
  "priority": "low" | "medium" | "high",
  "dueDate": "YYYY-MM-DD" or null if no date mentioned
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text.trim();
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (err) {
    console.error("AI parseTask error:", err);
    res.status(500).json({ message: "AI parsing failed" });
  }
};

// ---- 2. Smart Task Breakdown ----
export const breakdownTask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const prompt = `
You are a project planning assistant. Break the following big task into
4 to 7 smaller, actionable sub-tasks.

Big task: "${text}"

Respond ONLY with valid JSON, no markdown, no extra text, in this exact shape:
{
  "subtasks": [
    { "title": "short clear sub-task title", "priority": "low" | "medium" | "high" }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text.trim();
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (err) {
    console.error("AI breakdown error:", err);
    res.status(500).json({ message: "AI breakdown failed" });
  }
};