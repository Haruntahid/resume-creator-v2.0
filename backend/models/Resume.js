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

const customSectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [customSectionItemSchema],
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // FlowCV Style Data Model
  name: {
    type: String,
    required: true,
    default: "My Resume",
  },
  templateId: {
    type: String,
    required: true,
    default: "classic-clear",
  },
  design: {
    type: mongoose.Schema.Types.Mixed,
    default: () => ({
      primaryColor: "#3626A7",
      accentColor: "#6366F1",
      textColor: "#111827",
      backgroundColor: "#FFFFFF",
      headingFont: "Inter",
      bodyFont: "Inter",
      fontSize: "md",
      pageMargin: "normal",
      sectionSpacing: "normal",
      layout: "single",
      headerStyle: "minimal",
      showDividers: true,
    }),
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: () => ({
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: "",
        photoURL: "",
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      customSections: [],
    }),
  },
  sectionOrder: {
    type: [String],
    default: () => [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
      "customSections"
    ],
  },
  // Legacy fields for backwards compatibility
  title: {
    type: String,
    default: "Untitled Resume",
  },
  template: {
    type: String,
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
  customSections: [customSectionSchema],
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
  // Sync legacy title with name if needed
  if (this.isModified("name")) {
    this.title = this.name;
  }
  next();
});

export default mongoose.model("Resume", resumeSchema);
