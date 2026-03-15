interface MinimalTemplateProps {
  resume: any;
  primaryColor: string;
}

export default function MinimalTemplate({ resume, primaryColor }: MinimalTemplateProps) {
  const { personalInfo, summary, experience, education, skills } = resume;

  return (
    <div className="p-12 text-gray-800">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-light mb-3">{personalInfo?.name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
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
          <h2 className="text-xs font-medium uppercase tracking-widest mb-4 text-gray-500">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-normal text-base">{exp.position}</h3>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-none text-sm space-y-1 text-gray-700">
                    {exp.bullets.map((bullet: string, i: number) => (
                      <li key={i} className="before:content-['–'] before:mr-2">{bullet}</li>
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
          <h2 className="text-xs font-medium uppercase tracking-widest mb-4 text-gray-500">Education</h2>
          <div className="space-y-4">
            {education.map((edu: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-normal text-base">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate || ""}
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
          <h2 className="text-xs font-medium uppercase tracking-widest mb-4 text-gray-500">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill: string, index: number) => (
              <span key={index} className="text-sm text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

