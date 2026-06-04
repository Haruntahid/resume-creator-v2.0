"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { resumeApi, pdfApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import ResumeForm from "./ResumeForm";
import ResumePreview from "./ResumePreview";
import TemplateSelector from "./TemplateSelector";
import DesignPanel from "./DesignPanel";
import ATSPanel from "./ATSPanel";
import { Button } from "@/components/ui/button";
import { Save, Download, Upload, Sparkles, Sliders, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pdf } from "@react-pdf/renderer";
import PDFResume from "./PDFResume";
import { Resume } from "@/lib/types/resume";

interface ResumeBuilderProps {
  resume: any;
  resumeId: string;
}

const ensureFlowCVStructure = (res: any): Resume => {
  return {
    ...res,
    name: res?.name || res?.title || "My Resume",
    templateId: res?.templateId || res?.template || "classic-clear",
    design: {
      primaryColor: res?.design?.primaryColor || res?.theme?.primaryColor || "#3626A7",
      accentColor: res?.design?.accentColor || res?.theme?.accentColor || "#6366F1",
      textColor: res?.design?.textColor || res?.theme?.textColor || "#111827",
      backgroundColor: res?.design?.backgroundColor || res?.theme?.backgroundColor || "#FFFFFF",
      headingFont: res?.design?.headingFont || res?.theme?.font || "Inter",
      bodyFont: res?.design?.bodyFont || res?.theme?.font || "Inter",
      fontSize: res?.design?.fontSize || "md",
      pageMargin: res?.design?.pageMargin || "normal",
      sectionSpacing: res?.design?.sectionSpacing || "normal",
      layout: res?.design?.layout || "single",
      headerStyle: res?.design?.headerStyle || "minimal",
      showDividers: res?.design?.showDividers !== undefined ? res?.design?.showDividers : true,
    },
    content: {
      personalInfo: {
        name: res?.content?.personalInfo?.name || res?.personalInfo?.name || "",
        email: res?.content?.personalInfo?.email || res?.personalInfo?.email || "",
        phone: res?.content?.personalInfo?.phone || res?.personalInfo?.phone || "",
        location: res?.content?.personalInfo?.location || res?.personalInfo?.location || "",
        linkedin: res?.content?.personalInfo?.linkedin || res?.personalInfo?.linkedin || "",
        website: res?.content?.personalInfo?.website || res?.personalInfo?.website || "",
        photoURL: res?.content?.personalInfo?.photoURL || res?.personalInfo?.photoURL || "",
      },
      summary: res?.content?.summary || res?.summary || "",
      experience: res?.content?.experience || res?.experience || [],
      education: res?.content?.education || res?.education || [],
      skills: res?.content?.skills || res?.skills || [],
      projects: res?.content?.projects || res?.projects || [],
      certifications: res?.content?.certifications || res?.certifications || [],
      languages: res?.content?.languages || res?.languages || [],
      customSections: res?.content?.customSections || res?.customSections || [],
    },
    sectionOrder: res?.sectionOrder || [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
      "customSections"
    ],
  };
};

