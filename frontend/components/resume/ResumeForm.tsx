"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ColorPicker } from "./ColorPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSortable } from "@dnd-kit/sortable";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ResumeFormProps {
  resume: any;
  onChange: (updates: any) => void;
  idToken: string | null;
}

function SortableItem({ id, children, onDelete }: { id: string; children: React.ReactNode; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2">
      <button
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <div className="flex-1">{children}</div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function ResumeForm({ resume, onChange, idToken }: ResumeFormProps) {
  const { toast } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  const handleAddExperience = () => {
    onChange({
      experience: [
        ...(resume.experience || []),
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          bullets: [],
        },
      ],
    });
  };

  const handleUpdateExperience = (index: number, updates: any) => {
    const newExperience = [...(resume.experience || [])];
    newExperience[index] = { ...newExperience[index], ...updates };
    onChange({ experience: newExperience });
  };

  const handleDeleteExperience = (index: number) => {
    const newExperience = [...(resume.experience || [])];
    newExperience.splice(index, 1);
    onChange({ experience: newExperience });
  };

  const handleAddBullet = (expIndex: number) => {
    const newExperience = [...(resume.experience || [])];
    newExperience[expIndex].bullets = [...(newExperience[expIndex].bullets || []), ""];
    onChange({ experience: newExperience });
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const newExperience = [...(resume.experience || [])];
    newExperience[expIndex].bullets[bulletIndex] = value;
    onChange({ experience: newExperience });
  };

  const handleDeleteBullet = (expIndex: number, bulletIndex: number) => {
    const newExperience = [...(resume.experience || [])];
    newExperience[expIndex].bullets.splice(bulletIndex, 1);
    onChange({ experience: newExperience });
  };


  const handleAddEducation = () => {
    onChange({
      education: [
        ...(resume.education || []),
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
    });
  };

  const handleUpdateEducation = (index: number, updates: any) => {
    const newEducation = [...(resume.education || [])];
    newEducation[index] = { ...newEducation[index], ...updates };
    onChange({ education: newEducation });
  };

  const handleDeleteEducation = (index: number) => {
    const newEducation = [...(resume.education || [])];
    newEducation.splice(index, 1);
    onChange({ education: newEducation });
  };

  const handleAddSkill = (skill: string) => {
    if (!skill.trim()) return;
    onChange({
      skills: [...(resume.skills || []), skill.trim()],
    });
  };

  const handleDeleteSkill = (index: number) => {
    const newSkills = [...(resume.skills || [])];
    newSkills.splice(index, 1);
    onChange({ skills: newSkills });
  };


  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = resume.experience.findIndex((exp: any) => exp._id === active.id || exp.company === active.id);
      const newIndex = resume.experience.findIndex((exp: any) => exp._id === over.id || exp.company === over.id);
      onChange({
        experience: arrayMove(resume.experience, oldIndex, newIndex),
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Primary Color</Label>
            <ColorPicker
              color={resume.theme?.primaryColor || "#3b82f6"}
              onChange={(color) => onChange({ theme: { ...resume.theme, primaryColor: color } })}
            />
          </div>
          <div>
            <Label>Font</Label>
            <Select
              value={resume.theme?.font || "inter"}
              onValueChange={(value) => onChange({ theme: { ...resume.theme, font: value } })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="open-sans">Open Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Profile Photo (Max 1MB)</Label>
            <div className="flex items-center gap-4">
              {resume.personalInfo?.photoURL ? (
                <img 
                  src={resume.personalInfo.photoURL} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-2"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2">
                  <span className="text-muted-foreground text-xs">No photo</span>
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 1 * 1024 * 1024) {
                        toast({
                          title: "Error",
                          description: "Image size must be less than 1MB",
                          variant: "destructive",
                        });
                        return;
                      }
                      // Convert to base64 for preview
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        handlePersonalInfoChange("photoURL", dataUrl);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or GIF (max 1MB)</p>
              </div>
            </div>
          </div>
          <div>
            <Label>Full Name</Label>
            <Input
              value={resume.personalInfo?.name || ""}
              onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={resume.personalInfo?.email || ""}
              onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={resume.personalInfo?.phone || ""}
              onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={resume.personalInfo?.location || ""}
              onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input
              value={resume.personalInfo?.website || ""}
              onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input
              value={resume.personalInfo?.linkedin || ""}
              onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
            />
          </div>
          <div>
            <Label>GitHub</Label>
            <Input
              value={resume.personalInfo?.github || ""}
              onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={resume.summary || ""}
            onChange={(e) => onChange({ summary: e.target.value })}
            rows={4}
            placeholder="Write a brief professional summary..."
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={resume.experience?.map((exp: any, i: number) => exp._id || i.toString()) || []}
              strategy={verticalListSortingStrategy}
            >
              {(resume.experience || []).map((exp: any, index: number) => (
                <SortableItem
                  key={exp._id || index}
                  id={exp._id || index.toString()}
                  onDelete={() => handleDeleteExperience(index)}
                >
                  <Card className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company || ""}
                          onChange={(e) => handleUpdateExperience(index, { company: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={exp.position || ""}
                          onChange={(e) => handleUpdateExperience(index, { position: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          value={exp.startDate || ""}
                          onChange={(e) => handleUpdateExperience(index, { startDate: e.target.value })}
                          placeholder="MM/YYYY"
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          value={exp.endDate || ""}
                          onChange={(e) => handleUpdateExperience(index, { endDate: e.target.value })}
                          placeholder="MM/YYYY or Present"
                          disabled={exp.current}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={exp.current || false}
                        onChange={(e) => handleUpdateExperience(index, { current: e.target.checked, endDate: e.target.checked ? "" : exp.endDate })}
                        className="rounded"
                      />
                      <Label htmlFor={`current-${index}`} className="cursor-pointer">
                        Currently working here
                      </Label>
                    </div>
                    <div>
                      <Label className="mb-2 block">Bullet Points</Label>
                      {(exp.bullets || []).map((bullet: string, bulletIndex: number) => (
                        <div key={bulletIndex} className="flex gap-2 mb-2">
                          <Textarea
                            value={bullet}
                            onChange={(e) => handleUpdateBullet(index, bulletIndex, e.target.value)}
                            rows={2}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteBullet(index, bulletIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBullet(index)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Bullet
                      </Button>
                    </div>
                  </Card>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
          <Button variant="outline" onClick={handleAddExperience} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(resume.education || []).map((edu: any, index: number) => (
            <Card key={index} className="p-4 space-y-3">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDeleteEducation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label>Institution</Label>
                <Input
                  value={edu.institution || ""}
                  onChange={(e) => handleUpdateEducation(index, { institution: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree || ""}
                    onChange={(e) => handleUpdateEducation(index, { degree: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Field</Label>
                  <Input
                    value={edu.field || ""}
                    onChange={(e) => handleUpdateEducation(index, { field: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    value={edu.startDate || ""}
                    onChange={(e) => handleUpdateEducation(index, { startDate: e.target.value })}
                    placeholder="MM/YYYY"
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    value={edu.endDate || ""}
                    onChange={(e) => handleUpdateEducation(index, { endDate: e.target.value })}
                    placeholder="MM/YYYY or Present"
                    disabled={edu.current}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`edu-current-${index}`}
                  checked={edu.current || false}
                  onChange={(e) => handleUpdateEducation(index, { current: e.target.checked, endDate: e.target.checked ? "" : edu.endDate })}
                  className="rounded"
                />
                <Label htmlFor={`edu-current-${index}`} className="cursor-pointer">
                  Currently studying
                </Label>
              </div>
              <div>
                <Label>GPA (Optional)</Label>
                <Input
                  value={edu.gpa || ""}
                  onChange={(e) => handleUpdateEducation(index, { gpa: e.target.value })}
                />
              </div>
            </Card>
          ))}
          <Button variant="outline" onClick={handleAddEducation} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SkillInput onAdd={handleAddSkill} />
          <div className="flex flex-wrap gap-2">
            {(resume.skills || []).map((skill: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                <span>{skill}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => handleDeleteSkill(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SkillInput({ onAdd }: { onAdd: (skill: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value);
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a skill..."
      />
      <Button type="submit" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}

