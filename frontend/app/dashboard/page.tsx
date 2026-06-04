"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { resumeApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, Edit, Copy, Upload, Sparkles, LayoutGrid, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { templateList } from "@/lib/templates";

interface Resume {
  _id: string;
  name?: string;
  title?: string;
  templateId?: string;
  template?: string;
  updatedAt: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { idToken } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  // New Resume Creation State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState("My Resume");
  const [selectedTemplateId, setSelectedTemplateId] = useState("classic-clear");

  useEffect(() => {
    if (idToken) {
      loadResumes();
    }
  }, [idToken]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("create") === "true") {
        const tpl = params.get("template");
        if (tpl) {
          setSelectedTemplateId(tpl);
        }
        setCreateDialogOpen(true);
        window.history.replaceState(null, "", "/dashboard");
      }
    }
  }, []);

  const loadResumes = async () => {
    try {
      const data = await resumeApi.getAll(idToken!);
      setResumes(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load resumes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await resumeApi.delete(id, idToken!);
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
      loadResumes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete resume",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (existingResume: Resume) => {
    try {
      toast({
        title: "Duplicating",
        description: "Cloning resume layout...",
      });

      // Get the full resume data to duplicate completely
      const fullResume = await resumeApi.getById(existingResume._id, idToken!);
      const { _id, __v, createdAt, updatedAt, userId, ...clean } = fullResume;

      clean.name = `${clean.name || clean.title || "Resume"} (Copy)`;

      await resumeApi.create(clean, idToken!);
      toast({
        title: "Success",
        description: "Resume duplicated successfully",
      });
      loadResumes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to duplicate resume",
        variant: "destructive",
      });
    }
  };

  const handleCreateConfirm = async () => {
    if (!newResumeTitle.trim()) {
      toast({
        title: "Required Title",
        description: "Please name your resume to start.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { getDefaultResume } = require("@/lib/templates");
      const defaultData = getDefaultResume(selectedTemplateId, newResumeTitle);

      const created = await resumeApi.create(defaultData, idToken!);
      setCreateDialogOpen(false);
      toast({
        title: "Created Resume",
        description: "Redirecting to your editing board...",
      });
      router.push(`/dashboard/resume/${created._id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create resume",
        variant: "destructive",
      });
    }
  };

  const handleUploadPdf = async (file: File) => {
    if (!idToken) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      toast({
        title: "Uploading PDF",
        description: "AI is parsing your resume...",
      });

      const result = await resumeApi.uploadPdf(formData, idToken);
      
      toast({
        title: "Success",
        description: "Resume created from PDF! Redirecting...",
      });

      router.push(`/dashboard/resume/${result.resume._id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload and parse PDF",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Resumes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build, clone, and manage your FlowCV-style professional resumes.
          </p>
        </div>
        <div className="flex gap-3">
          {/* AI Parser Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 h-10 border-slate-200 hover:bg-slate-50">
                <Upload className="h-4 w-4 text-slate-500" />
                Upload PDF
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-bold text-lg">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  Upload & Import PDF
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Upload an existing resume PDF. Our AI parses and maps sections directly into your dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="pdf-upload" className="text-xs font-semibold text-gray-600">Select PDF File</Label>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadPdf(file);
                    }}
                    className="mt-2 text-xs"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* New Resume Layout Selector Modal */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-10 shadow">
                <Plus className="h-5 w-5" />
                Create New Resume
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Select Starting Preset</DialogTitle>
                <DialogDescription>
                  Enter a resume title and select a design template layout to configure your canvas.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">Resume Name</Label>
                  <Input
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    placeholder="e.g. Software Engineer Resume"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold text-gray-700">Select Preset Layout</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {templateList.map((tpl) => (
                      <div
                        key={tpl.id}
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        className={`cursor-pointer rounded-xl border p-3 flex flex-col justify-between aspect-[1/1.3] transition-all relative ${
                          selectedTemplateId === tpl.id
                            ? "border-indigo-600 ring-2 ring-indigo-600/20 bg-indigo-50/10 shadow-sm"
                            : "border-gray-200 hover:border-indigo-400 bg-white"
                        }`}
                      >
                        {/* Miniature layout block representation */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="h-3 rounded-sm w-3/4" style={{ backgroundColor: tpl.colors.primary }} />
                          <div className="flex gap-1.5 my-2 flex-1 items-stretch">
                            {tpl.layout === "two-column-left" && (
                              <div className="w-1/3 rounded-sm bg-slate-200" />
                            )}
                            <div className="flex-1 space-y-1 bg-slate-100 p-1 rounded-sm">
                              <div className="h-0.5 bg-gray-300 w-full" />
                              <div className="h-0.5 bg-gray-300 w-full" />
                            </div>
                            {tpl.layout === "two-column-right" && (
                              <div className="w-1/3 rounded-sm bg-slate-200" />
                            )}
                          </div>
                        </div>

                        <div className="border-t pt-2 mt-1">
                          <p className="text-xs font-bold text-gray-800 truncate">{tpl.name}</p>
                          <span className="text-[9px] text-gray-400 capitalize">{tpl.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConfirm} className="bg-indigo-600 hover:bg-indigo-700">
                  Create Resume
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Grid */}
      {resumes.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-2 max-w-lg mx-auto">
          <CardContent className="space-y-4 pt-6">
            <LayoutGrid className="h-16 w-16 mx-auto text-slate-300" />
            <div>
              <h3 className="text-xl font-bold text-slate-800">No Resumes Yet</h3>
              <p className="text-sm text-slate-500 mb-6 mt-1">
                Create a professional, modern resume using our premium presets or import an existing PDF.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Build Your First Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => {
              const templateName = templateList.find((t) => t.id === (resume.templateId || resume.template))?.name || "Classic Clear";
              return (
                <Card 
                  key={resume._id} 
                  className="hover:shadow-2xl transition-all duration-300 border-gray-200 group overflow-hidden bg-white hover:-translate-y-1 relative"
                >
                  <CardHeader className="pb-3 bg-slate-50/50 border-b">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-extrabold truncate text-slate-800 max-w-[200px]">
                        {resume.name || resume.title}
                      </CardTitle>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                        {templateName}
                      </span>
                    </div>
                    <CardDescription className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        Updated{" "}
                        {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {/* Visual Placeholder for Card Previews */}
                    <div className="h-28 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed group-hover:border-indigo-200 transition-colors">
                      <div className="text-center space-y-1">
                        <FileText className="h-8 w-8 mx-auto text-slate-300 group-hover:text-indigo-400 transition-colors" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Layout Preview</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-8">
                        <Link href={`/dashboard/resume/${resume._id}`}>
                          <Edit className="mr-1.5 h-3.5 w-3.5" />
                          Edit Resume
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDuplicate(resume)}
                        className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100"
                        title="Duplicate Resume"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(resume._id)}
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                        title="Delete Resume"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
