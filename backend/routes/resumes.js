// import express from "express";
// import multer from "multer";
// import pdfParse from "pdf-parse";
// import Resume from "../models/Resume.js";
// import User from "../models/User.js";
// import { getAuth } from "firebase-admin/auth";
// import { getApps } from "firebase-admin/app";

// const router = express.Router();
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB for PDFs
//   },
// });

// // Helper function to parse resume text without AI (basic regex-based extraction)
// const parseResumeWithoutAI = (text) => {
//   console.log(text);
//   if (!text) return {};

//   const cleanedText = text.replace(/\r/g, "");
//   const lines = cleanedText
//     .split("\n")
//     .map((l) => l.trim())
//     .filter(Boolean);

//   const lowerText = cleanedText.toLowerCase();

//   // EMAIL
//   const emailMatch = cleanedText.match(
//     /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
//   );

//   // PHONE
//   const phoneMatch = cleanedText.match(
//     /(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/
//   );

//   // NAME (first meaningful line)
//   let name = "";
//   for (let line of lines.slice(0, 5)) {
//     if (
//       line.length > 2 &&
//       line.length < 50 &&
//       !line.includes("@") &&
//       !/\d/.test(line)
//     ) {
//       name = line;
//       break;
//     }
//   }

//   // SECTION DETECTION
//   const sections = {
//     summary: "",
//     experience: [],
//     education: [],
//     skills: [],
//   };

//   let currentSection = "";

//   const sectionKeywords = {
//     summary: ["summary", "profile", "about"],
//     experience: ["experience", "work", "employment"],
//     education: ["education", "academic"],
//     skills: ["skills", "technologies", "tools"],
//   };

//   const detectSection = (line) => {
//     const l = line.toLowerCase();

//     for (const key in sectionKeywords) {
//       if (sectionKeywords[key].some((k) => l.includes(k))) {
//         return key;
//       }
//     }

//     return null;
//   };

//   let buffer = [];

//   for (let line of lines) {
//     const detected = detectSection(line);

//     if (detected) {
//       if (currentSection && buffer.length) {
//         sections[currentSection] = buffer;
//       }

//       currentSection = detected;
//       buffer = [];
//       continue;
//     }

//     if (currentSection) {
//       buffer.push(line);
//     }
//   }

//   if (currentSection && buffer.length) {
//     sections[currentSection] = buffer;
//   }

//   // EXPERIENCE PARSER
//   const experience = [];

//   if (Array.isArray(sections.experience)) {
//     let currentJob = null;

//     sections.experience.forEach((line) => {
//       const dateMatch = line.match(
//         /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i
//       );

//       if (dateMatch) {
//         if (currentJob) experience.push(currentJob);

//         currentJob = {
//           company: "",
//           position: line,
//           startDate: "",
//           endDate: "",
//           current: /present/i.test(line),
//           bullets: [],
//         };
//       } else if (currentJob) {
//         currentJob.bullets.push(line);
//       }
//     });

//     if (currentJob) experience.push(currentJob);
//   }

//   // EDUCATION PARSER
//   const education = [];

//   if (Array.isArray(sections.education)) {
//     sections.education.forEach((line) => {
//       if (line.length > 5) {
//         education.push({
//           institution: line,
//           degree: "",
//           field: "",
//           startDate: "",
//           endDate: "",
//           current: false,
//           gpa: "",
//         });
//       }
//     });
//   }

//   // SKILLS PARSER (comma / bullet detection)
//   let skills = [];

//   if (Array.isArray(sections.skills)) {
//     skills = sections.skills
//       .join(" ")
//       .split(/[,•|]/)
//       .map((s) => s.trim())
//       .filter((s) => s.length > 1 && s.length < 30);
//   }

//   // SUMMARY
//   let summary = "";

//   if (Array.isArray(sections.summary)) {
//     summary = sections.summary.join(" ").slice(0, 400);
//   }

//   return {
//     name,
//     email: emailMatch ? emailMatch[0] : "",
//     phone: phoneMatch ? phoneMatch[0] : "",
//     summary,
//     experience,
//     education,
//     skills,
//   };
// };

// // Experience and education schemas for parsing
// router.post("/v1/pdf/parse", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const pdfData = await pdfParse(req.file.buffer);
//     const text = pdfData.text;

//     const parsedData = parseResumeWithoutAI(text);

//     return res.status(200).json({
//       message: "PDF parsed successfully",
//       data: parsedData,
//     });
//   } catch (error) {
//     console.error("PDF parse error:", error);
//     return res.status(500).json({
//       message: "Failed to parse PDF",
//       error: error.message,
//     });
//   }
// });

// // Image upload with 1MB limit
// const imageUpload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 1 * 1024 * 1024, // 1MB max
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed"));
//     }
//   },
// });

