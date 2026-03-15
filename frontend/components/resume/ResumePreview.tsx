"use client";

import { useMemo } from "react";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import TechnicalTemplate from "./templates/TechnicalTemplate";

interface ResumePreviewProps {
  resume: any;
  template: string;
}

const templateComponents: Record<string, React.ComponentType<any>> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  technical: TechnicalTemplate,
};

export default function ResumePreview({ resume, template }: ResumePreviewProps) {
  const TemplateComponent = templateComponents[template] || ModernTemplate;

  const fontFamily = useMemo(() => {
    const fonts: Record<string, string> = {
      inter: "Inter, sans-serif",
      roboto: "Roboto, sans-serif",
      lato: "Lato, sans-serif",
      montserrat: "Montserrat, sans-serif",
      "open-sans": "Open Sans, sans-serif",
    };
    return fonts[resume.theme?.font || "inter"] || fonts.inter;
  }, [resume.theme?.font]);

  return (
    <div className="flex justify-center">
      <div
        id="resume-preview"
        className="bg-white shadow-lg"
        style={{
          width: "210mm",
          minHeight: "297mm",
          fontFamily,
        }}
      >
        <TemplateComponent
          resume={resume}
          primaryColor={resume.theme?.primaryColor || "#3b82f6"}
        />
      </div>
    </div>
  );
}

