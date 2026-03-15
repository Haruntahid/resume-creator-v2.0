interface ExecutiveTemplateProps {
  resume: any;
  primaryColor: string;
}

export default function ExecutiveTemplate({ resume, primaryColor }: ExecutiveTemplateProps) {
  const { personalInfo, summary, experience, education, skills } = resume;

  return (
    <div className="p-10 text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gray-900 text-white p-6 mb-4" style={{ backgroundColor: primaryColor }}>
          <h1 className="text-4xl font-bold mb-2">{personalInfo?.name || "Your Name"}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {personalInfo?.email && <span>{personalInfo.email}</span>}
            {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo?.location && <span>• {personalInfo.location}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 uppercase border-b-2 pb-1" style={{ borderColor: primaryColor }}>
            Executive Summary
          </h2>
          <p className="text-sm leading-relaxed mt-2">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-4 uppercase border-b-2 pb-1" style={{ borderColor: primaryColor }}>
            Professional Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h3 className="font-bold text-base">{exp.position}</h3>
                    <p className="text-gray-600 text-sm">{exp.company}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
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
          <h2 className="text-lg font-bold mb-4 uppercase border-b-2 pb-1" style={{ borderColor: primaryColor }}>
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu: any, index: number) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-base">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
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
          <h2 className="text-lg font-bold mb-4 uppercase border-b-2 pb-1" style={{ borderColor: primaryColor }}>
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="text-sm px-2 py-1 border-l-4"
                style={{ borderLeftColor: primaryColor }}
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

