// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { resumeApi, pdfApi } from "@/lib/api";
// import { useToast } from "@/components/ui/use-toast";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ResumeForm from "./ResumeForm";
// import ResumePreview from "./ResumePreview";
// import TemplateSelector from "./TemplateSelector";
// import { Button } from "@/components/ui/button";
// import { Save, Download, Upload, Sparkles } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";

// interface ResumeBuilderProps {
//   resume: any;
//   resumeId: string;
// }

// export default function ResumeBuilder({
//   resume: initialResume,
//   resumeId,
// }: ResumeBuilderProps) {
//   const router = useRouter();
//   const { idToken } = useAuth();
//   const { toast } = useToast();
//   const [resume, setResume] = useState(initialResume);
//   const [saving, setSaving] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(
//     resume.template || "modern"
//   );
//   const [isNew, setIsNew] = useState(resumeId === "new");
//   const [isDirty, setIsDirty] = useState(false);
//   const [formWidth, setFormWidth] = useState(450); // Initial width in pixels
//   const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
//   const isResizing = useRef(false);

//   // resizing handlers
//   // 1. Mouse Move Handler for Resizing
//   const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
//     isResizing.current = true;
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", stopResizing);
//     document.body.style.cursor = "col-resize"; // Visual feedback
//   }, []);

//   const stopResizing = useCallback(() => {
//     isResizing.current = false;
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", stopResizing);
//     document.body.style.cursor = "default";
//   }, []);

//   const handleMouseMove = useCallback((e: MouseEvent) => {
//     if (!isResizing.current) return;

//     const newWidth = e.clientX;
//     // Set boundaries (e.g., min 300px, max 800px)
//     if (newWidth > 300 && newWidth < 800) {
//       setFormWidth(newWidth);
//     }
//   }, []);

//   // Auto-save every 2 seconds
//   useEffect(() => {
//     if (!idToken || isNew) return;

//     // Set a timer to save after 1.5 seconds of inactivity
//     const timer = setTimeout(() => {
//       if (isDirty) {
//         handleSave(false);
//         setIsDirty(false);
//       }
//     }, 1500);

//     // const autoSaveInterval = setInterval(() => {
//     //   handleSave(false);
//     // }, 2000);

//     // Cleanup: if the user types again before 1.5s, clear the previous timer
//     return () => clearTimeout(timer);

//     // return () => clearInterval(autoSaveInterval);
//   }, [resume, idToken, isNew, isDirty]);

//   function cleanResumeData(resume: any) {
//     const { _id, __v, versions, createdAt, updatedAt, userId, ...clean } =
//       resume;
//     return clean;
//   }

//   const handleSave = useCallback(
//     async (showToast = true) => {
//       if (!idToken) return;

//       try {
//         setSaving(true);

//         if (isNew) {
//           const created = await resumeApi.create(resume, idToken);
//           setIsNew(false);
//           window.history.replaceState(
//             null,
//             "",
//             `/dashboard/resume/${created._id}`
//           );
//           if (showToast) {
//             toast({
//               title: "Success",
//               description: "Resume created successfully",
//             });
//           }
//         } else {
//           await resumeApi.update(resumeId, cleanResumeData(resume), idToken);
//           if (showToast) {
//             toast({
//               title: "Saved",
//               description: "Resume saved successfully",
//             });
//           }
//         }
//       } catch (error: any) {
//         console.error("Save error:", error);
//         if (showToast) {
//           toast({
//             title: "Error",
//             description: error.message || "Failed to save resume",
//             variant: "destructive",
//           });
//         }
//       } finally {
//         setSaving(false);
//       }
//     },
//     [resume, idToken, resumeId, isNew, toast]
//   );

//   const handleResumeChange = useCallback((updates: any) => {
//     setResume((prev: any) => ({ ...prev, ...updates }));
//   }, []);

//   const handleTemplateChange = (template: string) => {
//     setSelectedTemplate(template);
//     handleResumeChange({ template });
//   };

//   const handleExportPDF = async () => {
//     try {
//       const previewElement = document.getElementById("resume-preview");
//       if (!previewElement) return;

//       const { jsPDF } = await import("jspdf");
//       const html2canvas = (await import("html2canvas")).default;

//       toast({
//         title: "Generating PDF",
//         description: "Please wait...",
//       });

//       const canvas = await html2canvas(previewElement, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });

//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;
//       const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
//       const imgX = (pdfWidth - imgWidth * ratio) / 2;
//       const imgY = 0;

//       pdf.addImage(
//         imgData,
//         "PNG",
//         imgX,
//         imgY,
//         imgWidth * ratio,
//         imgHeight * ratio
//       );
//       pdf.save(`${resume.title || "resume"}.pdf`);

//       toast({
//         title: "Success",
//         description: "PDF downloaded successfully",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to export PDF",
//         variant: "destructive",
//       });
//     }
//   };

//   // const handleParseResume = async (
//   //   file: File,
//   //   template?: string,
//   //   primaryColor?: string
//   // ) => {
//   //   if (!idToken) return;

//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("file", file);
//   //     if (template) formData.append("template", template);
//   //     if (primaryColor) formData.append("primaryColor", primaryColor);