// // Helper function to call Gemini REST API
// const callGeminiAPI = async (prompt) => {
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) {
//     throw new Error("GEMINI_API_KEY is not configured");
//   }

//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 text: prompt,
//               },
//             ],
//           },
//         ],
//       }),
//     }
//   );

//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error(`Gemini API error: ${error}`);
//   }

//   const data = await response.json();

//   if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
//     throw new Error("Invalid response from Gemini API");
//   }

//   return data.candidates[0].content.parts[0].text;
// };

// // Helper to check if Firebase is initialized
// const ensureFirebaseInitialized = () => {
//   if (getApps().length === 0) {
//     throw new Error(
//       "Firebase Admin is not initialized. Check server logs for initialization errors."
//     );
//   }
// };

// // Verify token middleware
// const verifyToken = async (req, res, next) => {
//   try {
//     ensureFirebaseInitialized();

//     const token = req.headers.authorization?.split("Bearer ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const decodedToken = await getAuth().verifyIdToken(token);
//     req.user = {
//       uid: decodedToken.uid,
//       email: decodedToken.email,
//     };
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // Apply middleware to all routes
// router.use(verifyToken);

// // Get all resumes for user
// router.get("/", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resumes = await Resume.find({ userId: user._id })
//       .sort({ updatedAt: -1 })
//       .select("-versions");

//     res.json(resumes);
//   } catch (error) {
//     console.error("Get resumes error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch resumes", error: error.message });
//   }
// });

// // Get single resume
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOne({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     res.json(resume);
//   } catch (error) {
//     console.error("Get resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch resume", error: error.message });
//   }
// });

// // Create resume
// router.post("/", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resumeData = {
//       ...req.body,
//       userId: user._id,
//     };

//     const resume = await Resume.create(resumeData);
//     res.status(201).json(resume);
//   } catch (error) {
//     console.error("Create resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to create resume", error: error.message });
//   }
// });

// // Update resume
// router.put("/:id", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOne({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     // Save version before updating
//     if (
//       resume.versions.length === 0 ||
//       JSON.stringify(resume.toObject()) !==
//         JSON.stringify({ ...resume.toObject(), ...req.body })
//     ) {
//       resume.versions.push({
//         data: resume.toObject(),
//         createdAt: new Date(),
//       });

//       // Keep only last 10 versions
//       if (resume.versions.length > 10) {
//         resume.versions = resume.versions.slice(-10);
//       }
//     }

//     Object.assign(resume, req.body);
//     await resume.save();

//     res.json(resume);
//   } catch (error) {
//     console.error("Update resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to update resume", error: error.message });
//   }
// });

// // Delete resume
// router.delete("/:id", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOneAndDelete({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     res.json({ message: "Resume deleted successfully" });
//   } catch (error) {
//     console.error("Delete resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to delete resume", error: error.message });
//   }
// });

// // Upload PDF, parse it, and create resume automatically
// // router.post("/upload-pdf", upload.single("file"), async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     if (!process.env.GEMINI_API_KEY) {
// //       return res.status(500).json({
// //         message:
// //           "Gemini AI is not configured. Please set GEMINI_API_KEY in environment variables.",
// //       });
// //     }

// //     const user = await User.findOne({ firebaseUid: req.user.uid });
// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     // Parse PDF
// //     const pdfBuffer = req.file.buffer;
// //     const pdfData = await pdfParse(pdfBuffer);
// //     const text = pdfData.text;

// //     // Send to Gemini for parsing using REST API
// //     const prompt = `Parse the following resume text and extract structured information. Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just the JSON):

// // {
// //   "name": "string or null",
// //   "email": "string or null",
// //   "phone": "string or null",
// //   "summary": "string or null",
// //   "experience": [
// //     {
// //       "company": "string",
// //       "position": "string",
// //       "startDate": "string",
// //       "endDate": "string or null",
// //       "current": boolean,
// //       "bullets": ["string"]
// //     }
// //   ],
// //   "education": [
// //     {
// //       "institution": "string",
// //       "degree": "string",
// //       "field": "string or null",
// //       "startDate": "string",
// //       "endDate": "string or null",
// //       "current": boolean,
// //       "gpa": "string or null"
// //     }
// //   ],
// //   "skills": ["string"]
// // }

// // Resume text:
// // ${text}`;

// //     const rawText = await callGeminiAPI(prompt);

// //     // Parse JSON response
// //     let parsedData;
// //     try {
// //       const jsonText = rawText
// //         .replace(/```json\n?/g, "")
// //         .replace(/```\n?/g, "")
// //         .trim();
// //       parsedData = JSON.parse(jsonText);
// //     } catch (parseError) {
// //       console.error("JSON parse error:", parseError);
// //       throw new Error("Failed to parse AI response");
// //     }

// //     // Map parsed data to resume format
// //     const resumeData = {
// //       userId: user._id,
// //       title: parsedData.name
// //         ? `${parsedData.name}'s Resume`
// //         : "Resume from PDF",
// //       template: req.body.template || "modern",
// //       theme: {
// //         primaryColor: req.body.primaryColor || "#3b82f6",
// //         font: req.body.font || "inter",
// //       },
// //       personalInfo: {
// //         name: parsedData.name || "",
// //         email: parsedData.email || "",
// //         phone: parsedData.phone || "",
// //         location: "",
// //         website: "",
// //         linkedin: "",
// //         github: "",
// //       },
// //       summary: parsedData.summary || "",
// //       experience: (parsedData.experience || []).map((exp) => ({
// //         company: exp.company || "",
// //         position: exp.position || "",
// //         startDate: exp.startDate || "",
// //         endDate: exp.endDate || null,
// //         current: exp.current || false,
// //         description: "",
// //         bullets: exp.bullets || [],
// //       })),
// //       education: (parsedData.education || []).map((edu) => ({
// //         institution: edu.institution || "",
// //         degree: edu.degree || "",
// //         field: edu.field || null,
// //         startDate: edu.startDate || "",
// //         endDate: edu.endDate || null,
// //         current: edu.current || false,
// //         gpa: edu.gpa || null,
// //       })),
// //       skills: parsedData.skills || [],
// //       sections: [],
// //     };

// //     // Create resume
// //     const resume = await Resume.create(resumeData);

// //     res.status(201).json({
// //       message: "Resume created successfully from PDF",
// //       resume,
// //       parsedData,
// //     });
// //   } catch (error) {
// //     console.error("Upload PDF error:", error);
// //     res.status(500).json({
// //       message: "Failed to process PDF and create resume",
// //       error: error.message,
// //     });
// //   }
// // });

// router.post("/upload-pdf", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // -------- STEP 1: Parse PDF --------
//     const pdfBuffer = req.file.buffer;
//     const pdfData = await pdfParse(pdfBuffer);

//     const rawText = pdfData.text || "";

//     // -------- STEP 2: Clean + Trim text --------
//     const cleanedText = rawText
//       .replace(/\r/g, "")
//       .replace(/\n{2,}/g, "\n")
//       .replace(/\s{2,}/g, " ")
//       .trim()
//       .slice(0, 15000); // prevent token overflow

//     let parsedData = null;

//     // -------- STEP 3: Try Gemini AI --------
//     if (process.env.GEMINI_API_KEY) {
//       try {
//         const prompt = `
// You are a resume parser.

// Extract structured information from the resume text below.

// Return ONLY valid JSON.

// {
// "name": "string or null",
// "email": "string or null",
// "phone": "string or null",
// "summary": "string or null",
// "experience":[
// {
// "company":"string",
// "position":"string",
// "startDate":"string",
// "endDate":"string or null",
// "current":false,
// "bullets":["string"]
// }
// ],
// "education":[
// {
// "institution":"string",
// "degree":"string",
// "field":"string or null",
// "startDate":"string",
// "endDate":"string or null",
// "current":false,
// "gpa":"string or null"
// }
// ],
// "skills":["string"]
// }

// Resume Text:
// ${cleanedText}
// `;

//         const rawAIResponse = await callGeminiAPI(prompt);

//         const jsonText = rawAIResponse
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//           .trim();

//         parsedData = JSON.parse(jsonText);
//       } catch (aiError) {
//         console.log("Gemini failed. Using fallback parser.");
//         parsedData = parseResumeWithoutAI(cleanedText);
//       }
//     } else {
//       console.log("No Gemini API key. Using fallback parser.");
//       parsedData = parseResumeWithoutAI(cleanedText);
//     }

//     // -------- STEP 4: Map parsed data --------
//     const resumeData = {
//       userId: user._id,
//       title: parsedData.name
//         ? `${parsedData.name}'s Resume`
//         : "Resume from PDF",

//       template: req.body.template || "modern",

//       theme: {
//         primaryColor: req.body.primaryColor || "#3b82f6",
//         font: req.body.font || "inter",
//       },

//       personalInfo: {
//         name: parsedData.name || "",
//         email: parsedData.email || "",
//         phone: parsedData.phone || "",
//         location: "",
//         website: "",
//         linkedin: "",
//         github: "",
//       },

//       summary: parsedData.summary || "",

//       experience: (parsedData.experience || []).map((exp) => ({
//         company: exp.company || "",
//         position: exp.position || "",
//         startDate: exp.startDate || "",
//         endDate: exp.endDate || null,
//         current: exp.current || false,
//         description: "",
//         bullets: exp.bullets || [],
//       })),

//       education: (parsedData.education || []).map((edu) => ({
//         institution: edu.institution || "",
//         degree: edu.degree || "",
//         field: edu.field || null,
//         startDate: edu.startDate || "",
//         endDate: edu.endDate || null,
//         current: edu.current || false,
//         gpa: edu.gpa || null,
//       })),

//       skills: parsedData.skills || [],

//       sections: [],
//     };

//     // -------- STEP 5: Save resume --------
//     const resume = await Resume.create(resumeData);

//     res.status(201).json({
//       message: "Resume created successfully from PDF",
//       resume,
//       parsedData,
//     });
//   } catch (error) {
//     console.error("Upload PDF error:", error);

//     res.status(500).json({
//       message: "Failed to process PDF",
//       error: error.message,
//     });
//   }
// });

// // Upload user profile image (max 1MB)
// router.post("/upload-image", imageUpload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No image uploaded" });
//     }

//     if (req.file.size > 1 * 1024 * 1024) {
//       return res
//         .status(400)
//         .json({ message: "Image size must be less than 1MB" });
//     }

//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Convert image to base64 for storage (or you can use a cloud storage service)
//     const imageBase64 = req.file.buffer.toString("base64");
//     const imageDataUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

//     // Update user photoURL
//     user.photoURL = imageDataUrl;
//     await user.save();

//     res.json({
//       message: "Image uploaded successfully",
//       photoURL: imageDataUrl,
//     });
//   } catch (error) {
//     console.error("Upload image error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to upload image", error: error.message });
//   }
// });

// // Download resume as JSON (for backup/export)
// router.get("/:id/download", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOne({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     // Set headers for download
//     res.setHeader("Content-Type", "application/json");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="resume-${resume.title.replace(
//         /[^a-z0-9]/gi,
//         "_"
//       )}.json"`
//     );

//     res.json(resume);
//   } catch (error) {
//     console.error("Download resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to download resume", error: error.message });
//   }
// });

// export default router;

// new

// import express from "express";
// import multer from "multer";
// import pdfParse from "pdf-parse";
// import Anthropic from "@anthropic-ai/sdk";
// import Resume from "../models/Resume.js";
// import User from "../models/User.js";
// import { getAuth } from "firebase-admin/auth";
// import { getApps } from "firebase-admin/app";

// const router = express.Router();
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB for PDFs
//   },
// });

// // Helper function to parse resume text without AI (basic regex-based extraction)
// const parseResumeWithoutAI = (text) => {
//   console.log(text);
//   if (!text) return {};

//   const cleanedText = text.replace(/\r/g, "");
//   const lines = cleanedText
//     .split("\n")
//     .map((l) => l.trim())
//     .filter(Boolean);

//   // EMAIL
//   const emailMatch = cleanedText.match(
//     /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
//   );

//   // PHONE
//   const phoneMatch = cleanedText.match(
//     /(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/
//   );

//   // NAME (first meaningful line)
//   let name = "";
//   for (let line of lines.slice(0, 5)) {
//     if (
//       line.length > 2 &&
//       line.length < 50 &&
//       !line.includes("@") &&
//       !/\d/.test(line)
//     ) {
//       name = line;
//       break;
//     }
//   }

//   // SECTION DETECTION
//   const sections = {
//     summary: "",
//     experience: [],
//     education: [],
//     skills: [],
//   };

//   let currentSection = "";

//   const sectionKeywords = {
//     summary: ["summary", "profile", "about"],
//     experience: ["experience", "work", "employment"],
//     education: ["education", "academic"],
//     skills: ["skills", "technologies", "tools"],
//   };

//   const detectSection = (line) => {
//     const l = line.toLowerCase();
//     for (const key in sectionKeywords) {
//       if (sectionKeywords[key].some((k) => l.includes(k))) {
//         return key;
//       }
//     }
//     return null;
//   };

//   let buffer = [];

//   for (let line of lines) {
//     const detected = detectSection(line);
//     if (detected) {
//       if (currentSection && buffer.length) {
//         sections[currentSection] = buffer;
//       }
//       currentSection = detected;
//       buffer = [];
//       continue;
//     }
//     if (currentSection) {
//       buffer.push(line);
//     }
//   }

//   if (currentSection && buffer.length) {
//     sections[currentSection] = buffer;
//   }

//   // EXPERIENCE PARSER
//   const experience = [];
//   if (Array.isArray(sections.experience)) {
//     let currentJob = null;
//     sections.experience.forEach((line) => {
//       const dateMatch = line.match(
//         /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i
//       );
//       if (dateMatch) {
//         if (currentJob) experience.push(currentJob);
//         currentJob = {
//           company: "",
//           position: line,
//           startDate: "",
//           endDate: "",
//           current: /present/i.test(line),
//           bullets: [],
//         };
//       } else if (currentJob) {
//         currentJob.bullets.push(line);
//       }
//     });
//     if (currentJob) experience.push(currentJob);
//   }

//   // EDUCATION PARSER
//   const education = [];
//   if (Array.isArray(sections.education)) {
//     sections.education.forEach((line) => {
//       if (line.length > 5) {
//         education.push({
//           institution: line,
//           degree: "",
//           field: "",
//           startDate: "",
//           endDate: "",
//           current: false,
//           gpa: "",
//         });
//       }
//     });
//   }

//   // SKILLS PARSER
//   let skills = [];
//   if (Array.isArray(sections.skills)) {
//     skills = sections.skills
//       .join(" ")
//       .split(/[,•|]/)
//       .map((s) => s.trim())
//       .filter((s) => s.length > 1 && s.length < 30);
//   }

//   // SUMMARY
//   let summary = "";
//   if (Array.isArray(sections.summary)) {
//     summary = sections.summary.join(" ").slice(0, 400);
//   }

//   return {
//     name,
//     email: emailMatch ? emailMatch[0] : "",
//     phone: phoneMatch ? phoneMatch[0] : "",
//     summary,
//     experience,
//     education,
//     skills,
//   };
// };

// // ─────────────────────────────────────────────
// // Claude API helper (replaces callGeminiAPI)
// // ─────────────────────────────────────────────
// const callClaudeAPI = async (resumeText) => {
//   const apiKey = process.env.ANTHROPIC_API_KEY;
//   if (!apiKey) {
//     throw new Error("ANTHROPIC_API_KEY is not configured");
//   }

//   const client = new Anthropic({ apiKey });

//   const prompt = `You are a resume parser. Extract structured information from the resume text below.

// Return ONLY valid JSON — no markdown, no explanation, no code blocks. Just the raw JSON object.

// {
//   "name": "string or null",
//   "email": "string or null",
//   "phone": "string or null",
//   "summary": "string or null",
//   "experience": [
//     {
//       "company": "string",
//       "position": "string",
//       "startDate": "string",
//       "endDate": "string or null",
//       "current": false,
//       "bullets": ["string"]
//     }
//   ],
//   "education": [
//     {
//       "institution": "string",
//       "degree": "string",
//       "field": "string or null",
//       "startDate": "string",
//       "endDate": "string or null",
//       "current": false,
//       "gpa": "string or null"
//     }
//   ],
//   "skills": ["string"]
// }

// Resume Text:
// ${resumeText}`;

//   const message = await client.messages.create({
//     model: "claude-sonnet-4-20250514",
//     max_tokens: 2048,
//     messages: [{ role: "user", content: prompt }],
//   });

//   // Extract text from response
//   const responseText = message.content
//     .filter((block) => block.type === "text")
//     .map((block) => block.text)
//     .join("");

//   return responseText;
// };

// // ─────────────────────────────────────────────
// // Public route: parse PDF only (no auth needed)
// // ─────────────────────────────────────────────
// router.post("/v1/pdf/parse", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const pdfData = await pdfParse(req.file.buffer);
//     const text = pdfData.text;

//     const parsedData = parseResumeWithoutAI(text);

//     return res.status(200).json({
//       message: "PDF parsed successfully",
//       data: parsedData,
//     });
//   } catch (error) {
//     console.error("PDF parse error:", error);
//     return res.status(500).json({
//       message: "Failed to parse PDF",
//       error: error.message,
//     });
//   }
// });

// // Image upload with 1MB limit
// const imageUpload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 1 * 1024 * 1024,
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed"));
//     }
//   },
// });

// // Helper to check if Firebase is initialized
// const ensureFirebaseInitialized = () => {
//   if (getApps().length === 0) {
//     throw new Error(
//       "Firebase Admin is not initialized. Check server logs for initialization errors."
//     );
//   }
// };

// // Verify token middleware
// const verifyToken = async (req, res, next) => {
//   try {
//     ensureFirebaseInitialized();

//     const token = req.headers.authorization?.split("Bearer ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const decodedToken = await getAuth().verifyIdToken(token);
//     req.user = {
//       uid: decodedToken.uid,
//       email: decodedToken.email,
//     };
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // Apply auth middleware to all routes below
// router.use(verifyToken);

// // Get all resumes for user
// router.get("/", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resumes = await Resume.find({ userId: user._id })
//       .sort({ updatedAt: -1 })
//       .select("-versions");

//     res.json(resumes);
//   } catch (error) {
//     console.error("Get resumes error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch resumes", error: error.message });
//   }
// });

// // Get single resume
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOne({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     res.json(resume);
//   } catch (error) {
//     console.error("Get resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch resume", error: error.message });
//   }
// });

// // Create resume
// router.post("/", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resumeData = {
//       ...req.body,
//       userId: user._id,
//     };

//     const resume = await Resume.create(resumeData);
//     res.status(201).json(resume);
//   } catch (error) {
//     console.error("Create resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to create resume", error: error.message });
//   }
// });

// // Update resume
// router.put("/:id", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOne({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     if (
//       resume.versions.length === 0 ||
//       JSON.stringify(resume.toObject()) !==
//         JSON.stringify({ ...resume.toObject(), ...req.body })
//     ) {
//       resume.versions.push({
//         data: resume.toObject(),
//         createdAt: new Date(),
//       });

//       if (resume.versions.length > 10) {
//         resume.versions = resume.versions.slice(-10);
//       }
//     }

//     Object.assign(resume, req.body);
//     await resume.save();

//     res.json(resume);
//   } catch (error) {
//     console.error("Update resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to update resume", error: error.message });
//   }
// });

// // Delete resume
// router.delete("/:id", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOneAndDelete({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     res.json({ message: "Resume deleted successfully" });
//   } catch (error) {
//     console.error("Delete resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to delete resume", error: error.message });
//   }
// });

// // ─────────────────────────────────────────────
// // Upload PDF → Claude parses → save resume
// // ─────────────────────────────────────────────
// router.post("/upload-pdf", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // STEP 1: Extract raw text from PDF
//     const pdfData = await pdfParse(req.file.buffer);
//     const rawText = pdfData.text || "";

//     // STEP 2: Clean + trim text
//     const cleanedText = rawText
//       .replace(/\r/g, "")
//       .replace(/\n{2,}/g, "\n")
//       .replace(/\s{2,}/g, " ")
//       .trim()
//       .slice(0, 15000); // prevent token overflow

//     let parsedData = null;

//     // STEP 3: Try Claude AI — fallback to regex parser if it fails
//     if (process.env.ANTHROPIC_API_KEY) {
//       try {
//         console.log("Using Claude AI to parse resume...");

//         const rawAIResponse = await callClaudeAPI(cleanedText);

//         // Strip any accidental markdown fences
//         const jsonText = rawAIResponse
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//           .trim();

//         parsedData = JSON.parse(jsonText);
//         console.log("Claude parsed successfully.");
//       } catch (aiError) {
//         console.warn(
//           "Claude failed. Falling back to regex parser.",
//           aiError.message
//         );
//         parsedData = parseResumeWithoutAI(cleanedText);
//       }
//     } else {
//       console.log("No ANTHROPIC_API_KEY found. Using fallback regex parser.");
//       parsedData = parseResumeWithoutAI(cleanedText);
//     }

//     // STEP 4: Map parsed data to resume schema
//     const resumeData = {
//       userId: user._id,
//       title: parsedData.name
//         ? `${parsedData.name}'s Resume`
//         : "Resume from PDF",
//       template: req.body.template || "modern",
//       theme: {
//         primaryColor: req.body.primaryColor || "#3b82f6",
//         font: req.body.font || "inter",
//       },
//       personalInfo: {
//         name: parsedData.name || "",
//         email: parsedData.email || "",
//         phone: parsedData.phone || "",
//         location: "",
//         website: "",
//         linkedin: "",
//         github: "",
//       },
//       summary: parsedData.summary || "",
//       experience: (parsedData.experience || []).map((exp) => ({
//         company: exp.company || "",
//         position: exp.position || "",
//         startDate: exp.startDate || "",
//         endDate: exp.endDate || null,
//         current: exp.current || false,
//         description: "",
//         bullets: exp.bullets || [],
//       })),
//       education: (parsedData.education || []).map((edu) => ({
//         institution: edu.institution || "",
//         degree: edu.degree || "",
//         field: edu.field || null,
//         startDate: edu.startDate || "",
//         endDate: edu.endDate || null,
//         current: edu.current || false,
//         gpa: edu.gpa || null,
//       })),
//       skills: parsedData.skills || [],
//       sections: [],
//     };

//     // STEP 5: Save to database
//     const resume = await Resume.create(resumeData);

//     res.status(201).json({
//       message: "Resume created successfully from PDF",
//       resume,
//       parsedData,
//     });
//   } catch (error) {
//     console.error("Upload PDF error:", error);
//     res.status(500).json({
//       message: "Failed to process PDF",
//       error: error.message,
//     });
//   }
// });

// // Upload user profile image
// router.post("/upload-image", imageUpload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No image uploaded" });
//     }

//     if (req.file.size > 1 * 1024 * 1024) {
//       return res
//         .status(400)
//         .json({ message: "Image size must be less than 1MB" });
//     }

//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const imageBase64 = req.file.buffer.toString("base64");
//     const imageDataUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

//     user.photoURL = imageDataUrl;
//     await user.save();

//     res.json({
//       message: "Image uploaded successfully",
//       photoURL: imageDataUrl,
//     });
//   } catch (error) {
//     console.error("Upload image error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to upload image", error: error.message });
//   }
// });

// // Download resume as JSON
// router.get("/:id/download", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOne({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     res.setHeader("Content-Type", "application/json");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="resume-${resume.title.replace(
//         /[^a-z0-9]/gi,
//         "_"
//       )}.json"`
//     );

//     res.json(resume);
//   } catch (error) {
//     console.error("Download resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to download resume", error: error.message });
//   }
// });

// export default router;

// v2

// import express from "express";
// import multer from "multer";
// import pdfParse from "pdf-parse";
// import Anthropic from "@anthropic-ai/sdk";
// import Resume from "../models/Resume.js";
// import User from "../models/User.js";
// import { getAuth } from "firebase-admin/auth";
// import { getApps } from "firebase-admin/app";

// const router = express.Router();
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB for PDFs
//   },
// });

// // Helper function to parse resume text without AI (basic regex-based extraction)
// const parseResumeWithoutAI = (text) => {
//   console.log(text);
//   if (!text) return {};

//   const cleanedText = text.replace(/\r/g, "");
//   const lines = cleanedText
//     .split("\n")
//     .map((l) => l.trim())
//     .filter(Boolean);

//   // EMAIL
//   const emailMatch = cleanedText.match(
//     /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
//   );

//   // PHONE
//   const phoneMatch = cleanedText.match(
//     /(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/
//   );

//   // NAME (first meaningful line)
//   let name = "";
//   for (let line of lines.slice(0, 5)) {
//     if (
//       line.length > 2 &&
//       line.length < 50 &&
//       !line.includes("@") &&
//       !/\d/.test(line)
//     ) {
//       name = line;
//       break;
//     }
//   }

//   // SECTION DETECTION
//   const sections = {
//     summary: "",
//     experience: [],
//     education: [],
//     skills: [],
//   };

//   let currentSection = "";

//   const sectionKeywords = {
//     summary: ["summary", "profile", "about"],
//     experience: ["experience", "work", "employment"],
//     education: ["education", "academic"],
//     skills: ["skills", "technologies", "tools"],
//   };

//   const detectSection = (line) => {
//     const l = line.toLowerCase();
//     for (const key in sectionKeywords) {
//       if (sectionKeywords[key].some((k) => l.includes(k))) {
//         return key;
//       }
//     }
//     return null;
//   };

//   let buffer = [];

//   for (let line of lines) {
//     const detected = detectSection(line);
//     if (detected) {
//       if (currentSection && buffer.length) {
//         sections[currentSection] = buffer;
//       }
//       currentSection = detected;
//       buffer = [];
//       continue;
//     }
//     if (currentSection) {
//       buffer.push(line);
//     }
//   }

//   if (currentSection && buffer.length) {
//     sections[currentSection] = buffer;
//   }

//   // EXPERIENCE PARSER
//   const experience = [];
//   if (Array.isArray(sections.experience)) {
//     let currentJob = null;
//     sections.experience.forEach((line) => {
//       const dateMatch = line.match(
//         /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i
//       );
//       if (dateMatch) {
//         if (currentJob) experience.push(currentJob);
//         currentJob = {
//           company: "",
//           position: line,
//           startDate: "",
//           endDate: "",
//           current: /present/i.test(line),
//           bullets: [],
//         };
//       } else if (currentJob) {
//         currentJob.bullets.push(line);
//       }
//     });
//     if (currentJob) experience.push(currentJob);
//   }

//   // EDUCATION PARSER
//   const education = [];
//   if (Array.isArray(sections.education)) {
//     sections.education.forEach((line) => {
//       if (line.length > 5) {
//         education.push({
//           institution: line,
//           degree: "",
//           field: "",
//           startDate: "",
//           endDate: "",
//           current: false,
//           gpa: "",
//         });
//       }
//     });
//   }

//   // SKILLS PARSER
//   let skills = [];
//   if (Array.isArray(sections.skills)) {
//     skills = sections.skills
//       .join(" ")
//       .split(/[,•|]/)
//       .map((s) => s.trim())
//       .filter((s) => s.length > 1 && s.length < 30);
//   }

//   // SUMMARY
//   let summary = "";
//   if (Array.isArray(sections.summary)) {
//     summary = sections.summary.join(" ").slice(0, 400);
//   }

//   return {
//     name,
//     email: emailMatch ? emailMatch[0] : "",
//     phone: phoneMatch ? phoneMatch[0] : "",
//     summary,
//     experience,
//     education,
//     skills,
//   };
// };

// // ─────────────────────────────────────────────
// // Claude API helper (replaces callGeminiAPI)
// // ─────────────────────────────────────────────
// const callClaudeAPI = async (resumeText) => {
//   const apiKey = process.env.ANTHROPIC_API_KEY;
//   if (!apiKey) {
//     throw new Error("ANTHROPIC_API_KEY is not configured");
//   }

//   const client = new Anthropic({ apiKey });

//   const prompt = `You are a resume parser. Extract structured information from the resume text below.

// Return ONLY valid JSON — no markdown, no explanation, no code blocks. Just the raw JSON object.

// {
//   "name": "string or null",
//   "email": "string or null",
//   "phone": "string or null",
//   "summary": "string or null",
//   "experience": [
//     {
//       "company": "string",
//       "position": "string",
//       "startDate": "string",
//       "endDate": "string or null",
//       "current": false,
//       "bullets": ["string"]
//     }
//   ],
//   "education": [
//     {
//       "institution": "string",
//       "degree": "string",
//       "field": "string or null",
//       "startDate": "string",
//       "endDate": "string or null",
//       "current": false,
//       "gpa": "string or null"
//     }
//   ],
//   "skills": ["string"]
// }

// Resume Text:
// ${resumeText}`;

//   const message = await client.messages.create({
//     model: "claude-sonnet-4-20250514",
//     max_tokens: 2048,
//     messages: [{ role: "user", content: prompt }],
//   });

//   // Extract text from response
//   const responseText = message.content
//     .filter((block) => block.type === "text")
//     .map((block) => block.text)
//     .join("");

//   return responseText;
// };

// // ─────────────────────────────────────────────
// // Public route: parse PDF only (no auth needed)
// // ─────────────────────────────────────────────
// router.post("/v1/pdf/parse", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const pdfData = await pdfParse(req.file.buffer);
//     const rawText = pdfData.text || "";

//     const cleanedText = rawText
//       .replace(/\r/g, "")
//       .replace(/\n{2,}/g, "\n")
//       .replace(/\s{2,}/g, " ")
//       .trim()
//       .slice(0, 15000);

//     let parsedData = null;

//     if (process.env.ANTHROPIC_API_KEY) {
//       try {
//         console.log("Using Claude AI to parse resume...");
//         const rawAIResponse = await callClaudeAPI(cleanedText);
//         const jsonText = rawAIResponse
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//           .trim();
//         parsedData = JSON.parse(jsonText);
//         console.log("Claude parsed successfully.");
//       } catch (aiError) {
//         console.warn(
//           "Claude failed. Falling back to regex parser.",
//           aiError.message
//         );
//         parsedData = parseResumeWithoutAI(cleanedText);
//       }
//     } else {
//       console.log("No ANTHROPIC_API_KEY found. Using fallback regex parser.");
//       parsedData = parseResumeWithoutAI(cleanedText);
//     }

//     return res.status(200).json({
//       message: "PDF parsed successfully",
//       data: parsedData,
//     });
//   } catch (error) {
//     console.error("PDF parse error:", error);
//     return res.status(500).json({
//       message: "Failed to parse PDF",
//       error: error.message,
//     });
//   }
// });

// // Image upload with 1MB limit
// const imageUpload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 1 * 1024 * 1024,
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed"));
//     }
//   },
// });

// // Helper to check if Firebase is initialized
// const ensureFirebaseInitialized = () => {
//   if (getApps().length === 0) {
//     throw new Error(
//       "Firebase Admin is not initialized. Check server logs for initialization errors."
//     );
//   }
// };

// // Verify token middleware
// const verifyToken = async (req, res, next) => {
//   try {
//     ensureFirebaseInitialized();

//     const token = req.headers.authorization?.split("Bearer ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const decodedToken = await getAuth().verifyIdToken(token);
//     req.user = {
//       uid: decodedToken.uid,
//       email: decodedToken.email,
//     };
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // Apply auth middleware to all routes below
// router.use(verifyToken);

// // Get all resumes for user
// router.get("/", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resumes = await Resume.find({ userId: user._id })
//       .sort({ updatedAt: -1 })
//       .select("-versions");

//     res.json(resumes);
//   } catch (error) {
//     console.error("Get resumes error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch resumes", error: error.message });
//   }
// });

// // Get single resume
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOne({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     res.json(resume);
//   } catch (error) {
//     console.error("Get resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch resume", error: error.message });
//   }
// });

// // Create resume
// router.post("/", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resumeData = {
//       ...req.body,
//       userId: user._id,
//     };

//     const resume = await Resume.create(resumeData);
//     res.status(201).json(resume);
//   } catch (error) {
//     console.error("Create resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to create resume", error: error.message });
//   }
// });

// // Update resume
// router.put("/:id", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOne({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     if (
//       resume.versions.length === 0 ||
//       JSON.stringify(resume.toObject()) !==
//         JSON.stringify({ ...resume.toObject(), ...req.body })
//     ) {
//       resume.versions.push({
//         data: resume.toObject(),
//         createdAt: new Date(),
//       });

//       if (resume.versions.length > 10) {
//         resume.versions = resume.versions.slice(-10);
//       }
//     }

//     Object.assign(resume, req.body);
//     await resume.save();

//     res.json(resume);
//   } catch (error) {
//     console.error("Update resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to update resume", error: error.message });
//   }
// });

// // Delete resume
// router.delete("/:id", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOneAndDelete({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     res.json({ message: "Resume deleted successfully" });
//   } catch (error) {
//     console.error("Delete resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to delete resume", error: error.message });
//   }
// });

// // ─────────────────────────────────────────────
// // Upload PDF → Claude parses → save resume
// // ─────────────────────────────────────────────
// router.post("/upload-pdf", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // STEP 1: Extract raw text from PDF
//     const pdfData = await pdfParse(req.file.buffer);
//     const rawText = pdfData.text || "";

//     // STEP 2: Clean + trim text
//     const cleanedText = rawText
//       .replace(/\r/g, "")
//       .replace(/\n{2,}/g, "\n")
//       .replace(/\s{2,}/g, " ")
//       .trim()
//       .slice(0, 15000); // prevent token overflow

//     let parsedData = null;

//     // STEP 3: Try Claude AI — fallback to regex parser if it fails
//     if (process.env.ANTHROPIC_API_KEY) {
//       try {
//         console.log("Using Claude AI to parse resume...");

//         const rawAIResponse = await callClaudeAPI(cleanedText);

//         // Strip any accidental markdown fences
//         const jsonText = rawAIResponse
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//           .trim();

//         parsedData = JSON.parse(jsonText);
//         console.log("Claude parsed successfully.");
//       } catch (aiError) {
//         console.warn(
//           "Claude failed. Falling back to regex parser.",
//           aiError.message
//         );
//         parsedData = parseResumeWithoutAI(cleanedText);
//       }
//     } else {
//       console.log("No ANTHROPIC_API_KEY found. Using fallback regex parser.");
//       parsedData = parseResumeWithoutAI(cleanedText);
//     }

//     // STEP 4: Map parsed data to resume schema
//     const resumeData = {
//       userId: user._id,
//       title: parsedData.name
//         ? `${parsedData.name}'s Resume`
//         : "Resume from PDF",
//       template: req.body.template || "modern",
//       theme: {
//         primaryColor: req.body.primaryColor || "#3b82f6",
//         font: req.body.font || "inter",
//       },
//       personalInfo: {
//         name: parsedData.name || "",
//         email: parsedData.email || "",
//         phone: parsedData.phone || "",
//         location: "",
//         website: "",
//         linkedin: "",
//         github: "",
//       },
//       summary: parsedData.summary || "",
//       experience: (parsedData.experience || []).map((exp) => ({
//         company: exp.company || "",
//         position: exp.position || "",
//         startDate: exp.startDate || "",
//         endDate: exp.endDate || null,
//         current: exp.current || false,
//         description: "",
//         bullets: exp.bullets || [],
//       })),
//       education: (parsedData.education || []).map((edu) => ({
//         institution: edu.institution || "",
//         degree: edu.degree || "",
//         field: edu.field || null,
//         startDate: edu.startDate || "",
//         endDate: edu.endDate || null,
//         current: edu.current || false,
//         gpa: edu.gpa || null,
//       })),
//       skills: parsedData.skills || [],
//       sections: [],
//     };

//     // STEP 5: Save to database
//     const resume = await Resume.create(resumeData);

//     res.status(201).json({
//       message: "Resume created successfully from PDF",
//       resume,
//       parsedData,
//     });
//   } catch (error) {
//     console.error("Upload PDF error:", error);
//     res.status(500).json({
//       message: "Failed to process PDF",
//       error: error.message,
//     });
//   }
// });

// // Upload user profile image
// router.post("/upload-image", imageUpload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No image uploaded" });
//     }

//     if (req.file.size > 1 * 1024 * 1024) {
//       return res
//         .status(400)
//         .json({ message: "Image size must be less than 1MB" });
//     }

//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const imageBase64 = req.file.buffer.toString("base64");
//     const imageDataUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

//     user.photoURL = imageDataUrl;
//     await user.save();

//     res.json({
//       message: "Image uploaded successfully",
//       photoURL: imageDataUrl,
//     });
//   } catch (error) {
//     console.error("Upload image error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to upload image", error: error.message });
//   }
// });

// // Download resume as JSON
// router.get("/:id/download", async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resume = await Resume.findOne({
//       _id: req.params.id,
//       userId: user._id,
//     });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     res.setHeader("Content-Type", "application/json");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="resume-${resume.title.replace(
//         /[^a-z0-9]/gi,
//         "_"
//       )}.json"`
//     );

//     res.json(resume);
//   } catch (error) {
//     console.error("Download resume error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to download resume", error: error.message });
//   }
// });

// export default router;

// v3 with Groq API

import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import Groq from "groq-sdk";
import Resume from "../models/Resume.js";
import User from "../models/User.js";
import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for PDFs
  },
});

// Helper function to parse resume text without AI (basic regex-based extraction)
const parseResumeWithoutAI = (text) => {
  console.log(text);
  if (!text) return {};

  const cleanedText = text.replace(/\r/g, "");
  const lines = cleanedText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // EMAIL
  const emailMatch = cleanedText.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
  );

  // PHONE
  const phoneMatch = cleanedText.match(
    /(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/
  );

  // NAME (first meaningful line)
  let name = "";
  for (let line of lines.slice(0, 5)) {
    if (
      line.length > 2 &&
      line.length < 50 &&
      !line.includes("@") &&
      !/\d/.test(line)
    ) {
      name = line;
      break;
    }
  }

  // SECTION DETECTION
  const sections = {
    summary: "",
    experience: [],
    education: [],
    skills: [],
  };

  let currentSection = "";

  const sectionKeywords = {
    summary: ["summary", "profile", "about"],
    experience: ["experience", "work", "employment"],
    education: ["education", "academic"],
    skills: ["skills", "technologies", "tools"],
  };

  const detectSection = (line) => {
    const l = line.toLowerCase();
    for (const key in sectionKeywords) {
      if (sectionKeywords[key].some((k) => l.includes(k))) {
        return key;
      }
    }
    return null;
  };

  let buffer = [];

  for (let line of lines) {
    const detected = detectSection(line);
    if (detected) {
      if (currentSection && buffer.length) {
        sections[currentSection] = buffer;
      }
      currentSection = detected;
      buffer = [];
      continue;
    }
    if (currentSection) {
      buffer.push(line);
    }
  }

  if (currentSection && buffer.length) {
    sections[currentSection] = buffer;
  }

  // EXPERIENCE PARSER
  const experience = [];
  if (Array.isArray(sections.experience)) {
    let currentJob = null;
    sections.experience.forEach((line) => {
      const dateMatch = line.match(
        /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i
      );
      if (dateMatch) {
        if (currentJob) experience.push(currentJob);
        currentJob = {
          company: "",
          position: line,
          startDate: "",
          endDate: "",
          current: /present/i.test(line),
          bullets: [],
        };
      } else if (currentJob) {
        currentJob.bullets.push(line);
      }
    });
    if (currentJob) experience.push(currentJob);
  }

  // EDUCATION PARSER
  const education = [];
  if (Array.isArray(sections.education)) {
    sections.education.forEach((line) => {
      if (line.length > 5) {
        education.push({
          institution: line,
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
          gpa: "",
        });
      }
    });
  }

  // SKILLS PARSER
  let skills = [];
  if (Array.isArray(sections.skills)) {
    skills = sections.skills
      .join(" ")
      .split(/[,•|]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 30);
  }

  // SUMMARY
  let summary = "";
  if (Array.isArray(sections.summary)) {
    summary = sections.summary.join(" ").slice(0, 400);
  }

  return {
    name,
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    summary,
    experience,
    education,
    skills,
  };
};

// ─────────────────────────────────────────────
// Groq API helper
// ─────────────────────────────────────────────
const callGroqAPI = async (resumeText) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const client = new Groq({ apiKey });

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 2048,
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You are a resume parser. Extract structured information and return ONLY valid JSON — no markdown, no explanation, no code blocks. Just the raw JSON object.",
      },
      {
        role: "user",
        content: `Extract structured information from the resume text below.

Return ONLY this JSON structure:
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
      "current": false,
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
      "current": false,
      "gpa": "string or null"
    }
  ],
  "skills": ["string"]
}

Resume Text:
${resumeText}`,
      },
    ],
  });

  return completion.choices[0]?.message?.content || "";
};

