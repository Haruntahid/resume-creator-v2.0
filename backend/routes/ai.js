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

    const rawText = await callGeminiAPI(prompt);

    // Parse JSON response
    let parsedData;
    try {
      const jsonText = rawText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw response was:", rawText);
      throw new Error("Failed to parse AI response into JSON");
    }

    res.json(parsedData);
  } catch (error) {
    console.error("Parse resume error:", error);
    res
      .status(500)
      .json({ message: "Failed to parse resume", error: error.message });
  }
});

// AI Bullet Point Enhancer
router.post("/enhance-bullet", async (req, res) => {
  try {
    const { bullet, jobTitle, industry } = req.body;
    if (!bullet) {
      return res.status(400).json({ message: "Bullet point text is required" });
    }

    const prompt = `You are a professional resume writer. Improve this work experience bullet point to be more impactful, using strong action verbs and quantified results where possible. Keep it concise (max 20 words). Return only the improved bullet point text, nothing else.

Original: ${bullet}
Job Title: ${jobTitle || "Professional"}
Industry: ${industry || "Technology"}`;

    const enhanced = await callGeminiAPI(prompt);
    res.json({ enhanced: enhanced.trim() });
  } catch (error) {
    console.error("Enhance bullet error:", error);
    res.status(500).json({ message: "Failed to enhance bullet point", error: error.message });
  }
});

// AI Professional Summary Generator
router.post("/generate-summary", async (req, res) => {
  try {
    const { jobTitle, yearsExperience, skills } = req.body;
    if (!jobTitle) {
      return res.status(400).json({ message: "Job title is required" });
    }

    const skillsStr = Array.isArray(skills) ? skills.join(", ") : skills || "";
    const prompt = `Write a professional resume summary in 2-3 sentences for a ${jobTitle} with ${yearsExperience || "some"} years of experience in ${skillsStr || "their field"}. Make it compelling, ATS-friendly, and specific. Return only the summary text.`;

    const summary = await callGeminiAPI(prompt);
    res.json({ summary: summary.trim() });
  } catch (error) {
    console.error("Generate summary error:", error);
    res.status(500).json({ message: "Failed to generate summary", error: error.message });
  }
});

// AI Skills Suggester
router.post("/suggest-skills", async (req, res) => {
  try {
    const { jobTitle } = req.body;
    if (!jobTitle) {
      return res.status(400).json({ message: "Job title is required" });
    }

    const prompt = `List 10 relevant technical and soft skills for a ${jobTitle} role. Return as a JSON array of strings only. Example: ["React", "Node.js", "Team Leadership"]`;

    const rawText = await callGeminiAPI(prompt);
    let skills = [];
    try {
      const jsonText = rawText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      skills = JSON.parse(jsonText);
    } catch (e) {
      // Fallback: extract list items if JSON parse fails
      skills = rawText
        .split("\n")
        .map(line => line.replace(/^[-*0-9.\s]+/, "").replace(/"/g, "").trim())
        .filter(line => line.length > 0 && line.length < 40)
        .slice(0, 10);
    }

    res.json({ skills });
  } catch (error) {
    console.error("Suggest skills error:", error);
    res.status(500).json({ message: "Failed to suggest skills", error: error.message });
  }
});

// AI Job Description Tailoring
router.post("/tailor-resume", async (req, res) => {
  try {
    const { jobDescription, summary, skills } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }

    const skillsStr = Array.isArray(skills) ? skills.join(", ") : skills || "";
    const prompt = `Adjust the following resume summary and highlight relevant skills to tailor the resume for this job description.
Job Description: ${jobDescription}
Current Summary: ${summary || ""}
Current Skills: ${skillsStr || ""}

Return ONLY a JSON object with this exact structure (no markdown code blocks, just raw JSON):
{
  "summary": "improved tailored summary here",
  "skillsToHighlight": ["skill1", "skill2", "skill3"]
}`;

    const rawText = await callGeminiAPI(prompt);
    let result = { summary: summary || "", skillsToHighlight: [] };
    try {
      const jsonText = rawText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      result = JSON.parse(jsonText);
    } catch (e) {
      console.error("Tailor resume JSON parse error:", e);
      result = {
        summary: rawText,
        skillsToHighlight: Array.isArray(skills) ? skills.slice(0, 5) : []
      };
    }

    res.json(result);
  } catch (error) {
    console.error("Tailor resume error:", error);
    res.status(500).json({ message: "Failed to tailor resume", error: error.message });
  }
});

export default router;
