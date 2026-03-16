import {
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  WebsiteIcon,
  LinkedInIcon,
  GitHubIcon,
  ContactItem,
  CustomSectionsRenderer,
} from "../templates/Shared";

interface TechnicalTemplateProps {
  resume: any;
  primaryColor: string;
}

export default function TechnicalTemplate({
  resume,
  primaryColor,
}: TechnicalTemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    customSections,
  } = resume;

  return (
    <div className="p-8 text-gray-800">
      <div className="flex gap-8">
        {/* ── Left sidebar ── */}
        <div className="w-1/3 flex-shrink-0">
          {/* Photo + Name */}
          <div className="mb-6">
            {personalInfo?.photoURL && (
              <img
                src={personalInfo.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-3"
                style={{ border: `2px solid ${primaryColor}` }}
              />
            )}
            <h1 className="text-2xl font-bold mb-3">
              {personalInfo?.name || "Your Name"}
            </h1>
            <div className="space-y-1.5 text-xs">
              {personalInfo?.email && (
                <ContactItem
                  icon={<EmailIcon color={primaryColor} size={11} />}
                  text={personalInfo.email}
                />
              )}
              {personalInfo?.phone && (
                <ContactItem
                  icon={<PhoneIcon color={primaryColor} size={11} />}
                  text={personalInfo.phone}
                />
              )}
              {personalInfo?.location && (
                <ContactItem
                  icon={<LocationIcon color={primaryColor} size={11} />}
                  text={personalInfo.location}
                />
              )}
              {personalInfo?.website && (
                <ContactItem
                  icon={<WebsiteIcon color={primaryColor} size={11} />}
                  text={personalInfo.website}
                />
              )}
              {personalInfo?.linkedin && (
                <ContactItem
                  icon={<LinkedInIcon color={primaryColor} size={11} />}
                  text={personalInfo.linkedin}
                />
              )}
              {personalInfo?.github && (
                <ContactItem
                  icon={<GitHubIcon color={primaryColor} size={11} />}
                  text={personalInfo.github}
                />
              )}
            </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-sm font-bold mb-3 uppercase"
                style={{ color: primaryColor }}
              >
                Technical Skills
              </h2>
              <div className="space-y-2">
                {skills.map((skill: string, index: number) => (
                  <div key={index} className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: "85%",
                            backgroundColor: primaryColor,
                          }}
                        />
                      </div>
                    </div>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right main content ── */}
        <div className="flex-1 min-w-0">
          {/* Summary */}
          {summary && (
            <section className="mb-6">
              <h2
                className="text-sm font-bold mb-2 uppercase border-b pb-1"
                style={{ borderColor: primaryColor }}
              >
                Summary
              </h2>
              <p className="text-xs leading-relaxed mt-2">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-sm font-bold mb-4 uppercase border-b pb-1"
                style={{ borderColor: primaryColor }}
              >
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp: any, index: number) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-sm">
                          {exp.position}
                        </h3>
                        <p className="text-gray-600 text-xs">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {exp.startDate} –{" "}
                        {exp.current ? "Present" : exp.endDate || ""}
                      </span>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-inside text-xs space-y-1 ml-4">
                        {exp.bullets.map((bullet: string, i: number) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-sm font-bold mb-4 uppercase border-b pb-1"
                style={{ borderColor: primaryColor }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu: any, index: number) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {edu.startDate} –{" "}
                        {edu.current ? "Present" : edu.endDate || ""}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          <CustomSectionsRenderer
            customSections={customSections}
            primaryColor={primaryColor}
            headingClassName="text-sm font-bold mb-4 uppercase"
            headingVariant="dot-line"
            itemTitleClassName="font-semibold text-sm"
            dateClassName="text-xs text-gray-500"
            subtitleClassName="text-xs text-gray-600 italic"
            descriptionClassName="text-xs leading-relaxed"
            bulletClassName="text-xs"
            sectionGapClassName="mb-6"
          />
        </div>
      </div>
    </div>
  );
}
