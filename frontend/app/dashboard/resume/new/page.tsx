"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ResumeBuilder from "@/components/resume/ResumeBuilder";

export default function NewResumePage() {
  const router = useRouter();
  const { idToken, loading } = useAuth();
  const [resume, setResume] = useState({
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!idToken) {
    router.push("/");
    return null;
  }

  return <ResumeBuilder resume={resume} resumeId="new" />;
}

