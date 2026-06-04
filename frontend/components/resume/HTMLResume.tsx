import React from "react";
import { Resume } from "@/lib/types/resume";

interface HTMLResumeProps {
  resume: Resume;
}

export default function HTMLResume({ resume }: HTMLResumeProps) {
  const { content, design, sectionOrder } = resume;
  const {
    primaryColor = "#3626A7",
    accentColor = "#6366F1",
    textColor = "#111827",
    backgroundColor = "#FFFFFF",
    headingFont = "Inter",
    bodyFont = "Inter",
    fontSize = "md",
    pageMargin = "normal",
    sectionSpacing = "normal",
    layout = "single",
    headerStyle = "minimal",
    showDividers = true,
  } = design || {};

  // Map font names to actual font-family CSS values
  const getFontFamily = (fontName: string) => {
    switch (fontName) {
      case "Playfair Display":
        return "'Playfair Display', serif";
      case "Lora":
        return "'Lora', serif";
      case "Merriweather":
        return "'Merriweather', serif";
      case "JetBrains Mono":
        return "'JetBrains Mono', monospace";
      case "Outfit":
        return "'Outfit', sans-serif";
      case "Plus Jakarta Sans":
        return "'Plus Jakarta Sans', sans-serif";
      case "Roboto":
        return "'Roboto', sans-serif";
      default:
        return "'Inter', sans-serif";
    }
  };

  const getPageMarginClass = () => {
    if (pageMargin === "narrow") return "p-6";
    if (pageMargin === "wide") return "p-14";
    return "p-10"; // normal
  };

  const getSectionGapClass = () => {
    if (sectionSpacing === "compact") return "space-y-2";
    if (sectionSpacing === "relaxed") return "space-y-6";
    return "space-y-4"; // normal
  };

  const getFontSizeClass = () => {
    if (fontSize === "sm") return "text-xs";
    if (fontSize === "lg") return "text-base";
    return "text-sm"; // md
  };

  const headingFontFamily = getFontFamily(headingFont);
  const bodyFontFamily = getFontFamily(bodyFont);

  const renderHeader = () => {
    const info = content?.personalInfo || {};
    const isCentered = headerStyle === "minimal" && layout === "single";

    return (
      <div className={`mb-6 ${isCentered ? "text-center" : "text-left"}`}>
        {info.photoURL && (
          <div className={`mb-3 ${isCentered ? "flex justify-center" : ""}`}>
            <img
              src={info.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover shadow-sm"
              style={{ borderColor: primaryColor, borderWidth: 2 }}
            />
          </div>
        )}
        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{ fontFamily: headingFontFamily, color: primaryColor }}
        >
          {info.name || "Your Name"}
        </h1>
        <div
          className={`flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 ${
            isCentered ? "justify-center" : "justify-start"
          }`}
        >
          {info.email && (
            <span>
              Email:{" "}
              <a
                href={`mailto:${info.email}`}
                className="hover:underline font-medium"
                style={{ color: accentColor }}
              >
                {info.email}
              </a>
            </span>
          )}
          {info.phone && <span>Phone: {info.phone}</span>}
          {info.location && <span>Location: {info.location}</span>}
          {info.website && (
            <span>
              Web:{" "}
              <a
                href={info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-medium"
                style={{ color: accentColor }}
              >
                {info.website.replace(/^https?:\/\//, "")}
              </a>
            </span>
          )}
          {info.linkedin && (
            <span>
              LinkedIn:{" "}
              <a
                href={info.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-medium"
                style={{ color: accentColor }}
              >
                {info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
              </a>
            </span>
          )}
        </div>
        {showDividers && <hr className="mt-4 border-gray-200" />}
      </div>
    );
  };

  const renderSummary = () => {
    if (!content?.summary) return null;
    return (
      <div>
        <h2
          className="text-sm font-bold uppercase tracking-wider mb-1"
          style={{ fontFamily: headingFontFamily, color: primaryColor }}
        >
          Professional Summary
        </h2>
        {showDividers && (
          <div
            className="h-[2px] w-full mb-2"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        <p className="leading-relaxed text-justify text-gray-700">{content.summary}</p>
      </div>
    );
  };

  const renderExperience = () => {
    const list = content?.experience || [];
    if (list.length === 0) return null;

    return (
      <div>
        <h2
          className="text-sm font-bold uppercase tracking-wider mb-1"
          style={{ fontFamily: headingFontFamily, color: primaryColor }}
        >
          Work Experience
        </h2>
        {showDividers && (
          <div
            className="h-[2px] w-full mb-3"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        <div className="space-y-4">
          {list.map((exp, i) => (
            <div key={i} className="group">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-xs text-gray-500 font-medium">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-gray-600 font-semibold italic">
                  {exp.company}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700 text-xs mt-1">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="pl-1">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    const list = content?.education || [];
    if (list.length === 0) return null;

    return (
      <div>
        <h2
          className="text-sm font-bold uppercase tracking-wider mb-1"
          style={{ fontFamily: headingFontFamily, color: primaryColor }}
        >
          Education
        </h2>
        {showDividers && (
          <div
            className="h-[2px] w-full mb-3"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        <div className="space-y-3">
          {list.map((edu, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <span className="text-xs text-gray-500 font-medium">
                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600 font-semibold italic">
                  {edu.institution} {edu.field ? `| ${edu.field}` : ""}
                </span>
                {edu.gpa && (
                  <span className="text-xs text-gray-500 font-medium">
                    GPA: {edu.gpa}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    const list = content?.skills || [];
    if (list.length === 0) return null;

    return (
      <div>
        <h2
          className="text-sm font-bold uppercase tracking-wider mb-1"
          style={{ fontFamily: headingFontFamily, color: primaryColor }}
        >
          Skills
        </h2>
        {showDividers && (
          <div
            className="h-[2px] w-full mb-2"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {list.map((skill, i) => (
            <span
              key={i}
              className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2 py-0.5 rounded transition-all text-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    const list = content?.projects || [];
    if (list.length === 0) return null;

    return (
      <div>
        <h2
          className="text-sm font-bold uppercase tracking-wider mb-1"
          style={{ fontFamily: headingFontFamily, color: primaryColor }}
        >
          Projects
        </h2>
        {showDividers && (
          <div
            className="h-[2px] w-full mb-3"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        <div className="space-y-3">
          {list.map((proj, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900">
                  {proj.title}
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:underline inline-flex items-center text-xs font-normal"
                      style={{ color: accentColor }}
                    >
                      ↗ Link
                    </a>
                  )}
                </h3>
              </div>
              <p className="text-xs text-gray-700 text-justify mt-0.5 leading-relaxed">
                {proj.description}
              </p>
              {proj.techStack && proj.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {proj.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-sky-50 border border-sky-100 text-sky-800 font-semibold px-1.5 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    const list = content?.certifications || [];
    if (list.length === 0) return null;

    return (
      <div>
        <h2
          className="text-sm font-bold uppercase tracking-wider mb-1"
          style={{ fontFamily: headingFontFamily, color: primaryColor }}
        >
          Certifications
        </h2>
        {showDividers && (
          <div
            className="h-[2px] w-full mb-2"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        <div className="space-y-2">
          {list.map((cert, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900 text-xs">{cert.name}</h3>
                <span className="text-xs text-gray-500 font-medium">{cert.date}</span>
              </div>
              <p className="text-xs text-gray-600 italic">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    const list = content?.languages || [];
    if (list.length === 0) return null;

    return (
      <div>
        <h2
          className="text-sm font-bold uppercase tracking-wider mb-1"
          style={{ fontFamily: headingFontFamily, color: primaryColor }}
        >
          Languages
        </h2>
        {showDividers && (
          <div
            className="h-[2px] w-full mb-2"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {list.map((lang, i) => (
            <span
              key={i}
              className="text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-gray-700"
            >
              {lang.language} ({lang.level})
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderCustomSections = () => {
    const list = content?.customSections || [];
    if (list.length === 0) return null;

    return (
      <div className="space-y-4">
        {list.map((sec, idx) => (
          <div key={idx}>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-1"
              style={{ fontFamily: headingFontFamily, color: primaryColor }}
            >
              {sec.name}
            </h2>
            {showDividers && (
              <div
                className="h-[2px] w-full mb-3"
                style={{ backgroundColor: primaryColor }}
              />
            )}
            <div className="space-y-3">
              {(sec.items || []).map((item, itemIdx) => (
                <div key={itemIdx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">
                      {item.title}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 hover:underline inline-flex items-center text-xs font-normal"
                          style={{ color: accentColor }}
                        >
                          ↗ Link
                        </a>
                      )}
                    </h3>
                    {(item.startDate || item.endDate) && (
                      <span className="text-xs text-gray-500 font-medium">
                        {item.startDate} - {item.current ? "Present" : item.endDate}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-xs text-gray-600 font-semibold italic">
                      {item.subtitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-gray-700 text-justify mt-1">
                      {item.description}
                    </p>
                  )}
                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700 text-xs mt-1">
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSection = (secName: string) => {
    switch (secName) {
      case "summary":
        return renderSummary();
      case "experience":
        return renderExperience();
      case "education":
        return renderEducation();
      case "skills":
        return renderSkills();
      case "projects":
        return renderProjects();
      case "certifications":
        return renderCertifications();
      case "languages":
        return renderLanguages();
      case "customSections":
        return renderCustomSections();
      default:
        return null;
    }
  };

  // Sections allocated to sidebar in two-column layouts
  const getSidebarSections = () => {
    return ["skills", "languages", "certifications"];
  };

  const getMainSections = () => {
    return sectionOrder.filter((s) => !getSidebarSections().includes(s));
  };

  return (
    <div
      className="bg-white shadow-xl transition-all duration-300 relative select-none"
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: backgroundColor,
        color: textColor,
        fontFamily: bodyFontFamily,
      }}
    >
      {/* Import stylesheet for external fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Roboto:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div className={`${getPageMarginClass()} ${getFontSizeClass()} h-full`}>
        {renderHeader()}

        {layout === "single" ? (
          <div className={getSectionGapClass()}>
            {sectionOrder.map((sec) => (
              <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
            ))}
          </div>
        ) : layout === "two-column-left" ? (
          <div className="flex h-full gap-6">
            {/* Sidebar Column */}
            <div
              className={`w-[32%] ${getSectionGapClass()} pr-4`}
              style={{
                borderRight: showDividers ? "1px solid #E5E7EB" : "none",
              }}
            >
              {getSidebarSections().map((sec) => (
                <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
              ))}
            </div>
            {/* Main Column */}
            <div className={`w-[68%] ${getSectionGapClass()} pl-2`}>
              {getMainSections().map((sec) => (
                <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full gap-6">
            {/* Main Column */}
            <div className={`w-[68%] ${getSectionGapClass()} pr-2`}>
              {getMainSections().map((sec) => (
                <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
              ))}
            </div>
            {/* Sidebar Column */}
            <div
              className={`w-[32%] ${getSectionGapClass()} pl-4`}
              style={{
                borderLeft: showDividers ? "1px solid #E5E7EB" : "none",
              }}
            >
              {getSidebarSections().map((sec) => (
                <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
