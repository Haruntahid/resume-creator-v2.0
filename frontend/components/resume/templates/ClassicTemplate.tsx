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

interface ClassicTemplateProps {
  resume: any;
  primaryColor: string;
}

export default function ClassicTemplate({
  resume,
  primaryColor,
}: ClassicTemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    customSections,
  } = resume;

  return (
    <div className="p-10 text-gray-800">
      {/* Header */}
      <div
        className="text-center mb-8 border-b-2 pb-4"
        style={{ borderColor: primaryColor }}
      >
        {personalInfo?.photoURL && (
          <div className="flex justify-center mb-3">
            <img
              src={personalInfo.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
              style={{ border: `2px solid ${primaryColor}` }}
            />
          </div>
        )}
        <h1 className="text-5xl font-bold mb-2">
          {personalInfo?.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo?.email && (
            <ContactItem
              icon={<EmailIcon color={primaryColor} />}
              text={personalInfo.email}
            />
          )}
          {personalInfo?.phone && (
            <ContactItem
              icon={<PhoneIcon color={primaryColor} />}
              text={personalInfo.phone}
            />
          )}
          {personalInfo?.location && (
            <ContactItem
              icon={<LocationIcon color={primaryColor} />}
              text={personalInfo.location}
            />
          )}
          {personalInfo?.website && (
            <ContactItem
              icon={<WebsiteIcon color={primaryColor} />}
              text={personalInfo.website}
            />
          )}
          {personalInfo?.linkedin && (
            <ContactItem
              icon={<LinkedInIcon color={primaryColor} />}
              text={personalInfo.linkedin}
            />
          )}
          {personalInfo?.github && (
            <ContactItem
              icon={<GitHubIcon color={primaryColor} />}
              text={personalInfo.github}
            />
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2
            className="text-lg font-bold mb-2 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Summary
          </h2>
          <p className="text-sm leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-lg font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="font-semibold text-base">{exp.position}</h3>
                    <p className="text-gray-600 text-sm italic">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} –{" "}
                    {exp.current ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
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
            className="text-lg font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu: any, index: number) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold text-base">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600 text-sm italic">
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

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-lg font-bold mb-3 uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 border text-sm"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      <CustomSectionsRenderer
        customSections={customSections}
        primaryColor={primaryColor}
        headingClassName="text-lg font-bold mb-3 uppercase tracking-wide"
        headingVariant="plain"
        itemTitleClassName="font-semibold text-base"
        dateClassName="text-xs text-gray-500"
        subtitleClassName="text-sm text-gray-600 italic"
        descriptionClassName="text-sm leading-relaxed text-justify"
        bulletClassName="text-sm"
        sectionGapClassName="mb-6"
      />
    </div>
  );
}
