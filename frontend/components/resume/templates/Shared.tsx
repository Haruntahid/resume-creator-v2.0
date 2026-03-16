// Shared helpers used by all resume templates
// Import from: "@/components/resume/templates/shared"

// ─── Inline SVG Icons (html2canvas safe, color = primaryColor) ───

interface IconProps {
  color: string;
  size?: number;
}

export function EmailIcon({ color, size = 12 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function PhoneIcon({ color, size = 12 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function LocationIcon({ color, size = 12 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function WebsiteIcon({ color, size = 12 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function LinkedInIcon({ color, size = 12 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function GitHubIcon({ color, size = 12 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// ─── Contact Info Item ───
interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
}

export function ContactItem({ icon, text, className = "" }: ContactItemProps) {
  return (
    <span className={`flex items-center gap-1 ${className}`}>
      {icon}
      <span>{text}</span>
    </span>
  );
}

// ─── Custom Sections Renderer ───
// Used at the bottom of every template, after Skills.

interface CustomSectionsProps {
  customSections: any[];
  primaryColor: string;
  headingClassName?: string; // e.g. "text-xl font-bold"
  headingStyle?: React.CSSProperties;
  itemTitleClassName?: string;
  dateClassName?: string;
  subtitleClassName?: string;
  bulletClassName?: string;
  descriptionClassName?: string;
  sectionGapClassName?: string; // spacing between sections
  headingVariant?: "underline" | "bar" | "plain" | "dot-line"; // matches template style
}

export function CustomSectionsRenderer({
  customSections,
  primaryColor,
  headingClassName = "text-xl font-bold mb-2",
  headingStyle = {},
  itemTitleClassName = "font-semibold text-sm",
  dateClassName = "text-xs text-gray-500",
  subtitleClassName = "text-xs text-gray-600 italic",
  bulletClassName = "text-sm",
  descriptionClassName = "text-sm text-gray-700 leading-relaxed",
  sectionGapClassName = "mb-6",
  headingVariant = "plain",
}: CustomSectionsProps) {
  if (!customSections || customSections.length === 0) return null;

  const renderHeading = (name: string) => {
    switch (headingVariant) {
      case "underline":
        return (
          <h2
            className={headingClassName}
            style={{
              ...headingStyle,
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: "4px",
              color: primaryColor,
            }}
          >
            {name}
          </h2>
        );
      case "bar":
        return (
          <div className="flex items-center mb-4">
            <div
              className="w-12 h-1 mr-3"
              style={{ backgroundColor: primaryColor }}
            />
            <h2 className={headingClassName} style={headingStyle}>
              {name}
            </h2>
          </div>
        );
      case "dot-line":
        return (
          <h2
            className={headingClassName}
            style={{
              ...headingStyle,
              borderBottom: `1px solid ${primaryColor}`,
              paddingBottom: "2px",
            }}
          >
            {name}
          </h2>
        );
      default:
        return (
          <h2
            className={headingClassName}
            style={{ ...headingStyle, color: primaryColor }}
          >
            {name}
          </h2>
        );
    }
  };

  return (
    <>
      {customSections.map((section: any, sIdx: number) => {
        if (!section.name && (!section.items || section.items.length === 0))
          return null;
        return (
          <section key={sIdx} className={sectionGapClassName}>
            {renderHeading(section.name || "Custom Section")}

            <div className="space-y-3">
              {(section.items || []).map((item: any, iIdx: number) => (
                <div key={iIdx}>
                  {/* Title + Date row */}
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className={itemTitleClassName}>{item.title}</span>

                      {item.url && (
                        <a
                          href={
                            item.url.startsWith("http")
                              ? item.url
                              : `https://${item.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] uppercase tracking-wider text-[#0000EE] hover:underline font-bold px-1.5 py-0.5 border border-primary/20 rounded bg-primary/5 transition-colors"
                        >
                          Link
                        </a>
                      )}
                    </div>

                    {(item.startDate || item.endDate || item.current) && (
                      <span className={dateClassName}>
                        {item.startDate}
                        {item.startDate &&
                          (item.endDate || item.current) &&
                          " – "}
                        {item.current ? "Present" : item.endDate}
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  {item.subtitle && (
                    <p className={`${subtitleClassName} mb-0.5`}>
                      {item.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  {item.description && (
                    <p className={`${descriptionClassName} mb-1`}>
                      {item.description}
                    </p>
                  )}

                  {/* Bullets */}
                  {item.bullets && item.bullets.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside ml-3 space-y-0.5">
                      {item.bullets
                        .filter(Boolean)
                        .map((b: string, bIdx: number) => (
                          <li key={bIdx} className={bulletClassName}>
                            {b}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