export default function ResumeBuilder({
  resume: initialResume,
  resumeId,
}: ResumeBuilderProps) {
  const router = useRouter();
  const { idToken } = useAuth();
  const { toast } = useToast();
  
  const [resume, setResume] = useState<Resume>(() => ensureFlowCVStructure(initialResume));
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(resumeId === "new");
  const [isDirty, setIsDirty] = useState(false);

  // Auto-save every 1.5 seconds if dirty
  useEffect(() => {
    if (!idToken || isNew) return;

    const timer = setTimeout(() => {
      if (isDirty) {
        handleSave(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [resume, idToken, isNew, isDirty]);

  const cleanResumeData = (res: Resume) => {
    const { _id, __v, createdAt, updatedAt, userId, ...clean } = res as any;
    return clean;
  };

  const handleSave = useCallback(
    async (showToast = true) => {
      if (!idToken) return;
      try {
        setSaving(true);
        const dataToSave = cleanResumeData(resume);

        if (isNew) {
          const created = await resumeApi.create(dataToSave, idToken);
          setIsNew(false);
          setIsDirty(false);
          window.history.replaceState(
            null,
            "",
            `/dashboard/resume/${created._id}`
          );
          if (showToast) {
            toast({
              title: "Success",
              description: "Resume created successfully",
            });
          }
        } else {
          await resumeApi.update(resumeId, dataToSave, idToken);
          setIsDirty(false);
          if (showToast) {
            toast({
              title: "Saved",
              description: "Resume saved successfully",
            });
          }
        }
      } catch (error: any) {
        if (showToast) {
          toast({
            title: "Error",
            description: error.message || "Failed to save resume",
            variant: "destructive",
          });
        }
      } finally {
        setSaving(false);
      }
    },
    [resume, idToken, resumeId, isNew, toast]
  );

  const handleResumeChange = useCallback((updates: Partial<Resume>) => {
    setResume((prev: any) => {
      const merged = { ...prev, ...updates };
      return merged;
    });
    setIsDirty(true);
  }, []);

  const handleContentChange = useCallback((contentUpdates: any) => {
    setResume((prev) => {
      const updated = {
        ...prev,
        content: {
          ...prev.content,
          ...contentUpdates.content,
        },
        sectionOrder: contentUpdates.sectionOrder !== undefined ? contentUpdates.sectionOrder : prev.sectionOrder,
      };
      return updated;
    });
    setIsDirty(true);
  }, []);

  const handleDesignChange = useCallback((designUpdates: any) => {
    setResume((prev) => {
      const updated = {
        ...prev,
        design: {
          ...prev.design,
          ...designUpdates,
        },
      };
      return updated;
    });
    setIsDirty(true);
  }, []);

  const handleTemplateChange = (templateId: string) => {
    // Look up default parameters for template
    const { templates, getDefaultResume } = require("@/lib/templates");
    const defaults = getDefaultResume(templateId, resume.name);

    setResume((prev) => ({
      ...prev,
      templateId,
      design: {
        ...prev.design,
        ...defaults.design,
      },
    }));
    setIsDirty(true);
    toast({
      title: "Template Applied",
      description: `Switched to ${templates[templateId]?.name || templateId}`,
    });
  };

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Preparing pixel-perfect layout...",
      });

      // Render vector sharp PDF in memory using react-pdf/renderer
      const doc = <PDFResume resume={resume} pageSize="A4" />;
      const blob = await pdf(doc).toBlob();

      // Download file directly
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.name.toLowerCase().replace(/\s+/g, "-")}-resume-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Vector PDF downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const handleParseResume = async (file: File) => {
    if (!idToken) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      toast({
        title: "Parsing resume",
        description: "Extracting details using Gemini AI...",
      });

      const result = await pdfApi.parse(formData, idToken);
      const parsedData = result.data;

      // Map parsed data into resume state structure
      const newResume = {
        ...resume,
        name: parsedData.name ? `${parsedData.name}'s Resume` : "Resume from PDF",
        content: {
          ...resume.content,
          personalInfo: {
            ...resume.content.personalInfo,
            name: parsedData.name || "",
            email: parsedData.email || "",
            phone: parsedData.phone || "",
          },
          summary: parsedData.summary || "",
          experience: parsedData.experience || [],
          education: parsedData.education || [],
          skills: parsedData.skills || [],
        },
      };

      setResume(newResume);
      setIsDirty(true);
      toast({
        title: "Success",
        description: "Resume parsed successfully. Review your changes.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to parse resume",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[100vh] flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Premium Header */}
      <header className="h-16 border-b bg-white/80 backdrop-blur-md px-6 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-4">
          <Input
            value={resume.name}
            onChange={(e) => handleResumeChange({ name: e.target.value })}
            className="font-bold text-lg border-0 focus-visible:ring-1 bg-transparent max-w-xs focus:bg-gray-50 hover:bg-gray-50/50 transition-all p-2 rounded"
            placeholder="Untitled Resume"
          />
          {saving ? (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Auto-saving...
            </span>
          ) : isDirty ? (
            <span className="text-xs text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">
              Unsaved changes
            </span>
          ) : (
            <span className="text-xs text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
              Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Upload PDF Parser Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
                <Upload className="h-4 w-4" />
                Upload PDF
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  Gemini AI Resume Parser
                </DialogTitle>
                <DialogDescription>
                  Upload your current PDF. Our AI parses experience, education, skills, and personal information into this template instantly.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="file-upload" className="text-xs font-semibold text-gray-500">Choose PDF File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleParseResume(file);
                    }}
                    className="mt-2 text-xs"
                  />
                </div>
                <div className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg border">
                  <p className="font-semibold mb-1 text-gray-700">How it works:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Extracts text components from your document safely</li>
                    <li>Gemini models structure dates, bullet points, and contact info</li>
                    <li>Reflects results inside this visual editor</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Template Gallery Selector */}
          <TemplateSelector
            selectedTemplate={resume.templateId}
            onSelect={handleTemplateChange}
          />

          <Button variant="outline" size="sm" onClick={() => handleSave(true)} className="h-9 gap-1.5">
            <Save className="h-4 w-4" />
            Save Now
          </Button>

          <Button size="sm" onClick={handleExportPDF} className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Control Panel (Form Editor + Design) */}
        <section className="w-[450px] shrink-0 border-r bg-white flex flex-col h-full shadow-lg z-10">
          <Tabs defaultValue="content" className="flex-1 flex flex-col h-full overflow-hidden">
            <TabsList className="grid grid-cols-2 rounded-none border-b h-12 bg-slate-50 p-0">
              <TabsTrigger
                value="content"
                className="rounded-none h-full border-r data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-indigo-600 transition-all text-xs"
              >
                <FileText className="h-4 w-4 mr-2" />
                Resume Content
              </TabsTrigger>
              <TabsTrigger
                value="design"
                className="rounded-none h-full data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-indigo-600 transition-all text-xs"
              >
                <Sliders className="h-4 w-4 mr-2" />
                Design Panel
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="content" className="m-0 p-0 focus-visible:ring-0">
                <ResumeForm
                  resume={resume}
                  onChange={handleContentChange}
                  idToken={idToken}
                />
              </TabsContent>

              <TabsContent value="design" className="m-0 p-0 focus-visible:ring-0">
                <DesignPanel
                  settings={resume.design}
                  onChange={handleDesignChange}
                />
              </TabsContent>
            </div>
          </Tabs>
        </section>

        {/* Right Preview Panel (A4 Scaled live HTML + bottom ATS) */}
        <section className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
          <div className="flex-1 overflow-hidden relative">
            <ResumePreview resume={resume} />
          </div>

          {/* Real-time ATS Dashboard Panel */}
          <div className="w-full shrink-0 z-20">
            <ATSPanel
              resume={resume}
              onChange={handleContentChange}
              idToken={idToken}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
