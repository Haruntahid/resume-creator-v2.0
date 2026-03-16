import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String,
  bullets: [String],
});

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  gpa: String,
});

// NEW: Custom section item schema
const customSectionItemSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String,
  bullets: [String],
  url: String,
});

// NEW: Custom section schema
const customSectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Projects", "Certifications"
  items: [customSectionItemSchema],
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Untitled Resume",
  },
  template: {
    type: String,
    required: true,
    default: "modern",
  },
  theme: {
    primaryColor: {
      type: String,
      default: "#3b82f6",
    },
    font: {
      type: String,
      default: "inter",
    },
  },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    photoURL: String,
  },
  summary: String,
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [String],
  customSections: [customSectionSchema], // NEW
  sections: [
    {
      type: {
        type: String,
        enum: ["experience", "education", "skills", "summary", "custom"],
      },
      order: Number,
    },
  ],
  versions: [
    {
      data: mongoose.Schema.Types.Mixed,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

resumeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Resume", resumeSchema);
