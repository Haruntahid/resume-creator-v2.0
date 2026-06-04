"use client";

import React from "react";
import { DesignSettings } from "@/lib/types/resume";
import { Label } from "@/components/ui/label";

interface DesignPanelProps {
  settings: DesignSettings;
  onChange: (updates: Partial<DesignSettings>) => void;
}

const FONTS = [
  "Inter",
  "Roboto",
  "Lora",
  "Merriweather",
  "Playfair Display",
  "JetBrains Mono",
  "Outfit",
  "Plus Jakarta Sans",
];

const PRESETS = [
  {
    name: "FlowCV Purple",
    primary: "#3626A7",
    accent: "#6366F1",
    text: "#111827",
    bg: "#FFFFFF",
  },
  {
    name: "Modern Blue",
    primary: "#1E3A8A",
    accent: "#3B82F6",
    text: "#1F2937",
    bg: "#FFFFFF",
  },
  {
    name: "Classic Charcoal",
    primary: "#1F2937",
    accent: "#4B5563",
    text: "#111827",
    bg: "#FFFFFF",
  },
  {
    name: "Emerald Tech",
    primary: "#059669",
    accent: "#10B981",
    text: "#0F172A",
    bg: "#FFFFFF",
  },
  {
    name: "Warm Terracotta",
    primary: "#7C2D12",
    accent: "#C2410C",
    text: "#431407",
    bg: "#FFFDFA",
  },
];

export default function DesignPanel({ settings, onChange }: DesignPanelProps) {
  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    onChange({
      primaryColor: preset.primary,
      accentColor: preset.accent,
      textColor: preset.text,
      backgroundColor: preset.bg,
    });
  };

  return (
    <div className="space-y-6 p-4">
      {/* 1. Theme Presets */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Theme Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="flex items-center gap-2 p-2 rounded-lg border hover:border-indigo-500 hover:bg-indigo-50/10 text-left transition-all text-xs"
            >
              <span className="flex gap-0.5">
                <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: preset.primary }} />
                <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: preset.accent }} />
              </span>
              <span className="font-medium truncate text-gray-700">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Color Palettes */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Custom Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Primary Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.primaryColor || "#3626A7"}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <span className="text-xs uppercase font-mono text-gray-500">{settings.primaryColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Accent Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.accentColor || "#6366F1"}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <span className="text-xs uppercase font-mono text-gray-500">{settings.accentColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Text Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.textColor || "#111827"}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <span className="text-xs uppercase font-mono text-gray-500">{settings.textColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Page Background</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.backgroundColor || "#FFFFFF"}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <span className="text-xs uppercase font-mono text-gray-500">{settings.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Typography */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Typography</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Heading Font</Label>
            <select
              value={settings.headingFont || "Inter"}
              onChange={(e) => onChange({ headingFont: e.target.value })}
              className="w-full text-sm border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Body Font</Label>
            <select
              value={settings.bodyFont || "Inter"}
              onChange={(e) => onChange({ bodyFont: e.target.value })}
              className="w-full text-sm border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Font Size</Label>
            <div className="flex border rounded-lg overflow-hidden bg-gray-50">
              {(["sm", "md", "lg"] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onChange({ fontSize: sz })}
                  className={`flex-1 py-1.5 text-xs font-medium capitalize border-r last:border-r-0 transition-all ${
                    settings.fontSize === sz
                      ? "bg-indigo-600 text-white shadow-inner"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Layout */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Layout</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Structure</Label>
            <div className="flex flex-col gap-1.5">
              {[
                { id: "single", name: "Single Column" },
                { id: "two-column-left", name: "Two Column Left Sidebar" },
                { id: "two-column-right", name: "Two Column Right Sidebar" },
              ].map((lay) => (
                <button
                  key={lay.id}
                  type="button"
                  onClick={() => onChange({ layout: lay.id as any })}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg text-left border transition-all ${
                    settings.layout === lay.id
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {lay.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Header Style</Label>
            <div className="flex border rounded-lg overflow-hidden bg-gray-50">
              {[
                { id: "minimal", name: "Minimal" },
                { id: "sidebar", name: "Sidebar info" },
              ].map((hdr) => (
                <button
                  key={hdr.id}
                  type="button"
                  onClick={() => onChange({ headerStyle: hdr.id as any })}
                  className={`flex-1 py-1.5 text-xs font-medium transition-all ${
                    settings.headerStyle === hdr.id
                      ? "bg-indigo-600 text-white shadow-inner"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {hdr.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Page Adjustments */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Margins & Spacing</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Page Margins</Label>
            <div className="flex border rounded-lg overflow-hidden bg-gray-50">
              {(["narrow", "normal", "wide"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onChange({ pageMargin: m })}
                  className={`flex-1 py-1.5 text-xs font-medium capitalize border-r last:border-r-0 transition-all ${
                    settings.pageMargin === m
                      ? "bg-indigo-600 text-white shadow-inner"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Section Spacing</Label>
            <div className="flex border rounded-lg overflow-hidden bg-gray-50">
              {(["compact", "normal", "relaxed"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange({ sectionSpacing: s })}
                  className={`flex-1 py-1.5 text-xs font-medium capitalize border-r last:border-r-0 transition-all ${
                    settings.sectionSpacing === s
                      ? "bg-indigo-600 text-white shadow-inner"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Settings toggles */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="space-y-0.5">
          <Label className="text-xs font-semibold text-gray-800">Show Section Dividers</Label>
          <p className="text-[10px] text-gray-500">Display subtle lines between sections</p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ showDividers: !settings.showDividers })}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            settings.showDividers ? "bg-indigo-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              settings.showDividers ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
