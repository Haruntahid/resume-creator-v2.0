"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { templates } from "@/lib/templates";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

export default function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Template</span>
          <span className="sm:hidden">T</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose a Template</DialogTitle>
          <DialogDescription className="text-base">
            Select a professional template. Changes apply instantly to your preview.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {Object.entries(templates).map(([key, template]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                selectedTemplate === key 
                  ? "ring-2 ring-primary ring-offset-2 shadow-lg border-primary" 
                  : "hover:border-primary/50"
              }`}
              onClick={() => {
                onSelect(key);
              }}
            >
              <CardContent className="p-4">
                <div className="aspect-[8.5/11] bg-white border-2 rounded-lg mb-3 overflow-hidden shadow-sm relative">
                  {/* Template Preview with Dummy Data */}
                  <div className="p-4 h-full flex flex-col" style={{ fontSize: '8px' }}>
                    {/* Header Section */}
                    <div 
                      className="h-3 mb-3 rounded-sm"
                      style={{ 
                        backgroundColor: selectedTemplate === key ? '#3b82f6' : '#60a5fa' 
                      }}
                    ></div>
                    
                    {/* Name and Title */}
                    <div className="mb-2">
                      <div className="font-bold text-xs mb-1" style={{ fontSize: '10px' }}>John Doe</div>
                      <div className="text-xs text-gray-600" style={{ fontSize: '8px' }}>Software Engineer</div>
                      <div className="text-xs text-gray-500 mt-1" style={{ fontSize: '7px' }}>john.doe@email.com | +1 (555) 123-4567</div>
                    </div>
                    
                    {/* Divider */}
                    <div className="h-px bg-gray-300 my-2"></div>
                    
                    {/* Experience Section */}
                    <div className="mb-2">
                      <div className="font-semibold text-xs mb-1" style={{ fontSize: '8px' }}>EXPERIENCE</div>
                      <div className="space-y-1">
                        <div>
                          <div className="font-semibold" style={{ fontSize: '7px' }}>Senior Developer</div>
                          <div className="text-gray-600" style={{ fontSize: '6px' }}>Tech Corp • 2020 - Present</div>
                        </div>
                        <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                        <div className="h-0.5 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    
                    {/* Education Section */}
                    <div className="mb-2">
                      <div className="font-semibold text-xs mb-1" style={{ fontSize: '8px' }}>EDUCATION</div>
                      <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                      <div className="h-0.5 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    
                    {/* Skills Section */}
                    <div className="flex-1">
                      <div className="font-semibold text-xs mb-1" style={{ fontSize: '8px' }}>SKILLS</div>
                      <div className="flex flex-wrap gap-1">
                        <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
                        <div className="h-1.5 w-10 bg-gray-300 rounded"></div>
                        <div className="h-1.5 w-7 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected Badge */}
                  {selectedTemplate === key && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Selected
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </div>
                  {selectedTemplate === key && (
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

