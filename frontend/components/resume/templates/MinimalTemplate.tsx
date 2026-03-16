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

interface MinimalTemplateProps {
  resume: any;
  primaryColor: string;
}

export default function MinimalTemplate({
  resume,
  primaryColor,
}: MinimalTemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    customSections,
  } = resume;

  return (
    <div className="p-12 text-gray-800">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-5 mb-3">
          {personalInfo?.photoURL && (
            <img
              src={personalInfo.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              style={{ border: `1px solid ${primaryColor}` }}
            />
          )}
          <h1 className="text-3xl font-light">
            {personalInfo?.name || "Your Name"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
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

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-medium uppercase tracking-widest mb-4 text-gray-500">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-normal text-base">{exp.position}</h3>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {exp.startDate} –{" "}
                    {exp.current ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-none text-sm space-y-1 text-gray-700">
                    {exp.bullets.map((bullet: string, i: number) => (
                      <li key={i} className="before:content-['–'] before:mr-2">
                        {bullet}
                      </li>
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
        <section className="mb-8">
          <h2 className="text-xs font-medium uppercase tracking-widest mb-4 text-gray-500">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-normal text-base">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {edu.startDate} –{" "}
                    {edu.current ? "Present" : edu.endDate || ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-medium uppercase tracking-widest mb-4 text-gray-500">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill: string, index: number) => (
              <span key={index} className="text-sm text-gray-700">
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
        headingClassName="text-xs font-medium uppercase tracking-widest mb-4 text-gray-500"
        headingVariant="dot-line"
        itemTitleClassName="font-normal text-base"
        dateClassName="text-xs text-gray-400"
        subtitleClassName="text-sm text-gray-600"
        descriptionClassName="text-sm text-gray-700 leading-relaxed"
        bulletClassName="text-sm text-gray-700"
        sectionGapClassName="mb-8"
      />
    </div>
  );
}
