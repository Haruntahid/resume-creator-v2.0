"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { resumeApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, Edit, Upload, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface Resume {
  _id: string;
  title: string;
  template: string;
  updatedAt: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { idToken } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idToken) {
      loadResumes();
    }
  }, [idToken]);

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

  const handleCreateNew = () => {
    router.push("/dashboard/resume/new");
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

      // Navigate to the created resume
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
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your professional resumes
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Powered PDF Parser
                </DialogTitle>
                <DialogDescription>
                  Upload your existing resume PDF. AI will extract all information and create a new resume automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pdf-upload">Select PDF File</Label>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadPdf(file);
                      }
                    }}
                    className="mt-2"
                  />
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p className="font-medium mb-1">What happens:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>AI extracts all information from your PDF</li>
                    <li>A new resume is automatically created</li>
                    <li>You can edit, change template, and customize</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleCreateNew} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Button>
        </div>
      </div>

      {resumes.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent className="space-y-4">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first professional resume to get started
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Create Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Saved Resumes ({resumes.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card 
                key={resume._id} 
                className="hover:shadow-xl transition-all duration-200 border-2 hover:border-primary/50 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-bold truncate flex-1 pr-2">
                      {resume.title}
                    </CardTitle>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md whitespace-nowrap">
                      {resume.template}
                    </span>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    <span>Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-32 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20 group-hover:border-primary/30 transition-colors">
                    <div className="text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="text-xs text-muted-foreground">Resume Preview</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      asChild
                      className="flex-1"
                    >
                      <Link href={`/dashboard/resume/${resume._id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Resume
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(resume._id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

