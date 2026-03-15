import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to call Gemini REST API
const callGeminiAPI = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("Invalid response from Gemini API");
  }

  return data.candidates[0].content.parts[0].text;
};

// Helper to check if Firebase is initialized
const ensureFirebaseInitialized = () => {
  if (getApps().length === 0) {
    throw new Error(
      "Firebase Admin is not initialized. Check server logs for initialization errors."
    );
  }
};

// Verify token middleware
const verifyToken = async (req, res, next) => {
  try {
    ensureFirebaseInitialized();

    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Apply middleware to all routes
router.use(verifyToken);

// Parse resume PDF
router.post("/parse-resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;

    // Send to Gemini for parsing
    const prompt = `Parse the following resume text and extract structured information. Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just the JSON):

{
  "name": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "summary": "string or null",
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string or null",
      "current": boolean,
      "bullets": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string or null",
      "startDate": "string",
      "endDate": "string or null",
      "current": boolean,
      "gpa": "string or null"
    }
  ],
  "skills": ["string"]
}

Resume text:
${text}`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    // Parse JSON response
    let parsedData;
    try {
      const jsonText = rawText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Failed to parse AI response");
    }

    res.json(parsedData);
  } catch (error) {
    console.error("Parse resume error:", error);
    res
      .status(500)
      .json({ message: "Failed to parse resume", error: error.message });
  }
});

// Only PDF parsing endpoint remains - other AI features removed as requested

export default router;
