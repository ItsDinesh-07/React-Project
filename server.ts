import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route to generate questions
app.post("/api/generate-questions", async (req: any, res: any) => {
  try {
    const { category, role, difficulty } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.warn("GEMINI_API_KEY not configured. Returning fallback client questions.");
      return res.json({ success: false, error: "API key not configured", fallback: true });
    }
    
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Generate exactly 5 appropriate, high-quality multiple choice questions (MCQs) for an educational platform in the category: "${category}", for the target career role: "${role || 'Software Engineer'}", with difficulty level: "${difficulty || 'Medium'}".
Each question must test relevant skills, have exactly 4 plausible choices/options, specify the correct answer (should match one of the exact strings in options), and provide a brief conceptual explanation.
Format the output strictly as a JSON array of objects. Use this exact structure:
[
  {
    "question": "The question text goes here.",
    "options": ["Option A string", "Option B string", "Option C string", "Option D string"],
    "correctAnswer": "Option A string",
    "explanation": "Why Option A is correct."
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text || "[]";
    const questions = JSON.parse(text.trim());
    return res.json({ success: true, questions });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start full-stack server:", error);
});
