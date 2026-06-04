"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  GripVertical,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PlusCircle,
  Wand2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSortable } from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { aiApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface ResumeFormProps {
  resume: any;
  onChange: (updates: any) => void;
  idToken: string | null;
}

interface SortableSectionProps {
  id: string;
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function SortableSection({
  id,
  title,
  isExpanded,
  onToggle,
  children,
}: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-xl bg-white shadow-sm overflow-hidden border-gray-200 transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="font-bold text-gray-800 text-sm hover:text-indigo-600 transition-all text-left"
          >
            {title}
          </button>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-all"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
      {isExpanded && <div className="p-4 space-y-4 bg-white">{children}</div>}
    </div>
  );
}

export default function ResumeForm({ resume, onChange, idToken }: ResumeFormProps) {
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personalInfo: true,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
    languages: false,
    customSections: false,
  });

  const [aiSummaryDialogOpen, setAiSummaryDialogOpen] = useState(false);
  const [aiSummaryTitle, setAiSummaryTitle] = useState("");
  const [aiSummaryExp, setAiSummaryExp] = useState("");
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [suggestSkillsLoading, setSuggestSkillsLoading] = useState(false);

  const [newSkillText, setNewSkillText] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      content: {
        ...resume.content,
        personalInfo: {
          ...resume.content.personalInfo,
          [field]: value,
        },
      },
    });
  };

  // Section Order Drag-and-Drop Reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = resume.sectionOrder.indexOf(active.id as string);
      const newIndex = resume.sectionOrder.indexOf(over.id as string);
      const updatedOrder = arrayMove(resume.sectionOrder, oldIndex, newIndex);
      onChange({ sectionOrder: updatedOrder });
      toast({
        title: "Layout Updated",
        description: "Section rendering order saved.",
      });
    }
  };

  // AI Professional Summary Generator
  const handleGenerateSummary = async () => {
    if (!aiSummaryTitle) {
      toast({
        title: "Required Field",
        description: "Please enter a job title.",
        variant: "destructive",
      });
      return;
    }
    if (!idToken) return;

    try {
      setAiSummaryLoading(true);
      const res = await aiApi.generateSummary(
        aiSummaryTitle,
        aiSummaryExp,
        resume.content.skills || [],
        idToken
      );
      onChange({
        content: {
          ...resume.content,
          summary: res.summary,
        },
      });
      setAiSummaryDialogOpen(false);
      toast({
        title: "Summary Generated",
        description: "AI summary has been added to your profile.",
      });
    } catch (e: any) {
      toast({
        title: "AI Generation Failed",
        description: e.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setAiSummaryLoading(false);
    }
  };

  // AI Smart Skills Suggester
  const triggerSkillsSuggestion = async () => {
    const title =
      resume.content.personalInfo?.headline ||
      (resume.content.experience?.[0]?.position) ||
      "Software Engineer";
    if (!idToken) return;

    try {
      setSuggestSkillsLoading(true);
      const res = await aiApi.suggestSkills(title, idToken);
      setSuggestedSkills(res.skills || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSuggestSkillsLoading(false);
    }
  };

  // AI Bullet Point Enhancer
  const handleEnhanceBullet = async (expIndex: number, bulletIndex: number) => {
    const currentBullet = resume.content.experience[expIndex].bullets[bulletIndex];
    if (!currentBullet.trim()) {
      toast({
        title: "Empty Bullet",
        description: "Write some text first before enhancing.",
        variant: "destructive",
      });
      return;
    }
    if (!idToken) return;

    try {
      toast({
        title: "Enhancing Bullet",
        description: "AI is rewriting your bullet point...",
      });
      const title = resume.content.experience[expIndex].position || "Professional";
      const res = await aiApi.enhanceBullet(currentBullet, title, idToken);
      
      const newExperience = [...(resume.content.experience || [])];
      newExperience[expIndex].bullets[bulletIndex] = res.enhanced;
      onChange({
        content: {
          ...resume.content,
          experience: newExperience,
        },
      });
      toast({
        title: "Bullet Enhanced",
        description: "Successfully polished the bullet point.",
      });
    } catch (e: any) {
      toast({
        title: "Failed to Enhance",
        description: e.message || "Failed to call AI service.",
        variant: "destructive",
      });
    }
  };

  // Work Experience CRUD
  const handleAddExperience = () => {
    onChange({
      content: {
        ...resume.content,
        experience: [
          ...(resume.content.experience || []),
          {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            bullets: [""],
          },
        ],
      },
    });
  };

  const handleUpdateExperience = (index: number, updates: any) => {
    const newExperience = [...(resume.content.experience || [])];
    newExperience[index] = { ...newExperience[index], ...updates };
    onChange({ content: { ...resume.content, experience: newExperience } });
  };

  const handleDeleteExperience = (index: number) => {
    const newExperience = [...(resume.content.experience || [])];
    newExperience.splice(index, 1);
    onChange({ content: { ...resume.content, experience: newExperience } });
  };

  const handleAddBullet = (expIndex: number) => {
    const newExperience = [...(resume.content.experience || [])];
    newExperience[expIndex].bullets = [
      ...(newExperience[expIndex].bullets || []),
      "",
    ];
    onChange({ content: { ...resume.content, experience: newExperience } });
  };

  const handleUpdateBullet = (
    expIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    const newExperience = [...(resume.content.experience || [])];
    newExperience[expIndex].bullets[bulletIndex] = value;
    onChange({ content: { ...resume.content, experience: newExperience } });
  };

  const handleDeleteBullet = (expIndex: number, bulletIndex: number) => {
    const newExperience = [...(resume.content.experience || [])];
    newExperience[expIndex].bullets.splice(bulletIndex, 1);
    onChange({ content: { ...resume.content, experience: newExperience } });
  };

  // Education CRUD
  const handleAddEducation = () => {
    onChange({
      content: {
        ...resume.content,
        education: [
          ...(resume.content.education || []),
          {
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
            current: false,
            gpa: "",
          },
        ],
      },
    });
  };

  const handleUpdateEducation = (index: number, updates: any) => {
    const newEducation = [...(resume.content.education || [])];
    newEducation[index] = { ...newEducation[index], ...updates };
    onChange({ content: { ...resume.content, education: newEducation } });
  };

  const handleDeleteEducation = (index: number) => {
    const newEducation = [...(resume.content.education || [])];
    newEducation.splice(index, 1);
    onChange({ content: { ...resume.content, education: newEducation } });
  };

  // Skills CRUD
  const handleAddSkill = (skill: string) => {
    const s = skill.trim();
    if (!s || (resume.content.skills || []).includes(s)) return;
    onChange({
      content: {
        ...resume.content,
        skills: [...(resume.content.skills || []), s],
      },
    });
  };

  const handleDeleteSkill = (index: number) => {
    const newSkills = [...(resume.content.skills || [])];
    newSkills.splice(index, 1);
    onChange({ content: { ...resume.content, skills: newSkills } });
  };

  // Projects CRUD
  const handleAddProject = () => {
    onChange({
      content: {
        ...resume.content,
        projects: [
          ...(resume.content.projects || []),
          {
            title: "",
            description: "",
            techStack: [],
            url: "",
          },
        ],
      },
    });
  };

  const handleUpdateProject = (index: number, updates: any) => {
    const list = [...(resume.content.projects || [])];
    list[index] = { ...list[index], ...updates };
    onChange({ content: { ...resume.content, projects: list } });
  };

  const handleDeleteProject = (index: number) => {
    const list = [...(resume.content.projects || [])];
    list.splice(index, 1);
    onChange({ content: { ...resume.content, projects: list } });
  };

  // Certifications CRUD
  const handleAddCertification = () => {
    onChange({
      content: {
        ...resume.content,
        certifications: [
          ...(resume.content.certifications || []),
          {
            name: "",
            issuer: "",
            date: "",
          },
        ],
      },
    });
  };

  const handleUpdateCertification = (index: number, updates: any) => {
    const list = [...(resume.content.certifications || [])];
    list[index] = { ...list[index], ...updates };
    onChange({ content: { ...resume.content, certifications: list } });
  };

  const handleDeleteCertification = (index: number) => {
    const list = [...(resume.content.certifications || [])];
    list.splice(index, 1);
    onChange({ content: { ...resume.content, certifications: list } });
  };

  // Languages CRUD
  const handleAddLanguage = () => {
    onChange({
      content: {
        ...resume.content,
        languages: [
          ...(resume.content.languages || []),
          {
            language: "",
            level: "Full Professional",
          },
        ],
      },
    });
  };

  const handleUpdateLanguage = (index: number, updates: any) => {
    const list = [...(resume.content.languages || [])];
    list[index] = { ...list[index], ...updates };
    onChange({ content: { ...resume.content, languages: list } });
  };

  const handleDeleteLanguage = (index: number) => {
    const list = [...(resume.content.languages || [])];
    list.splice(index, 1);
    onChange({ content: { ...resume.content, languages: list } });
  };

  // Custom Sections CRUD
  const handleAddCustomSection = () => {
    onChange({
      content: {
        ...resume.content,
        customSections: [
          ...(resume.content.customSections || []),
          {
            name: "Custom Section",
            items: [
              {
                title: "",
                subtitle: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
                bullets: [],
              },
            ],
          },
        ],
      },
    });
  };

  const handleUpdateCustomSection = (index: number, updates: any) => {
    const list = [...(resume.content.customSections || [])];
    list[index] = { ...list[index], ...updates };
    onChange({ content: { ...resume.content, customSections: list } });
  };

  const handleDeleteCustomSection = (index: number) => {
    const list = [...(resume.content.customSections || [])];
    list.splice(index, 1);
    onChange({ content: { ...resume.content, customSections: list } });
  };

  // Trigger skill suggestion on first open of skills section
  useEffect(() => {
    if (expandedSections.skills && suggestedSkills.length === 0) {
      triggerSkillsSuggestion();
    }
  }, [expandedSections.skills]);

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "personalInfo":
        const pi = resume.content?.personalInfo || {};
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700">Profile Photo (Max 1MB)</Label>
              <div className="flex items-center gap-4 mt-1">
                {pi.photoURL ? (
                  <img
                    src={pi.photoURL}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border text-[10px] text-gray-400">
                    No photo
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 1024 * 1024) {
                          toast({
                            title: "File too large",
                            description: "Max photo size is 1MB",
                            variant: "destructive",
                          });
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handlePersonalInfoChange("photoURL", event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:text-xs file:bg-gray-50 file:cursor-pointer w-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Full Name</Label>
                <Input
                  value={pi.name || ""}
                  onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                  placeholder="John Doe"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Professional Headline</Label>
                <Input
                  value={pi.headline || ""}
                  onChange={(e) => handlePersonalInfoChange("headline", e.target.value)}
                  placeholder="Senior Software Engineer"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Email Address</Label>
                <Input
                  type="email"
                  value={pi.email || ""}
                  onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Phone Number</Label>
                <Input
                  value={pi.phone || ""}
                  onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                  placeholder="+1 (123) 456-7890"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Location (City, Country)</Label>
                <Input
                  value={pi.location || ""}
                  onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                  placeholder="San Francisco, USA"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Personal Website</Label>
                <Input
                  value={pi.website || ""}
                  onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
                  placeholder="https://johndoe.com"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-500">LinkedIn Profile URL</Label>
              <Input
                value={pi.linkedin || ""}
                onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/johndoe"
                className="h-9 text-xs"
              />
            </div>
          </div>
        );

      case "summary":
        const summary = resume.content?.summary || "";
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-gray-500">
                Write a summary ({summary.length} characters)
              </Label>

              <Dialog open={aiSummaryDialogOpen} onOpenChange={setAiSummaryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                    <Sparkles className="h-3 w-3" />
                    AI Generate Summary
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>AI Summary Generator</DialogTitle>
                    <DialogDescription>
                      Fill in your role details. AI will compile a perfect summary based on your expertise.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 my-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Job Title</Label>
                      <Input
                        value={aiSummaryTitle}
                        onChange={(e) => setAiSummaryTitle(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Years of Experience</Label>
                      <Input
                        type="number"
                        value={aiSummaryExp}
                        onChange={(e) => setAiSummaryExp(e.target.value)}
                        placeholder="e.g. 5"
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setAiSummaryDialogOpen(false)} disabled={aiSummaryLoading}>
                      Cancel
                    </Button>
                    <Button onClick={handleGenerateSummary} disabled={aiSummaryLoading} className="bg-indigo-600 hover:bg-indigo-700">
                      {aiSummaryLoading ? "Generating..." : "Generate Summary"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Textarea
              value={summary}
              onChange={(e) => onChange({ content: { ...resume.content, summary: e.target.value } })}
              rows={4}
              placeholder="E.g. Innovative software developer with 5+ years of experience designing and building high-performance web applications..."
              className="text-xs"
            />
          </div>
        );

      case "experience":
        const experiences = resume.content?.experience || [];
        return (
          <div className="space-y-4">
            {experiences.map((exp: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50/50 space-y-3 relative group">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-700">Job Record #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteExperience(index)}
                    className="h-6 w-6 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Job Title</Label>
                    <Input
                      value={exp.position || ""}
                      onChange={(e) => handleUpdateExperience(index, { position: e.target.value })}
                      placeholder="e.g. React Developer"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Company Name</Label>
                    <Input
                      value={exp.company || ""}
                      onChange={(e) => handleUpdateExperience(index, { company: e.target.value })}
                      placeholder="e.g. Google"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Start Date</Label>
                    <Input
                      value={exp.startDate || ""}
                      onChange={(e) => handleUpdateExperience(index, { startDate: e.target.value })}
                      placeholder="MM/YYYY"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">End Date</Label>
                    <Input
                      value={exp.endDate || ""}
                      onChange={(e) => handleUpdateExperience(index, { endDate: e.target.value })}
                      placeholder="MM/YYYY"
                      disabled={exp.current}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-exp-${index}`}
                    checked={exp.current || false}
                    onChange={(e) =>
                      handleUpdateExperience(index, {
                        current: e.target.checked,
                        endDate: e.target.checked ? "" : exp.endDate,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor={`current-exp-${index}`} className="text-xs cursor-pointer select-none">
                    Currently work here
                  </Label>
                </div>

                {/* Bullet points lists with AI Enhancer */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-600 block">Accomplishments & Duties</Label>
                  {(exp.bullets || []).map((bullet: string, bulletIdx: number) => (
                    <div key={bulletIdx} className="flex gap-2 items-start">
                      <Textarea
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(index, bulletIdx, e.target.value)}
                        placeholder="Describe what you did..."
                        rows={2}
                        className="text-xs flex-1"
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleEnhanceBullet(index, bulletIdx)}
                          title="Polish Bullet with AI"
                          className="h-7 w-7 text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                        >
                          <Wand2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBullet(index, bulletIdx)}
                          className="h-7 w-7 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBullet(index)}
                    className="w-full text-xs h-8 border-dashed"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Bullet Point
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={handleAddExperience} className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs h-9">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Experience Record
            </Button>
          </div>
        );

      case "education":
        const educations = resume.content?.education || [];
        return (
          <div className="space-y-4">
            {educations.map((edu: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50/50 space-y-3 relative">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-700">Education Record #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEducation(index)}
                    className="h-6 w-6 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Degree / Diploma</Label>
                    <Input
                      value={edu.degree || ""}
                      onChange={(e) => handleUpdateEducation(index, { degree: e.target.value })}
                      placeholder="e.g. Bachelor of Science"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Field of Study</Label>
                    <Input
                      value={edu.field || ""}
                      onChange={(e) => handleUpdateEducation(index, { field: e.target.value })}
                      placeholder="e.g. Computer Science"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">School / Institution</Label>
                    <Input
                      value={edu.institution || ""}
                      onChange={(e) => handleUpdateEducation(index, { institution: e.target.value })}
                      placeholder="e.g. Stanford University"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">GPA (Optional)</Label>
                    <Input
                      value={edu.gpa || ""}
                      onChange={(e) => handleUpdateEducation(index, { gpa: e.target.value })}
                      placeholder="e.g. 3.8/4.0"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Start Date</Label>
                    <Input
                      value={edu.startDate || ""}
                      onChange={(e) => handleUpdateEducation(index, { startDate: e.target.value })}
                      placeholder="MM/YYYY"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">End Date</Label>
                    <Input
                      value={edu.endDate || ""}
                      onChange={(e) => handleUpdateEducation(index, { endDate: e.target.value })}
                      placeholder="MM/YYYY"
                      disabled={edu.current}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-edu-${index}`}
                    checked={edu.current || false}
                    onChange={(e) =>
                      handleUpdateEducation(index, {
                        current: e.target.checked,
                        endDate: e.target.checked ? "" : edu.endDate,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor={`current-edu-${index}`} className="text-xs cursor-pointer select-none">
                    Currently study here
                  </Label>
                </div>
              </div>
            ))}
            <Button onClick={handleAddEducation} className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs h-9">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education Record
            </Button>
          </div>
        );

      case "skills":
        const skills = resume.content?.skills || [];
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkillText}
                onChange={(e) => setNewSkillText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(newSkillText);
                    setNewSkillText("");
                  }
                }}
                placeholder="Add skill (press Enter)..."
                className="text-xs h-9 flex-1"
              />
              <Button
                type="button"
                onClick={() => {
                  handleAddSkill(newSkillText);
                  setNewSkillText("");
                }}
                className="h-9 text-xs"
              >
                Add
              </Button>
            </div>

            {/* List of active skills */}
            <div className="flex flex-wrap gap-1.5 min-h-[30px]">
              {skills.map((skill: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 pl-2.5 pr-1 py-0.5 rounded-full text-xs font-semibold"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(index)}
                    className="p-0.5 rounded-full hover:bg-indigo-200 transition-colors text-indigo-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* AI Suggested skills */}
            <div className="bg-indigo-50/40 rounded-xl p-3 border border-indigo-50/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-indigo-800 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  AI Suggested Skills
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={triggerSkillsSuggestion}
                  className="h-6 text-[10px] text-indigo-600 hover:bg-indigo-100"
                  disabled={suggestSkillsLoading}
                >
                  {suggestSkillsLoading ? "Loading..." : "Refresh Suggestions"}
                </Button>
              </div>

              {suggestedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {suggestedSkills
                    .filter((s) => !skills.includes(s))
                    .map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="text-[10px] bg-white border hover:bg-indigo-50 hover:border-indigo-300 px-2 py-0.5 rounded transition-all text-gray-600 font-medium"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              ) : (
                <span className="text-[10px] text-gray-400">
                  {suggestSkillsLoading ? "Generating..." : "No suggestions found based on headline."}
                </span>
              )}
            </div>
          </div>
        );

      case "projects":
        const projects = resume.content?.projects || [];
        return (
          <div className="space-y-4">
            {projects.map((proj: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50/50 space-y-3 relative">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-700">Project #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProject(index)}
                    className="h-6 w-6 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Project Title</Label>
                    <Input
                      value={proj.title || ""}
                      onChange={(e) => handleUpdateProject(index, { title: e.target.value })}
                      placeholder="e.g. Portfolio Website"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Project URL / Link</Label>
                    <Input
                      value={proj.url || ""}
                      onChange={(e) => handleUpdateProject(index, { url: e.target.value })}
                      placeholder="e.g. https://myportfolio.com"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Tech Stack (comma separated)</Label>
                  <Input
                    value={proj.techStack ? proj.techStack.join(", ") : ""}
                    onChange={(e) =>
                      handleUpdateProject(index, {
                        techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. React, Tailwind CSS, TypeScript"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Project Description</Label>
                  <Textarea
                    value={proj.description || ""}
                    onChange={(e) => handleUpdateProject(index, { description: e.target.value })}
                    placeholder="Brief description of the project achievements..."
                    rows={2}
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
            <Button onClick={handleAddProject} className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs h-9">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        );

      case "certifications":
        const certs = resume.content?.certifications || [];
        return (
          <div className="space-y-4">
            {certs.map((cert: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50/50 space-y-3 relative">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-700">Certificate #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCertification(index)}
                    className="h-6 w-6 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Certificate Name</Label>
                    <Input
                      value={cert.name || ""}
                      onChange={(e) => handleUpdateCertification(index, { name: e.target.value })}
                      placeholder="AWS Certified Solutions Architect"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Issuer / Organization</Label>
                    <Input
                      value={cert.issuer || ""}
                      onChange={(e) => handleUpdateCertification(index, { issuer: e.target.value })}
                      placeholder="Amazon Web Services"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Date Achieved</Label>
                  <Input
                    value={cert.date || ""}
                    onChange={(e) => handleUpdateCertification(index, { date: e.target.value })}
                    placeholder="MM/YYYY or 2023"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            ))}
            <Button onClick={handleAddCertification} className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs h-9">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        );

      case "languages":
        const languages = resume.content?.languages || [];
        return (
          <div className="space-y-4">
            {languages.map((lang: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50/50 space-y-3 relative">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-700">Language #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteLanguage(index)}
                    className="h-6 w-6 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Language</Label>
                    <Input
                      value={lang.language || ""}
                      onChange={(e) => handleUpdateLanguage(index, { language: e.target.value })}
                      placeholder="e.g. English"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Fluency Level</Label>
                    <select
                      value={lang.level || "Native"}
                      onChange={(e) => handleUpdateLanguage(index, { level: e.target.value })}
                      className="w-full text-xs border rounded h-8 bg-white px-2"
                    >
                      <option value="Native">Native</option>
                      <option value="Full Professional">Full Professional</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Elementary">Elementary</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={handleAddLanguage} className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs h-9">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          </div>
        );

      case "customSections":
        const customs = resume.content?.customSections || [];
        return (
          <div className="space-y-4">
            {customs.map((sec: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50/50 space-y-3 relative">
                <div className="flex justify-between items-center">
                  <div className="space-y-1 flex-1 mr-2">
                    <Label className="text-[10px] text-gray-400 font-bold uppercase">Section Title</Label>
                    <Input
                      value={sec.name || ""}
                      onChange={(e) => handleUpdateCustomSection(index, { name: e.target.value })}
                      placeholder="e.g. Awards, Publications"
                      className="h-8 text-xs font-bold"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCustomSection(index)}
                    className="h-6 w-6 text-red-500 hover:bg-red-50 self-end mb-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Subitems under this custom section */}
                <div className="space-y-3">
                  {(sec.items || []).map((item: any, itemIdx: number) => (
                    <div key={itemIdx} className="border-t pt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Title</Label>
                          <Input
                            value={item.title || ""}
                            onChange={(e) => {
                              const newItems = [...sec.items];
                              newItems[itemIdx] = { ...newItems[itemIdx], title: e.target.value };
                              handleUpdateCustomSection(index, { items: newItems });
                            }}
                            placeholder="e.g. Outstanding Award"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Subtitle / Role</Label>
                          <Input
                            value={item.subtitle || ""}
                            onChange={(e) => {
                              const newItems = [...sec.items];
                              newItems[itemIdx] = { ...newItems[itemIdx], subtitle: e.target.value };
                              handleUpdateCustomSection(index, { items: newItems });
                            }}
                            placeholder="e.g. NASA"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Description</Label>
                        <Textarea
                          value={item.description || ""}
                          onChange={(e) => {
                            const newItems = [...sec.items];
                            newItems[itemIdx] = { ...newItems[itemIdx], description: e.target.value };
                            handleUpdateCustomSection(index, { items: newItems });
                          }}
                          placeholder="Provide details..."
                          rows={2}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [
                        ...(sec.items || []),
                        {
                          title: "",
                          subtitle: "",
                          description: "",
                        },
                      ];
                      handleUpdateCustomSection(index, { items: newItems });
                    }}
                    className="w-full text-xs h-7 border-dashed"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Custom Sub-item
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={handleAddCustomSection} className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs h-9">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Custom Section
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const getSectionTitle = (id: string) => {
    switch (id) {
      case "personalInfo":
        return "Personal Info";
      case "summary":
        return "Professional Summary";
      case "experience":
        return "Work Experience";
      case "education":
        return "Education";
      case "skills":
        return "Skills";
      case "projects":
        return "Projects";
      case "certifications":
        return "Certifications";
      case "languages":
        return "Languages";
      case "customSections":
        return "Custom Sections";
      default:
        return id;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Fixed Personal Info section (placed above dnd since it's the anchor header) */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden border-gray-200">
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
          <span className="font-bold text-gray-800 text-sm">Personal Contact Info</span>
          <button
            type="button"
            onClick={() => toggleSection("personalInfo")}
            className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-all"
          >
            {expandedSections.personalInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        {expandedSections.personalInfo && (
          <div className="p-4 bg-white">
            {renderSectionContent("personalInfo")}
          </div>
        )}
      </div>

      {/* Sortable Context for all other sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={resume.sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {resume.sectionOrder.map((sectionId: string) => {
              if (sectionId === "personalInfo") return null; // rendered fixed above
              return (
                <SortableSection
                  key={sectionId}
                  id={sectionId}
                  title={getSectionTitle(sectionId)}
                  isExpanded={!!expandedSections[sectionId]}
                  onToggle={() => toggleSection(sectionId)}
                >
                  {renderSectionContent(sectionId)}
                </SortableSection>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
