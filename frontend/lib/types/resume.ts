export interface DesignSettings {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  headingFont: string;
  bodyFont: string;
  fontSize: "sm" | "md" | "lg";
  pageMargin: "narrow" | "normal" | "wide";
  sectionSpacing: "compact" | "normal" | "relaxed";
  layout: "single" | "two-column-left" | "two-column-right";
  headerStyle: "minimal" | "colored-band" | "sidebar";
  showDividers: boolean;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photoURL?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  url?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  language: string;
  level: string; // e.g. Native, Fluent, Conversational
}

export interface CustomSectionItem {
  title: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  bullets?: string[];
  url?: string;
}

export interface CustomSection {
  name: string;
  items: CustomSectionItem[];
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
}

export interface Resume {
  id?: string;
  _id?: string;
  userId?: string;
  name: string;
  templateId: string;
  design: DesignSettings;
  content: ResumeContent;
  sectionOrder: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: "modern" | "classic" | "creative" | "minimal";
  atsScore: number; // 1-100
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    accent: string;
  };
  layout: "single-column" | "two-column-left" | "two-column-right";
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: number;
    bodySize: number;
  };
  sectionOrder: string[];
  headerStyle: "centered" | "left-aligned" | "with-sidebar";
}
