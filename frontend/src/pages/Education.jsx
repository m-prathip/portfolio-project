import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiAward, FiBriefcase } from 'react-icons/fi';
import { educationAPI, experienceAPI, achievementsAPI } from '../services/api';
import Section from '../components/common/Section';
import { PageLoader } from '../components/common/Spinner';

const Education = () => {
  const { username } = useParams();
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      educationAPI.getPublic(username).catch(() => ({ data: [] })),
      experienceAPI.getPublic(username).catch(() => ({ data: [] })),
      achievementsAPI.getPublic(username).catch(() => ({ data: [] })),
    ]).then(([e, ex, a]) => {
      setEducation(e.data);
      setExperience(ex.data);
      setAchievements(a.data);
    }).finally(() => setLoading(false));
  }, [username]);

  if (loading) return <PageLoader />;

  return (
    <div className="pt-16">
      {/* Education */}
      <Section title="Education" subtitle="My academic journey" className="bg-gray-50 dark:bg-gray-900">
        {education.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No education data available yet.</p>
        ) : (
          <div className="space-y-6">
            {education.map((edu, i) => (
              <div key={edu._id} className="card animate-on-scroll relative pl-8 border-l-4 border-primary-500">
                <div className="absolute -left-2.5 top-6 w-5 h-5 rounded-full bg-primary-600 border-4 border-white dark:border-gray-800" />
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{edu.college}</h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mt-1">{edu.degree} — {edu.department}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar size={14} />
                      <span>{edu.graduationYear}</span>
                    </div>
                    {edu.cgpa && (
                      <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-1 justify-end">
                        <FiAward size={14} />
                        <span>CGPA: {edu.cgpa}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Experience */}
      <Section title="Work Experience" subtitle="Where I've contributed">
        {experience.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No experience data available yet.</p>
        ) : (
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp._id} className="card animate-on-scroll relative pl-8 border-l-4 border-indigo-500">
                <div className="absolute -left-2.5 top-6 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white dark:border-gray-800" />
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exp.company}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1 flex items-center gap-1">
                      <FiBriefcase size={14} /> {exp.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 leading-relaxed">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                    <FiCalendar size={14} />
                    <span>{exp.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Section title="Achievements" subtitle="Recognition & milestones" className="bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map(a => (
              <div key={a._id} className="card animate-on-scroll flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.description}</p>
                  <span className="text-xs text-primary-600 dark:text-primary-400 mt-2 inline-block">{a.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default Education;
