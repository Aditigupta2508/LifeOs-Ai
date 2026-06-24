import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// 🔥 SYSTEM PROMPT (this makes it "Gemini-like assistant")
const SYSTEM_PROMPT = `
You are an AI Roadmap Mentor for students.

Your behavior:
- Break user goals into structured learning roadmaps
- Act like a teacher + planner + mentor
- Always be clear, step-by-step, and practical
- Never give vague answers

Response format:
🎯 Goal Understanding
🧭 Roadmap (step-by-step)
📌 Current Step Explanation
🚀 Next Action
💡 Tip (optional)
`;

// 🔥 CHAT ENDPOINT
app.post("/chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    const fullPrompt = `
${SYSTEM_PROMPT}

User Context:
${JSON.stringify(context || {})}

User Message:
${message}
`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`AI Assistant running on port ${process.env.PORT}`);
});