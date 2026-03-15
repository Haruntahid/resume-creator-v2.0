"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { resumeApi, pdfApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeForm from "./ResumeForm";
import ResumePreview from "./ResumePreview";
import TemplateSelector from "./TemplateSelector";
import { Button } from "@/components/ui/button";
import { Save, Download, Upload, Sparkles } from "lucide-react";
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

interface ResumeBuilderProps {
  resume: any;
  resumeId: string;
}

export default function ResumeBuilder({
  resume: initialResume,
  resumeId,
}: ResumeBuilderProps) {
  const router = useRouter();
  const { idToken } = useAuth();
  const { toast } = useToast();
  const [resume, setResume] = useState(initialResume);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(
    resume.template || "modern"
  );
  const [isNew, setIsNew] = useState(resumeId === "new");
  const [isDirty, setIsDirty] = useState(false);

  // Auto-save every 2 seconds
  useEffect(() => {
    if (!idToken || isNew) return;

    // Set a timer to save after 1.5 seconds of inactivity
    const timer = setTimeout(() => {
      if (isDirty) {
        handleSave(false);
        setIsDirty(false);
      }
    }, 1500);

    // const autoSaveInterval = setInterval(() => {
    //   handleSave(false);
    // }, 2000);

    // Cleanup: if the user types again before 1.5s, clear the previous timer
    return () => clearTimeout(timer);

    // return () => clearInterval(autoSaveInterval);
  }, [resume, idToken, isNew, isDirty]);

  function cleanResumeData(resume: any) {
    const { _id, __v, versions, createdAt, updatedAt, userId, ...clean } =
      resume;
    return clean;
  }

  const handleSave = useCallback(
    async (showToast = true) => {
      if (!idToken) return;

      try {
        setSaving(true);

        if (isNew) {
          const created = await resumeApi.create(resume, idToken);
          setIsNew(false);
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
          await resumeApi.update(resumeId, cleanResumeData(resume), idToken);
          if (showToast) {
            toast({
              title: "Saved",
              description: "Resume saved successfully",
            });
          }
        }
      } catch (error: any) {
        console.error("Save error:", error);
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

  const handleResumeChange = useCallback((updates: any) => {
    setResume((prev: any) => ({ ...prev, ...updates }));
  }, []);

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    handleResumeChange({ template });
  };

  const handleExportPDF = async () => {
    try {
      const previewElement = document.getElementById("resume-preview");
      if (!previewElement) return;

      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      toast({
        title: "Generating PDF",
        description: "Please wait...",
      });

      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`${resume.title || "resume"}.pdf`);

      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export PDF",
        variant: "destructive",
      });
    }
  };

  // const handleParseResume = async (
  //   file: File,
  //   template?: string,
  //   primaryColor?: string
  // ) => {
  //   if (!idToken) return;

  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     if (template) formData.append("template", template);
  //     if (primaryColor) formData.append("primaryColor", primaryColor);

  //     toast({
  //       title: "Parsing resume",
  //       description: "AI is analyzing your PDF and creating your resume...",
  //     });

  //     // Use the new upload-pdf endpoint that auto-creates the resume
  //     // const result = await resumeApi.uploadPdf(
  //     //   formData,
  //     //   idToken,
  //     //   template || selectedTemplate,
  //     //   primaryColor || resume.theme?.primaryColor
  //     // );
  //     const result = await pdfApi.parse(formData, idToken);

  //     // Update resume with created data
  //     setResume(result.resume);
  //     setSelectedTemplate(result.resume.template || selectedTemplate);

  //     // If it's a new resume, update the URL and navigate
  //     if (isNew && result.resume._id) {
  //       setIsNew(false);
  //       router.replace(`/dashboard/resume/${result.resume._id}`);
  //     }

  //     toast({
  //       title: "Success",
  //       description:
  //         "Resume created from PDF successfully! You can now edit it.",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to parse and create resume",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleParseResume = async (
    file: File,
    template?: string,
    primaryColor?: string
  ) => {
    if (!idToken) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      toast({
        title: "Parsing resume",
        description: "Extracting data from your PDF...",
      });

      const result = await pdfApi.parse(formData, idToken);

      const parsedData = result.data;

      // Map parsed JSON to resume state
      const newResume = {
        ...resume,
        title: parsedData.name
          ? `${parsedData.name}'s Resume`
          : "Resume from PDF",
        template: template || selectedTemplate,
        theme: {
          ...resume.theme,
          primaryColor: primaryColor || resume.theme?.primaryColor,
        },
        personalInfo: {
          ...resume.personalInfo,
          name: parsedData.name || "",
          email: parsedData.email || "",
          phone: parsedData.phone || "",
        },
        summary: parsedData.summary || "",
        experience: parsedData.experience || [],
        education: parsedData.education || [],
        skills: parsedData.skills || [],
      };

      setResume(newResume);

      toast({
        title: "Success",
        description: "Resume parsed successfully. You can now edit it.",
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <Input
            value={resume.title}
            onChange={(e) => handleResumeChange({ title: e.target.value })}
            className="max-w-xs font-semibold text-lg border-0 focus-visible:ring-2 bg-transparent"
            placeholder="Resume Title"
          />
          {saving && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              Saving...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Powered PDF Parser
                </DialogTitle>
                <DialogDescription>
                  Upload your existing resume PDF. AI will extract all
                  information and create a new resume automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select PDF File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleParseResume(
                          file,
                          selectedTemplate,
                          resume.theme?.primaryColor
                        );
                      }
                    }}
                    className="mt-2"
                  />
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p className="font-medium mb-1">What happens next:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>AI extracts all information from your PDF</li>
                    <li>A new resume is automatically created</li>
                    <li>You can edit, change template, and customize</li>
                    <li>Download as PDF when ready</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={() => handleSave(true)}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button size="sm" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Panel - Left Side */}
        <div className="w-[400px] border-r bg-background overflow-auto">
          <div className="sticky top-0 bg-background border-b z-10 p-4">
            <h2 className="text-lg font-semibold">Edit Resume</h2>
            <p className="text-sm text-muted-foreground">
              Fill in your information below
            </p>
          </div>
          <ResumeForm
            resume={resume}
            onChange={handleResumeChange}
            idToken={idToken}
          />
        </div>

        {/* Preview Panel - Right Side */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-muted/50 to-muted p-8">
          <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10 p-4 mb-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Live Preview</h2>
                <p className="text-sm text-muted-foreground">
                  See your changes in real-time
                </p>
              </div>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={handleTemplateChange}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <ResumePreview resume={resume} template={selectedTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
}
