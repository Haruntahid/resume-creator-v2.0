"use client";

import React, { useState } from "react";
import { Resume } from "@/lib/types/resume";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Sparkles, Sliders, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { aiApi } from "@/lib/api";

interface ATSPanelProps {
  resume: Resume;
  onChange: (updates: any) => void;
  idToken: string | null;
}

export default function ATSPanel({ resume, onChange, idToken }: ATSPanelProps) {
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(true);
  const [jobDescription, setJobDescription] = useState("");
  const [tailoring, setTailoring] = useState(false);

  const { content } = resume;
  const { personalInfo = {} as any, summary = "", experience = [], skills = [] } = content || {};

  // 1. Calculate Score
  let score = 0;
  const checklist = [];

  // Contact Info (20 pts)
  let contactScore = 0;
  if (personalInfo.email) contactScore += 5;
  if (personalInfo.phone) contactScore += 5;
  if (personalInfo.location) contactScore += 5;
  if (personalInfo.linkedin) contactScore += 5;
  score += contactScore;

  checklist.push({
    name: "Email and Phone details included",
    met: !!(personalInfo.email && personalInfo.phone),
    desc: "Helps recruiters contact you immediately.",
  });

  checklist.push({
    name: "LinkedIn profile added",
    met: !!personalInfo.linkedin,
    desc: "87% of recruiters research candidates on LinkedIn.",
  });

  // Summary (15 pts)
  const summaryLength = summary ? summary.length : 0;
  if (summaryLength > 50) score += 15;
  checklist.push({
    name: "Professional summary (> 50 chars)",
    met: summaryLength > 50,
    desc: "Gives a quick summary of your career accomplishments.",
  });

  // Experience (25 pts)
  let experienceScore = 0;
  if (experience.length > 0) experienceScore += 15;
  if (experience.length >= 2) experienceScore += 10;
  score += experienceScore;

  // Bullet metrics & action verbs (15 pts)
  const allBullets = experience.flatMap((exp: any) => exp.bullets || []);
  const hasBullets = allBullets.length > 0;
  const hasNumbers = allBullets.some((b: string) => /\b\d+(%|\+)?\b/.test(b)); // Check for percentages or numbers
  
  if (hasBullets) score += 5;
  if (hasNumbers) score += 10;

  checklist.push({
    name: "Work experiences listed (at least 2)",
    met: experience.length >= 2,
    desc: "Provides a history of your job responsibilities.",
  });

  checklist.push({
    name: "Quantified bullet points (use numbers/%)",
    met: hasNumbers,
    desc: "Shows impact instead of tasks (e.g., 'Boosted sales by 20%').",
  });

  // Skills (25 pts)
  let skillsScore = 0;
  if (skills.length >= 5) skillsScore += 15;
  if (skills.length >= 10) skillsScore += 10;
  score += skillsScore;

  checklist.push({
    name: "Includes 8+ key skills",
    met: skills.length >= 8,
    desc: "Helps match core keywords to bypass automated filters.",
  });

  // 2. Tailor Resume Summary and Skills
  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Pasted Text Required",
        description: "Please enter a target job description.",
        variant: "destructive",
      });
      return;
    }
    if (!idToken) return;

    try {
      setTailoring(true);
      toast({
        title: "Tailoring Resume",
        description: "Analyzing keywords and adjusting summary...",
      });

      const res = await aiApi.tailorResume(
        jobDescription,
        resume.content.summary,
        resume.content.skills,
        idToken
      );

      // Extract skills to suggest adding
      const newSkillsToHighlight = res.skillsToHighlight || [];

      // Update resume summary
      onChange({
        content: {
          ...resume.content,
          summary: res.summary,
        },
      });

      toast({
        title: "Resume Tailored Successfully",
        description: "AI updated your summary. Highlighted skills suggested below.",
      });

      // Suggest adding new skills that are missing
      const missingSkills = newSkillsToHighlight.filter(
        (sk: string) => !skills.includes(sk)
      );

      if (missingSkills.length > 0) {
        toast({
          title: "Suggested Skills Added",
          description: `Add missing key terms: ${missingSkills.join(", ")}`,
        });
      }
    } catch (e: any) {
      toast({
        title: "Tailoring Failed",
        description: e.message || "Failed to tailor resume.",
        variant: "destructive",
      });
    } finally {
      setTailoring(false);
    }
  };

  return (
    <div className="border-t bg-slate-900 text-white shadow-2xl transition-all duration-300">
      {/* Panel Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/80 select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          {/* Visual Circular Score */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-500 font-bold text-xs text-indigo-400">
            {score}%
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">ATS Resume Optimization Score</h3>
            <p className="text-[10px] text-gray-400">
              {score >= 80 ? "Excellent ATS Readiness!" : "Needs few improvements to pass filter."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {score < 80 && (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
              Check actions
            </span>
          )}
          {collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Panel Expandable Body */}
      {!collapsed && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 border-t border-slate-800 max-h-[350px] overflow-y-auto">
          {/* Checklist Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              Recommendations Checklist
            </h4>
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-2 rounded bg-slate-900/60 border border-slate-850">
                  {item.met ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-xs font-semibold ${item.met ? "text-gray-200" : "text-amber-300"}`}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Tailoring Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Tailor to Job Description
            </h4>
            <div className="space-y-2.5">
              <Label className="text-[10px] text-gray-500">
                Paste job requirements to rewrite resume summary and identify missing keywords automatically.
              </Label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={4}
                className="bg-slate-900 border-slate-800 text-white text-xs placeholder:text-gray-600 focus-visible:ring-indigo-500"
              />
              <Button
                onClick={handleTailorResume}
                disabled={tailoring}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {tailoring ? "Analyzing & Tailoring..." : "Tailor Summary & Match Skills"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
