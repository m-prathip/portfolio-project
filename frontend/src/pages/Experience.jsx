import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiCalendar, FiBriefcase } from 'react-icons/fi';
import { experienceAPI } from '../services/api';
import Section from '../components/common/Section';
import Seo from '../components/common/Seo';
import { PageLoader } from '../components/common/Spinner';

const Experience = () => {
  const { profile, username } = useOutletContext();
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.collections?.experience) {
      setExperience(profile.collections.experience);
      setLoading(false);
    } else {
      experienceAPI.getPublic(username)
        .then((res) => setExperience(res.data || []))
        .catch(() => setExperience([]))
        .finally(() => setLoading(false));
    }
  }, [profile, username]);

  if (loading) return <PageLoader />;

  return (
    <div className="pt-16">
      <Seo
        title={`Experience — ${profile?.name}`}
        description={`Professional work experience of ${profile?.name}.`}
        type="website"
      />
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
    </div>
  );
};

export default Experience;