// ─────────────────────────────────────────────
// Public route: parse PDF only (no auth needed)
// ─────────────────────────────────────────────
router.post("/v1/pdf/parse", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text || "";

    const cleanedText = rawText
      .replace(/\r/g, "")
      .replace(/\n{2,}/g, "\n")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 15000);

    let parsedData = null;

    if (process.env.GROQ_API_KEY) {
      try {
        console.log("Using Claude AI to parse resume...");
        const rawAIResponse = await callGroqAPI(cleanedText);
        const jsonText = rawAIResponse
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        parsedData = JSON.parse(jsonText);
        console.log("Claude parsed successfully.");
      } catch (aiError) {
        console.warn(
          "Claude failed. Falling back to regex parser.",
          aiError.message
        );
        parsedData = parseResumeWithoutAI(cleanedText);
      }
    } else {
      console.log("No GROQ_API_KEY found. Using fallback regex parser.");
      parsedData = parseResumeWithoutAI(cleanedText);
    }

    return res.status(200).json({
      message: "PDF parsed successfully",
      data: parsedData,
    });
  } catch (error) {
    console.error("PDF parse error:", error);
    return res.status(500).json({
      message: "Failed to parse PDF",
      error: error.message,
    });
  }
});

// Image upload with 1MB limit
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

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

