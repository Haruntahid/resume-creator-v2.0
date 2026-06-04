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
import { Palette, Check } from "lucide-react";
import { templateList } from "@/lib/templates";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

export default function TemplateSelector({
  selectedTemplate,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Choose Template</span>
          <span className="sm:hidden">Template</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-gray-900">
            Select a Design Preset
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Select a professional resume template. Layout, spacing, and styles adjust instantly.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {templateList.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;
            return (
              <Card
                key={tpl.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group overflow-hidden border ${
                  isSelected
                    ? "ring-2 ring-indigo-600 ring-offset-1 shadow-lg border-indigo-600"
                    : "hover:border-indigo-400 border-gray-200"
                }`}
                onClick={() => onSelect(tpl.id)}
              >
                <CardContent className="p-3">
                  {/* Decorative Mini Layout Sheet */}
                  <div className="aspect-[1/1.4] bg-slate-50 border rounded-lg mb-2 p-3 flex flex-col justify-between overflow-hidden relative shadow-inner">
                    {/* Header line */}
                    <div className="space-y-1.5">
                      <div
                        className="h-2.5 rounded-sm w-3/4"
                        style={{ backgroundColor: tpl.colors.primary }}
                      />
                      <div className="h-1 bg-gray-300 rounded w-1/2" />
                    </div>

                    {/* Columns layout preview */}
                    <div className="flex gap-2 my-2 flex-1 items-stretch">
                      {tpl.layout === "two-column-left" && (
                        <div
                          className="w-1/3 rounded-sm p-1 flex flex-col gap-1"
                          style={{ backgroundColor: tpl.colors.accent + "40" }}
                        >
                          <div className="h-1 bg-gray-350 rounded w-full" />
                          <div className="h-1 bg-gray-350 rounded w-3/4" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1.5">
                        <div className="h-1 bg-gray-300 rounded w-full" />
                        <div className="h-1 bg-gray-300 rounded w-full" />
                        <div className="h-1 bg-gray-200 rounded w-4/5" />
                      </div>
                      {tpl.layout === "two-column-right" && (
                        <div
                          className="w-1/3 rounded-sm p-1 flex flex-col gap-1"
                          style={{ backgroundColor: tpl.colors.accent + "40" }}
                        >
                          <div className="h-1 bg-gray-350 rounded w-full" />
                          <div className="h-1 bg-gray-350 rounded w-3/4" />
                        </div>
                      )}
                    </div>

                    {/* Palette Circle Dot indicators */}
                    <div className="flex gap-1 items-center mt-2 border-t pt-1.5 justify-between">
                      <span className="text-[8px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1 rounded-sm">
                        ATS: {tpl.atsScore}%
                      </span>
                      <div className="flex gap-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: tpl.colors.primary }}
                        />
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: tpl.colors.accent }}
                        />
                      </div>
                    </div>

                    {/* Check badge overlay */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center backdrop-blur-[0.5px]">
                        <span className="bg-indigo-600 text-white rounded-full p-1.5 shadow">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Template Meta */}
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-gray-800 flex justify-between items-center">
                      <span>{tpl.name}</span>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[9px] text-gray-400 capitalize font-medium">
                        {tpl.category} Theme
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
