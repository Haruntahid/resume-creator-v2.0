"use client";

import { useEffect, useRef, useState } from "react";
import HTMLResume from "./HTMLResume";
import { Resume } from "@/lib/types/resume";

interface ResumePreviewProps {
  resume: Resume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.clientWidth;
      const childWidth = 794; // 210mm in pixels at 96 DPI is approx 794px
      const padding = 24; // padding
      const newScale = Math.min(1, (parentWidth - padding) / childWidth);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-start justify-center p-4 overflow-auto"
    >
      <div
        id="resume-preview"
        className="origin-top transition-transform duration-100 ease-out shadow-2xl rounded-sm"
        style={{
          transform: `scale(${scale})`,
          width: "210mm",
          height: "297mm",
        }}
      >
        <HTMLResume resume={resume} />
      </div>
    </div>
  );
}