// Apply auth middleware to all routes below
router.use(verifyToken);

// Get all resumes for user
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resumes = await Resume.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .select("-versions");

    res.json(resumes);
  } catch (error) {
    console.error("Get resumes error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch resumes", error: error.message });
  }
});

// Get single resume
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    console.error("Get resume error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch resume", error: error.message });
  }
});

// Create resume
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resumeData = {
      ...req.body,
      userId: user._id,
    };

    const resume = await Resume.create(resumeData);
    res.status(201).json(resume);
  } catch (error) {
    console.error("Create resume error:", error);
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
});

// Update resume
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (
      resume.versions.length === 0 ||
      JSON.stringify(resume.toObject()) !==
        JSON.stringify({ ...resume.toObject(), ...req.body })
    ) {
      resume.versions.push({
        data: resume.toObject(),
        createdAt: new Date(),
      });

      if (resume.versions.length > 10) {
        resume.versions = resume.versions.slice(-10);
      }
    }

    Object.assign(resume, req.body);
    await resume.save();

    res.json(resume);
  } catch (error) {
    console.error("Update resume error:", error);
    res
      .status(500)
      .json({ message: "Failed to update resume", error: error.message });
  }
});

// Delete resume
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete resume", error: error.message });
  }
});

// ─────────────────────────────────────────────
// Upload PDF → Claude parses → save resume
// ─────────────────────────────────────────────
router.post("/upload-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // STEP 1: Extract raw text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text || "";

    // STEP 2: Clean + trim text
    const cleanedText = rawText
      .replace(/\r/g, "")
      .replace(/\n{2,}/g, "\n")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 15000); // prevent token overflow

    let parsedData = null;

    // STEP 3: Try Claude AI — fallback to regex parser if it fails
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("Using Claude AI to parse resume...");

        const rawAIResponse = await callGroqAPI(cleanedText);

        // Strip any accidental markdown fences
        const jsonText = rawAIResponse
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        parsedData = JSON.parse(jsonText);
        console.log("Claude parsed successfully.");
      } catch (aiError) {
        console.warn(
          "Claude failed. Falling back to regex parser.",
          aiError.message
        );
        parsedData = parseResumeWithoutAI(cleanedText);
      }
    } else {
      console.log("No GROQ_API_KEY found. Using fallback regex parser.");
      parsedData = parseResumeWithoutAI(cleanedText);
    }

    // STEP 4: Map parsed data to resume schema
    const resumeData = {
      userId: user._id,
      title: parsedData.name
        ? `${parsedData.name}'s Resume`
        : "Resume from PDF",
      template: req.body.template || "modern",
      theme: {
        primaryColor: req.body.primaryColor || "#3b82f6",
        font: req.body.font || "inter",
      },
      personalInfo: {
        name: parsedData.name || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
      },
      summary: parsedData.summary || "",
      experience: (parsedData.experience || []).map((exp) => ({
        company: exp.company || "",
        position: exp.position || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || null,
        current: exp.current || false,
        description: "",
        bullets: exp.bullets || [],
      })),
      education: (parsedData.education || []).map((edu) => ({
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || null,
        startDate: edu.startDate || "",
        endDate: edu.endDate || null,
        current: edu.current || false,
        gpa: edu.gpa || null,
      })),
      skills: parsedData.skills || [],
      sections: [],
    };

    // STEP 5: Save to database
    const resume = await Resume.create(resumeData);

    res.status(201).json({
      message: "Resume created successfully from PDF",
      resume,
      parsedData,
    });
  } catch (error) {
    console.error("Upload PDF error:", error);
    res.status(500).json({
      message: "Failed to process PDF",
      error: error.message,
    });
  }
});

// Upload user profile image
router.post("/upload-image", imageUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    if (req.file.size > 1 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: "Image size must be less than 1MB" });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imageBase64 = req.file.buffer.toString("base64");
    const imageDataUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    user.photoURL = imageDataUrl;
    await user.save();

    res.json({
      message: "Image uploaded successfully",
      photoURL: imageDataUrl,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res
      .status(500)
      .json({ message: "Failed to upload image", error: error.message });
  }
});

// Download resume as JSON
router.get("/:id/download", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resume-${resume.title.replace(
        /[^a-z0-9]/gi,
        "_"
      )}.json"`
    );

    res.json(resume);
  } catch (error) {
    console.error("Download resume error:", error);
    res
      .status(500)
      .json({ message: "Failed to download resume", error: error.message });
  }
});

export default router;
