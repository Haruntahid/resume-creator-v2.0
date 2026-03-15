interface ModernTemplateProps {
  resume: any;
  primaryColor: string;
}

export default function ModernTemplate({ resume, primaryColor }: ModernTemplateProps) {
  const { personalInfo, summary, experience, education, skills } = resume;

  return (
    <div className="p-8 text-gray-800">
      {/* Header */}
      <div className="border-b-4 mb-6" style={{ borderColor: primaryColor }}>
        <h1 className="text-4xl font-bold mb-2">{personalInfo?.name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.website && <span>{personalInfo.website}</span>}
          {personalInfo?.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
          {personalInfo?.github && <span>GitHub: {personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate || ""}
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
          <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu: any, index: number) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate || ""}
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
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded text-sm"
                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

