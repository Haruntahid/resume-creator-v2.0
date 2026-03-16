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

function CustomSectionsRenderer({
  customSections,
  primaryColor,
}: {
  customSections: any[];
  primaryColor: string;
}) {
  if (!customSections || customSections.length === 0) return null;

  return (
    <>
      {customSections.map((section: any, sIndex: number) => (
        <div key={sIndex} style={{ marginBottom: "16px" }}>
          {/* Section heading — styled same as your other section headings */}
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: primaryColor,
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: "4px",
              marginBottom: "8px",
            }}
          >
            {section.name || "Custom Section"}
          </h2>

          {(section.items || []).map((item: any, iIndex: number) => (
            <div key={iIndex} style={{ marginBottom: "10px" }}>
              {/* Title + dates row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontWeight: "600", fontSize: "12px" }}>
                  {item.title}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: "6px",
                        color: primaryColor,
                        fontSize: "11px",
                        fontWeight: "400",
                      }}
                    >
                      ↗ Link
                    </a>
                  )}
                </span>
                {(item.startDate || item.endDate) && (
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>
                    {item.startDate}
                    {item.startDate && (item.endDate || item.current) && " – "}
                    {item.current ? "Present" : item.endDate}
                  </span>
                )}
              </div>

              {/* Subtitle */}
              {item.subtitle && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#4b5563",
                    fontStyle: "italic",
                    marginBottom: "3px",
                  }}
                >
                  {item.subtitle}
                </div>
              )}

              {/* Description paragraph */}
              {item.description && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#374151",
                    marginBottom: "4px",
                    lineHeight: "1.5",
                  }}
                >
                  {item.description}
                </p>
              )}

              {/* Bullet points */}
              {item.bullets && item.bullets.length > 0 && (
                <ul style={{ paddingLeft: "16px", margin: "0" }}>
                  {item.bullets.map((bullet: string, bIndex: number) => (
                    <li
                      key={bIndex}
                      style={{
                        fontSize: "11px",
                        color: "#374151",
                        lineHeight: "1.6",
                        marginBottom: "2px",
                      }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function ResumePreview({
  resume,
  template,
}: ResumePreviewProps) {
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
