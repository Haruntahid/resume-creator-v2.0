// interface ModernTemplateProps {
//   resume: any;
//   primaryColor: string;
// }

// export default function ModernTemplate({ resume, primaryColor }: ModernTemplateProps) {
//   const { personalInfo, summary, experience, education, skills } = resume;

//   return (
//     <div className="p-8 text-gray-800">
//       {/* Header */}
//       <div className="border-b-4 mb-6" style={{ borderColor: primaryColor }}>
//         <h1 className="text-4xl font-bold mb-2">{personalInfo?.name || "Your Name"}</h1>
//         <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//           {personalInfo?.email && <span>{personalInfo.email}</span>}
//           {personalInfo?.phone && <span>{personalInfo.phone}</span>}
//           {personalInfo?.location && <span>{personalInfo.location}</span>}
//           {personalInfo?.website && <span>{personalInfo.website}</span>}
//           {personalInfo?.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
//           {personalInfo?.github && <span>GitHub: {personalInfo.github}</span>}
//         </div>
//       </div>

//       {/* Summary */}
//       {summary && (
//         <section className="mb-6">
//           <h2 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
//             Professional Summary
//           </h2>
//           <p className="text-sm leading-relaxed">{summary}</p>
//         </section>
//       )}

//       {/* Experience */}
//       {experience && experience.length > 0 && (
//         <section className="mb-6">
//           <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
//             Experience
//           </h2>
//           <div className="space-y-4">
//             {experience.map((exp: any, index: number) => (
//               <div key={index} className="mb-4">
//                 <div className="flex justify-between items-start mb-1">
//                   <div>
//                     <h3 className="font-semibold text-lg">{exp.position}</h3>
//                     <p className="text-gray-600">{exp.company}</p>
//                   </div>
//                   <span className="text-sm text-gray-500">
//                     {exp.startDate} - {exp.current ? "Present" : exp.endDate || ""}
//                   </span>
//                 </div>
//                 {exp.bullets && exp.bullets.length > 0 && (
//                   <ul className="list-disc list-inside text-sm space-y-1 ml-4">
//                     {exp.bullets.map((bullet: string, i: number) => (
//                       <li key={i}>{bullet}</li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Education */}
//       {education && education.length > 0 && (
//         <section className="mb-6">
//           <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
//             Education
//           </h2>
//           <div className="space-y-3">
//             {education.map((edu: any, index: number) => (
//               <div key={index} className="mb-3">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
//                     <p className="text-gray-600">{edu.institution}</p>
//                   </div>
//                   <span className="text-sm text-gray-500">
//                     {edu.startDate} - {edu.current ? "Present" : edu.endDate || ""}
//                     {edu.gpa && ` • GPA: ${edu.gpa}`}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Skills */}
//       {skills && skills.length > 0 && (
//         <section>
//           <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
//             Skills
//           </h2>
//           <div className="flex flex-wrap gap-2">
//             {skills.map((skill: string, index: number) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 rounded text-sm"
//                 style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }

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

interface ModernTemplateProps {
  resume: any;
  primaryColor: string;
}

export default function ModernTemplate({
  resume,
  primaryColor,
}: ModernTemplateProps) {
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
      {/* Header */}
      <div
        className="border-b-4 pb-4 mb-6"
        style={{ borderColor: primaryColor }}
      >
        <div className="flex items-start gap-4">
          {personalInfo?.photoURL && (
            <img
              src={personalInfo.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              style={{ border: `2px solid ${primaryColor}` }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {personalInfo?.name || "Your Name"}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
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
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: primaryColor }}
          >
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
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
            className="text-xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu: any, index: number) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500">
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
            className="text-xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                }}
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
        headingClassName="text-xl font-bold mb-3"
        headingVariant="plain"
        itemTitleClassName="font-semibold text-base"
        dateClassName="text-sm text-gray-500"
        subtitleClassName="text-sm text-gray-600 italic"
        descriptionClassName="text-sm text-gray-700 leading-relaxed"
        bulletClassName="text-sm"
        sectionGapClassName="mb-6"
      />
    </div>
  );
}
