interface CreativeTemplateProps {
  resume: any;
  primaryColor: string;
}

export default function CreativeTemplate({ resume, primaryColor }: CreativeTemplateProps) {
  const { personalInfo, summary, experience, education, skills } = resume;

  return (
    <div className="p-8 text-gray-800">
      {/* Header with colored sidebar */}
      <div className="flex mb-8">
        <div className="w-2 mr-6" style={{ backgroundColor: primaryColor }}></div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{personalInfo?.name || "Your Name"}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {personalInfo?.email && <span className="font-medium">{personalInfo.email}</span>}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.location && <span>{personalInfo.location}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <div className="flex items-center mb-3">
            <div className="w-12 h-1 mr-3" style={{ backgroundColor: primaryColor }}></div>
            <h2 className="text-xl font-bold">About</h2>
          </div>
          <p className="text-sm leading-relaxed ml-[60px]">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-1 mr-3" style={{ backgroundColor: primaryColor }}></div>
            <h2 className="text-xl font-bold">Experience</h2>
          </div>
          <div className="space-y-5 ml-[60px]">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="border-l-2 pl-4" style={{ borderColor: primaryColor }}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: primaryColor }}>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate || ""}
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
            <div className="w-12 h-1 mr-3" style={{ backgroundColor: primaryColor }}></div>
            <h2 className="text-xl font-bold">Education</h2>
          </div>
          <div className="space-y-4 ml-[60px]">
            {education.map((edu: any, index: number) => (
              <div key={index} className="border-l-2 pl-4" style={{ borderColor: primaryColor }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <p className="text-gray-600 font-medium">{edu.institution}</p>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: primaryColor }}>
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
          <div className="flex items-center mb-4">
            <div className="w-12 h-1 mr-3" style={{ backgroundColor: primaryColor }}></div>
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
    </div>
  );
}

