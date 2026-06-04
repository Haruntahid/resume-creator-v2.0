import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
  Image,
} from "@react-pdf/renderer";
import { Resume } from "@/lib/types/resume";

// Register Google Fonts for PDF rendering
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf", fontWeight: 400 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf", fontWeight: 600 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-normal.ttf", fontWeight: 400 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-700-normal.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "Lora",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-400-normal.ttf", fontWeight: 400 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-700-normal.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "Merriweather",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-400-normal.ttf", fontWeight: 400 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-700-normal.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "Playfair Display",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-400-normal.ttf", fontWeight: 400 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "JetBrains Mono",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf", fontWeight: 400 },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.ttf", fontWeight: 700 },
  ],
});

interface PDFResumeProps {
  resume: Resume;
  pageSize?: "A4" | "LETTER";
}

export default function PDFResume({ resume, pageSize = "A4" }: PDFResumeProps) {
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

  // Spacing values based on settings
  const getMargin = () => {
    if (pageMargin === "narrow") return 20;
    if (pageMargin === "wide") return 40;
    return 30; // normal
  };

  const getSectionGap = () => {
    if (sectionSpacing === "compact") return 8;
    if (sectionSpacing === "relaxed") return 20;
    return 14; // normal
  };

  const getFontSizeMultiplier = () => {
    if (fontSize === "sm") return 0.85;
    if (fontSize === "lg") return 1.15;
    return 1.0; // md
  };

  const marginVal = getMargin();
  const sectionGap = getSectionGap();
  const fm = getFontSizeMultiplier();

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: backgroundColor,
      padding: marginVal,
      fontFamily: bodyFont,
      fontSize: 10 * fm,
      color: textColor,
      lineHeight: 1.4,
    },
    header: {
      marginBottom: sectionGap * 1.2,
    },
    headerCentered: {
      alignItems: "center",
      textAlign: "center",
    },
    headerLeft: {
      alignItems: "flex-start",
    },
    name: {
      fontFamily: headingFont,
      fontSize: 24 * fm,
      fontWeight: "bold",
      color: primaryColor,
      marginBottom: 4,
    },
    title: {
      fontSize: 12 * fm,
      color: accentColor,
      fontWeight: "semibold",
      marginBottom: 6,
    },
    contactContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: headerStyle === "minimal" && layout === "single" ? "center" : "flex-start",
      gap: 10,
      marginTop: 4,
    },
    contactItem: {
      fontSize: 8.5 * fm,
      color: "#6B7280",
    },
    link: {
      color: accentColor,
      textDecoration: "none",
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      marginVertical: 4,
    },
    section: {
      marginBottom: sectionGap,
    },
    sectionTitle: {
      fontFamily: headingFont,
      fontSize: 12 * fm,
      fontWeight: "bold",
      color: primaryColor,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    sectionDivider: {
      borderBottomWidth: 1.5,
      borderBottomColor: primaryColor,
      marginBottom: 8,
      marginTop: 2,
    },
    // Flex Layout elements
    mainContainer: {
      flexDirection: "row",
      flex: 1,
    },
    singleColumn: {
      width: "100%",
    },
    leftSidebar: {
      width: "32%",
      paddingRight: 15,
      borderRightWidth: showDividers ? 1 : 0,
      borderRightColor: "#E5E7EB",
    },
    rightMain: {
      width: "68%",
      paddingLeft: 15,
    },
    rightSidebar: {
      width: "32%",
      paddingLeft: 15,
      borderLeftWidth: showDividers ? 1 : 0,
      borderLeftColor: "#E5E7EB",
    },
    leftMain: {
      width: "68%",
      paddingRight: 15,
    },
    // Content Styles
    summaryText: {
      fontSize: 9.5 * fm,
      marginBottom: 6,
      textAlign: "justify",
    },
    itemTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 2,
    },
    itemTitle: {
      fontSize: 10.5 * fm,
      fontWeight: "bold",
    },
    itemSubtitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 4,
    },
    itemSubtitle: {
      fontSize: 9.5 * fm,
      color: "#4B5563",
      fontStyle: "italic",
    },
    itemDates: {
      fontSize: 8.5 * fm,
      color: "#6B7280",
    },
    bulletList: {
      marginLeft: 10,
      marginTop: 2,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
      paddingLeft: 4,
    },
    bulletDot: {
      width: 8,
      fontSize: 9 * fm,
      color: accentColor,
    },
    bulletText: {
      flex: 1,
      fontSize: 9 * fm,
      color: textColor,
    },
    skillBadgeContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 5,
      marginTop: 4,
    },
    skillBadge: {
      fontSize: 8.5 * fm,
      backgroundColor: "#F3F4F6",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
      color: textColor,
      borderWidth: 0.5,
      borderColor: "#E5E7EB",
    },
    profileImageContainer: {
      marginBottom: 8,
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      objectFit: "cover",
    },
  });

  const renderHeader = () => {
    const info = content?.personalInfo || {};
    const isCentered = headerStyle === "minimal" && layout === "single";

    return (
      <View style={[styles.header, isCentered ? styles.headerCentered : styles.headerLeft]}>
        {info.photoURL && (
          <View style={styles.profileImageContainer}>
            <Image src={info.photoURL} style={styles.profileImage} />
          </View>
        )}
        <Text style={styles.name}>{info.name || "Your Name"}</Text>
        <View style={styles.contactContainer}>
          {info.email && (
            <Text style={styles.contactItem}>
              Email: <Text style={styles.link}>{info.email}</Text>
            </Text>
          )}
          {info.phone && <Text style={styles.contactItem}>Phone: {info.phone}</Text>}
          {info.location && <Text style={styles.contactItem}>Location: {info.location}</Text>}
          {info.website && (
            <Text style={styles.contactItem}>
              Web: <Link src={info.website} style={styles.link}>{info.website.replace(/^https?:\/\//, "")}</Link>
            </Text>
          )}
          {info.linkedin && (
            <Text style={styles.contactItem}>
              LinkedIn: <Link src={info.linkedin} style={styles.link}>{info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</Link>
            </Text>
          )}
        </View>
        {showDividers && <View style={styles.divider} />}
      </View>
    );
  };

  const renderSummary = () => {
    if (!content?.summary) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        {showDividers && <View style={styles.sectionDivider} />}
        <Text style={styles.summaryText}>{content.summary}</Text>
      </View>
    );
  };

  const renderExperience = () => {
    const list = content?.experience || [];
    if (list.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Experience</Text>
        {showDividers && <View style={styles.sectionDivider} />}
        {list.map((exp, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemTitle}>{exp.position}</Text>
              <Text style={styles.itemDates}>
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </Text>
            </View>
            <View style={styles.itemSubtitleRow}>
              <Text style={styles.itemSubtitle}>{exp.company}</Text>
            </View>
            {exp.bullets && exp.bullets.length > 0 && (
              <View style={styles.bulletList}>
                {exp.bullets.map((bullet, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    const list = content?.education || [];
    if (list.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {showDividers && <View style={styles.sectionDivider} />}
        {list.map((edu, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemTitle}>{edu.degree}</Text>
              <Text style={styles.itemDates}>
                {edu.startDate} - {edu.current ? "Present" : edu.endDate}
              </Text>
            </View>
            <View style={styles.itemSubtitleRow}>
              <Text style={styles.itemSubtitle}>
                {edu.institution} {edu.field ? `| ${edu.field}` : ""}
              </Text>
              {edu.gpa && <Text style={styles.itemDates}>GPA: {edu.gpa}</Text>}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    const list = content?.skills || [];
    if (list.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        {showDividers && <View style={styles.sectionDivider} />}
        <View style={styles.skillBadgeContainer}>
          {list.map((skill, i) => (
            <Text key={i} style={styles.skillBadge}>
              {skill}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderProjects = () => {
    const list = content?.projects || [];
    if (list.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        {showDividers && <View style={styles.sectionDivider} />}
        {list.map((proj, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemTitle}>{proj.title}</Text>
              {proj.url && (
                <Text style={styles.itemDates}>
                  <Link src={proj.url} style={styles.link}>Link</Link>
                </Text>
              )}
            </View>
            <Text style={styles.summaryText}>{proj.description}</Text>
            {proj.techStack && proj.techStack.length > 0 && (
              <View style={styles.skillBadgeContainer}>
                {proj.techStack.map((tech, idx) => (
                  <Text key={idx} style={[styles.skillBadge, { fontSize: 8 * fm, backgroundColor: "#E0F2FE", borderColor: "#BAE6FD" }]}>
                    {tech}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderCertifications = () => {
    const list = content?.certifications || [];
    if (list.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        {showDividers && <View style={styles.sectionDivider} />}
        {list.map((cert, i) => (
          <View key={i} style={{ marginBottom: 6 }}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemTitle}>{cert.name}</Text>
              <Text style={styles.itemDates}>{cert.date}</Text>
            </View>
            <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderLanguages = () => {
    const list = content?.languages || [];
    if (list.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        {showDividers && <View style={styles.sectionDivider} />}
        <View style={styles.skillBadgeContainer}>
          {list.map((lang, i) => (
            <Text key={i} style={styles.skillBadge}>
              {lang.language} ({lang.level})
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderCustomSections = () => {
    const list = content?.customSections || [];
    if (list.length === 0) return null;

    return (
      <View style={styles.section}>
        {list.map((sec, idx) => (
          <View key={idx} style={{ marginBottom: sectionGap }}>
            <Text style={styles.sectionTitle}>{sec.name}</Text>
            {showDividers && <View style={styles.sectionDivider} />}
            {(sec.items || []).map((item, itemIdx) => (
              <View key={itemIdx} style={{ marginBottom: 6 }}>
                <View style={styles.itemTitleRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {(item.startDate || item.endDate) && (
                    <Text style={styles.itemDates}>
                      {item.startDate} - {item.current ? "Present" : item.endDate}
                    </Text>
                  )}
                </View>
                {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
                {item.description && <Text style={styles.summaryText}>{item.description}</Text>}
                {item.bullets && item.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {item.bullets.map((bullet, bIdx) => (
                      <View key={bIdx} style={styles.bulletItem}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
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

  // Helper to split sections for 2-column layouts
  const getSidebarSections = () => {
    return ["skills", "languages", "certifications"];
  };

  const getMainSections = () => {
    return sectionOrder.filter((s) => !getSidebarSections().includes(s));
  };

  return (
    <Document>
      <Page size={pageSize === "LETTER" ? "LETTER" : "A4"} style={styles.page}>
        {renderHeader()}

        {layout === "single" ? (
          <View style={styles.singleColumn}>
            {sectionOrder.map((sec) => (
              <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
            ))}
          </View>
        ) : layout === "two-column-left" ? (
          <View style={styles.mainContainer}>
            {/* Left Sidebar */}
            <View style={styles.leftSidebar}>
              {getSidebarSections().map((sec) => (
                <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
              ))}
            </View>
            {/* Right Main content */}
            <View style={styles.rightMain}>
              {getMainSections().map((sec) => (
                <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.mainContainer}>
            {/* Left Main content */}
            <View style={styles.leftMain}>
              {getMainSections().map((sec) => (
                <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
              ))}
            </View>
            {/* Right Sidebar */}
            <View style={styles.rightSidebar}>
              {getSidebarSections().map((sec) => (
                <React.Fragment key={sec}>{renderSection(sec)}</React.Fragment>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
