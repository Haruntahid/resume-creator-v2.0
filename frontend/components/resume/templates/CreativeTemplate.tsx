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

interface CreativeTemplateProps {
  resume: any;
  primaryColor: string;
}

export default function CreativeTemplate({
  resume,
  primaryColor,
}: CreativeTemplateProps) {
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
      {/* Header with colored sidebar accent */}
      <div className="flex mb-8">
        <div
          className="w-2 mr-6 flex-shrink-0"
          style={{ backgroundColor: primaryColor }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            {personalInfo?.photoURL && (
              <img
                src={personalInfo.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                style={{ border: `2px solid ${primaryColor}` }}
              />
            )}
            <h1 className="text-4xl font-bold">
              {personalInfo?.name || "Your Name"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
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
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <div className="flex items-center mb-3">
            <div
              className="w-12 h-1 mr-3"
              style={{ backgroundColor: primaryColor }}
            />
            <h2 className="text-xl font-bold">About</h2>
          </div>
          <p className="text-sm leading-relaxed ml-[60px]">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center mb-4">
            <div
              className="w-12 h-1 mr-3"
              style={{ backgroundColor: primaryColor }}
            />
            <h2 className="text-xl font-bold">Experience</h2>
          </div>
          <div className="space-y-5 ml-[60px]">
            {experience.map((exp: any, index: number) => (
              <div
                key={index}
                className="border-l-2 pl-4"
                style={{ borderColor: primaryColor }}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: primaryColor }}
                  >
                    {exp.startDate} –{" "}
                    {exp.current ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
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
          <div className="flex items-center mb-4">
            <div
              className="w-12 h-1 mr-3"
              style={{ backgroundColor: primaryColor }}
            />
            <h2 className="text-xl font-bold">Education</h2>
          </div>
          <div className="space-y-4 ml-[60px]">
            {education.map((edu: any, index: number) => (
              <div
                key={index}
                className="border-l-2 pl-4"
                style={{ borderColor: primaryColor }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {edu.institution}
                    </p>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: primaryColor }}
                  >
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
        <section className="mb-6">
          <div className="flex items-center mb-4">
            <div
              className="w-12 h-1 mr-3"
              style={{ backgroundColor: primaryColor }}
            />
            <h2 className="text-xl font-bold">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-3 ml-[60px]">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: primaryColor }}
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
        headingClassName="text-xl font-bold"
        headingVariant="bar"
        itemTitleClassName="font-bold text-base"
        dateClassName="text-sm font-semibold"
        subtitleClassName="text-sm text-gray-600 font-medium"
        descriptionClassName="text-sm leading-relaxed"
        bulletClassName="text-sm"
        sectionGapClassName="mb-6"
      />
    </div>
  );
}
