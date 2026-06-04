"use client";

import React, { useState } from "react";
import { templateList } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Sparkles,
  Layers,
  Type,
  Grid,
  ExternalLink,
  CheckCircle2,
  Eye,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemplatesGalleryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", "modern", "classic", "creative", "minimal"];

  const filteredTemplates = templateList.filter((tpl) => {
    const matchesSearch = tpl.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || tpl.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (templateId: string) => {
    router.push(`/dashboard?create=true&template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header Panel */}
      <header className="bg-slate-900 dark:bg-slate-950 text-white py-14 px-6 text-center relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Live Structural Engine Enabled
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Choose Your Resume Design Blueprint
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
            Inspect structural layouts, typography weights, and customizable sub-elements beforehand to match your personal context.
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Filter and Search Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={`capitalize h-9 text-xs font-semibold rounded-xl ${activeCategory === cat
                    ? "bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white"
                    : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search features or themes..."
              className="pl-9 h-9 text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((tpl) => (
            <Card
              key={tpl.id}
              className="group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between rounded-2xl hover:shadow-xl dark:hover:shadow-indigo-950/20 transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-5 flex flex-col flex-1 gap-4">

                {/* Visual A4 Aspect Ratio sheet mock */}
                <div className="aspect-[1/1.38] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between overflow-hidden relative shadow-inner group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-colors">

                  {/* Miniature Top Section (Header) */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      {/* Name placeholder placeholder */}
                      <div
                        className="h-4 rounded-sm w-2/3"
                        style={{ backgroundColor: tpl.colors.primary }}
                      />
                      {/* Global Link Icon Indicator Mock */}
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded bg-gray-300 dark:bg-slate-700" />
                        <div className="w-2.5 h-2.5 rounded bg-gray-300 dark:bg-slate-700" />
                      </div>
                    </div>
                    {/* Professional Headline Mock */}
                    <div className="h-2 bg-indigo-400/40 rounded w-1/2" />
                    <div className="h-1 bg-gray-300 dark:bg-slate-800 rounded w-1/3" />
                  </div>

                  {/* Layout Columns mock preview */}
                  <div className="flex gap-4 my-4 flex-1 items-stretch overflow-hidden">
                    {/* Left Sidebar Layout Variant */}
                    {tpl.layout === "two-column-left" && (
                      <div
                        className="w-1/3 rounded-lg p-2 flex flex-col gap-2 border border-dashed border-indigo-200 dark:border-indigo-900/50"
                        style={{ backgroundColor: tpl.colors.accent + "15" }}
                      >
                        <div className="h-2 bg-gray-400 dark:bg-slate-600 rounded w-full" />
                        <div className="space-y-1">
                          <div className="h-1 bg-gray-300 dark:bg-slate-700 rounded w-11/12" />
                          <div className="h-1 bg-gray-300 dark:bg-slate-700 rounded w-4/5" />
                        </div>
                        <div className="h-2 bg-gray-400 dark:bg-slate-600 rounded w-5/6 mt-2" />
                        <div className="flex flex-wrap gap-0.5">
                          <span className="w-4 h-1.5 rounded-sm bg-gray-300 dark:bg-slate-700" />
                          <span className="w-5 h-1.5 rounded-sm bg-gray-300 dark:bg-slate-700" />
                          <span className="w-3 h-1.5 rounded-sm bg-gray-300 dark:bg-slate-700" />
                        </div>
                      </div>
                    )}

                    {/* Core Body Section (Experience, Projects, Custom Fields) */}
                    <div className="flex-1 space-y-3.5">
                      {/* Section Block 1 */}
                      <div className="space-y-1.5">
                        <div className="h-2.5 bg-gray-400 dark:bg-slate-600 rounded w-1/3" />
                        <div className="h-1.5 bg-gray-300 dark:bg-slate-700 rounded w-full" />
                        <div className="h-1.5 bg-gray-200 dark:bg-slate-800 rounded w-5/6" />
                      </div>

                      {/* Section Block 2: Bullet points or custom content mock */}
                      <div className="space-y-1.5">
                        <div className="h-2.5 bg-gray-400 dark:bg-slate-600 rounded w-1/2" />
                        <div className="flex items-center gap-1 pl-1">
                          <div className="w-1 h-1 rounded-full bg-indigo-500" />
                          <div className="h-1 bg-gray-300 dark:bg-slate-700 rounded w-11/12" />
                        </div>
                        <div className="flex items-center gap-1 pl-1">
                          <div className="w-1 h-1 rounded-full bg-indigo-500" />
                          <div className="h-1 bg-gray-300 dark:bg-slate-700 rounded w-4/5" />
                        </div>
                      </div>
                    </div>

                    {/* Right Sidebar Layout Variant */}
                    {tpl.layout === "two-column-right" && (
                      <div
                        className="w-1/3 rounded-lg p-2 flex flex-col gap-2 border border-dashed border-indigo-200 dark:border-indigo-900/50"
                        style={{ backgroundColor: tpl.colors.accent + "15" }}
                      >
                        <div className="h-2 bg-gray-400 dark:bg-slate-600 rounded w-full" />
                        <div className="space-y-1">
                          <div className="h-1 bg-gray-300 dark:bg-slate-700 rounded w-11/12" />
                          <div className="h-1 bg-gray-300 dark:bg-slate-700 rounded w-3/4" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ATS Counter & Theme Colors Indicators */}
                  <div className="flex gap-1 items-center mt-2 border-t border-slate-200 dark:border-slate-800 pt-3 justify-between">
                    <span className="text-[9px] uppercase font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 px-2 py-0.5 rounded-md">
                      ATS Match: {tpl.atsScore}%
                    </span>
                    <div className="flex gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                        style={{ backgroundColor: tpl.colors.primary }}
                        title="Primary Color Theme"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                        style={{ backgroundColor: tpl.colors.accent }}
                        title="Accent Tone"
                      />
                    </div>
                  </div>

                  {/* Absolute Trigger Panel on Hover */}
                  <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm p-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(tpl.id);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg gap-1.5 rounded-xl px-4 py-2"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Initialize Template
                    </Button>
                  </div>
                </div>

                {/* Comprehensive Blueprint Attributes Info Section */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tpl.name}
                      </h3>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 rounded px-1.5">
                        {tpl.layout.replace("-", " ")}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 capitalize mt-0.5">
                      {tpl.category} theme blueprint
                    </p>
                  </div>

                  {/* Features Checker Grid for explicit UI configuration visibility */}
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Grid className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">Categorized Skills</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Type className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">Merriweather Font</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                      <span className="truncate">Global Hyperlinks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">Bullet / Desc Toggle</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}