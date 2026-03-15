"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { resumeApi } from "@/lib/api";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { useToast } from "@/components/ui/use-toast";

export default function ResumePage() {
  const params = useParams();
  const router = useRouter();
  const { idToken } = useAuth();
  const { toast } = useToast();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idToken && params.id && params.id !== "new") {
      loadResume();
    } else if (params.id === "new") {
      setResume({
        title: "Untitled Resume",
        template: "modern",
        theme: {
          primaryColor: "#3b82f6",
          font: "inter",
        },
        personalInfo: {},
        summary: "",
        experience: [],
        education: [],
        skills: [],
        sections: [],
      });
      setLoading(false);
    }
  }, [idToken, params.id]);

  const loadResume = async () => {
    try {
      const data = await resumeApi.getById(params.id as string, idToken!);
      setResume(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load resume",
        variant: "destructive",
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  return <ResumeBuilder resume={resume} resumeId={params.id as string} />;
}