//   //     toast({
//   //       title: "Parsing resume",
//   //       description: "AI is analyzing your PDF and creating your resume...",
//   //     });

//   //     // Use the new upload-pdf endpoint that auto-creates the resume
//   //     // const result = await resumeApi.uploadPdf(
//   //     //   formData,
//   //     //   idToken,
//   //     //   template || selectedTemplate,
//   //     //   primaryColor || resume.theme?.primaryColor
//   //     // );
//   //     const result = await pdfApi.parse(formData, idToken);

//   //     // Update resume with created data
//   //     setResume(result.resume);
//   //     setSelectedTemplate(result.resume.template || selectedTemplate);

//   //     // If it's a new resume, update the URL and navigate
//   //     if (isNew && result.resume._id) {
//   //       setIsNew(false);
//   //       router.replace(`/dashboard/resume/${result.resume._id}`);
//   //     }

//   //     toast({
//   //       title: "Success",
//   //       description:
//   //         "Resume created from PDF successfully! You can now edit it.",
//   //     });
//   //   } catch (error: any) {
//   //     toast({
//   //       title: "Error",
//   //       description: error.message || "Failed to parse and create resume",
//   //       variant: "destructive",
//   //     });
//   //   }
//   // };

//   const handleParseResume = async (
//     file: File,
//     template?: string,
//     primaryColor?: string
//   ) => {
//     if (!idToken) return;

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       toast({
//         title: "Parsing resume",
//         description: "Extracting data from your PDF...",
//       });

//       const result = await pdfApi.parse(formData, idToken);

//       const parsedData = result.data;

//       // Map parsed JSON to resume state
//       const newResume = {
//         ...resume,
//         title: parsedData.name
//           ? `${parsedData.name}'s Resume`
//           : "Resume from PDF",
//         template: template || selectedTemplate,
//         theme: {
//           ...resume.theme,
//           primaryColor: primaryColor || resume.theme?.primaryColor,
//         },
//         personalInfo: {
//           ...resume.personalInfo,
//           name: parsedData.name || "",
//           email: parsedData.email || "",
//           phone: parsedData.phone || "",
//         },
//         summary: parsedData.summary || "",
//         experience: parsedData.experience || [],
//         education: parsedData.education || [],
//         skills: parsedData.skills || [],
//       };

//       setResume(newResume);

//       toast({
//         title: "Success",
//         description: "Resume parsed successfully. You can now edit it.",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to parse resume",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 flex items-center justify-between shadow-sm">
//         <div className="flex items-center gap-4 flex-1">
//           <Input
//             value={resume.title}
//             onChange={(e) => handleResumeChange({ title: e.target.value })}
//             className="max-w-xs font-semibold text-lg border-0 focus-visible:ring-2 bg-transparent"
//             placeholder="Resume Title"
//           />
//           {saving && (
//             <span className="text-sm text-muted-foreground flex items-center gap-2">
//               <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
//               Saving...
//             </span>
//           )}
//         </div>
//         <div className="flex items-center gap-2">
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <Upload className="mr-2 h-4 w-4" />
//                 Upload PDF
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-md">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-primary" />
//                   AI-Powered PDF Parser
//                 </DialogTitle>
//                 <DialogDescription>
//                   Upload your existing resume PDF. AI will extract all
//                   information and create a new resume automatically.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="file-upload">Select PDF File</Label>
//                   <Input
//                     id="file-upload"
//                     type="file"
//                     accept=".pdf"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) {
//                         handleParseResume(
//                           file,
//                           selectedTemplate,
//                           resume.theme?.primaryColor
//                         );
//                       }
//                     }}
//                     className="mt-2"
//                   />
//                 </div>
//                 <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
//                   <p className="font-medium mb-1">What happens next:</p>
//                   <ul className="list-disc list-inside space-y-1 text-xs">
//                     <li>AI extracts all information from your PDF</li>
//                     <li>A new resume is automatically created</li>
//                     <li>You can edit, change template, and customize</li>
//                     <li>Download as PDF when ready</li>
//                   </ul>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//           <Button variant="outline" size="sm" onClick={() => handleSave(true)}>
//             <Save className="mr-2 h-4 w-4" />
//             Save
//           </Button>
//           <Button size="sm" onClick={handleExportPDF}>
//             <Download className="mr-2 h-4 w-4" />
//             Export PDF
//           </Button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Form Panel - Left Side */}
//         <div
//           className="border-r bg-background overflow-auto"
//           style={{ width: isPreviewCollapsed ? "100%" : `${formWidth}px` }}
//         >
//           <div className="sticky top-0 bg-background border-b z-10 p-4">
//             <h2 className="text-lg font-semibold">Edit Resume</h2>
//             <p className="text-sm text-muted-foreground">
//               Fill in your information below
//             </p>
//           </div>
//           <ResumeForm
//             resume={resume}
//             onChange={handleResumeChange}
//             idToken={idToken}
//           />
//         </div>

//         {/* RESIZE HANDLE: Only visible if not collapsed */}
//         {!isPreviewCollapsed && (
//           <div
//             onMouseDown={startResizing}
//             className="w-1.5 hover:w-2 bg-transparent hover:bg-primary/30 cursor-col-resize transition-all z-10"
//           />
//         )}

//         {/* Preview Panel - Right Side */}
//         <div
//           className={cn(
//             "h-full bg-muted/30 overflow-y-auto transition-all duration-300 ease-in-out",
//             isPreviewCollapsed ? "w-0 opacity-0 invisible" : "flex-1"
//           )}
//         >
//           <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10 p-4 mb-4 rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg font-semibold">Live Preview</h2>
//                 <p className="text-sm text-muted-foreground">
//                   See your changes in real-time
//                 </p>
//               </div>
//               <TemplateSelector
//                 selectedTemplate={selectedTemplate}
//                 onSelect={handleTemplateChange}
//               />
//             </div>
//           </div>
//           <div className="flex justify-center">
//             <ResumePreview resume={resume} template={selectedTemplate} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { cn } from "@/lib/utils";

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
  const [formWidth, setFormWidth] = useState(450);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const isResizing = useRef(false);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "col-resize";
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
    document.body.style.cursor = "default";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX;
    if (newWidth > 300 && newWidth < 800) {
      setFormWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    if (!idToken || isNew) return;
    const timer = setTimeout(() => {
      if (isDirty) {
        handleSave(false);
        setIsDirty(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
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
          if (showToast)
            toast({
              title: "Success",
              description: "Resume created successfully",
            });
        } else {
          await resumeApi.update(resumeId, cleanResumeData(resume), idToken);
          if (showToast)
            toast({ title: "Saved", description: "Resume saved successfully" });
        }
      } catch (error: any) {
        if (showToast)
          toast({
            title: "Error",
            description: error.message || "Failed to save resume",
            variant: "destructive",
          });
      } finally {
        setSaving(false);
      }
    },
    [resume, idToken, resumeId, isNew, toast]
  );

  const handleResumeChange = useCallback((updates: any) => {
    setResume((prev: any) => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    handleResumeChange({ template });
  };

  // ─────────────────────────────────────────────
  // Multi-page PDF export
  // Splits the preview into A4-sized chunks so
  // content naturally flows across pages.
  // ─────────────────────────────────────────────
  const handleExportPDF = async () => {
    try {
      const previewElement = document.getElementById("resume-preview");
      if (!previewElement) {
        toast({
          title: "Error",
          description: "Preview element not found",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Generating PDF", description: "Please wait..." });

      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      // A4 dimensions in mm
      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;

      // Render the full preview at 2x scale for sharpness
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        // Render the FULL scrollable height
        windowWidth: previewElement.scrollWidth,
        windowHeight: previewElement.scrollHeight,
        height: previewElement.scrollHeight,
        width: previewElement.scrollWidth,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // How many canvas pixels fit in one A4 page height?
      // pxPerMm = imgWidth / A4_WIDTH_MM  (because we fit width to A4 width)
      const pxPerMm = imgWidth / A4_WIDTH_MM;
      const pageHeightPx = A4_HEIGHT_MM * pxPerMm;

      let remainingHeight = imgHeight;
      let sourceY = 0;
      let pageNumber = 0;

      while (remainingHeight > 0) {
        const sliceHeight = Math.min(pageHeightPx, remainingHeight);

        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = imgWidth;
        pageCanvas.height = sliceHeight;

        const ctx = pageCanvas.getContext("2d");
        if (!ctx) break;

        // Draw the slice from the full canvas onto the page canvas
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          imgWidth,
          sliceHeight,
          0,
          0,
          imgWidth,
          sliceHeight
        );

        const pageImgData = pageCanvas.toDataURL("image/png");
        const pageImgHeightMm = sliceHeight / pxPerMm;

        if (pageNumber > 0) {
          pdf.addPage();
        }

        pdf.addImage(pageImgData, "PNG", 0, 0, A4_WIDTH_MM, pageImgHeightMm);

        sourceY += sliceHeight;
        remainingHeight -= sliceHeight;
        pageNumber++;
      }

      pdf.save(`${resume.title || "resume"}.pdf`);

      toast({
        title: "Success",
        description: `PDF exported (${pageNumber} page${
          pageNumber > 1 ? "s" : ""
        })`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export PDF",
        variant: "destructive",
      });
    }
  };

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
                      if (file)
                        handleParseResume(
                          file,
                          selectedTemplate,
                          resume.theme?.primaryColor
                        );
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
        <div
          className="border-r bg-background overflow-auto"
          style={{ width: isPreviewCollapsed ? "100%" : `${formWidth}px` }}
        >
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

        {!isPreviewCollapsed && (
          <div
            onMouseDown={startResizing}
            className="w-1.5 hover:w-2 bg-transparent hover:bg-primary/30 cursor-col-resize transition-all z-10"
          />
        )}

        <div
          className={cn(
            "h-full bg-muted/30 overflow-y-auto transition-all duration-300 ease-in-out",
            isPreviewCollapsed ? "w-0 opacity-0 invisible" : "flex-1"
          )}
        >
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
