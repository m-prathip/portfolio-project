import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiDownload, FiExternalLink } from 'react-icons/fi';
import { skillsAPI, achievementsAPI, activitiesAPI, BASE_URL } from '../services/api';
import Section from '../components/common/Section';
import { PageLoader } from '../components/common/Spinner';

const Home = () => {
  const { profile, username } = useOutletContext();
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      skillsAPI.getPublic(username).catch(() => ({ data: [] })),
      achievementsAPI.getPublic(username).catch(() => ({ data: [] })),
      activitiesAPI.getPublic(username).catch(() => ({ data: [] })),
    ]).then(([s, a, ac]) => {
      setSkills(s.data);
      setAchievements(a.data);
      setActivities(ac.data);
    }).finally(() => setLoading(false));
  }, [username]);

  if (loading) return <PageLoader />;

  const social = profile?.social || {};
  const socialLinks = [
    { key: 'linkedin', icon: <FiLinkedin />, label: 'LinkedIn' },
    { key: 'github', icon: <FiGithub />, label: 'GitHub' },
    { key: 'twitter', icon: <FiTwitter />, label: 'Twitter' },
    { key: 'instagram', icon: <FiInstagram />, label: 'Instagram' },
    { key: 'portfolio', icon: <FiExternalLink />, label: 'Portfolio' },
  ];

  // Group skills by category
  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-1.5 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                Available for opportunities
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Hi, I'm <span className="text-primary-600 dark:text-primary-400">{profile?.name}</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                {profile?.title}
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                {profile?.about}
              </p>

              {/* Contact info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {profile?.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FiMail size={14} />{profile.email}</a>}
                {profile?.phone && <span className="flex items-center gap-1.5"><FiPhone size={14} />{profile.phone}</span>}
                {profile?.location && <span className="flex items-center gap-1.5"><FiMapPin size={14} />{profile.location}</span>}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {profile?.resumeUrl && (
                  <a href={`${BASE_URL}${profile.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <FiDownload size={16} /> Download Resume
                  </a>
                )}
                <a href="#contact" className="btn-secondary">Get In Touch</a>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map(s => social[s.key] && (
                  <a key={s.key} href={social[s.key]} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-all"
                    aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex-shrink-0 animate-fade-in">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl">
                {profile?.profileImage ? (
                  <img src={`${BASE_URL}${profile.profileImage}`} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-indigo-600 flex items-center justify-center">
                    <span className="text-8xl text-white font-bold">{profile?.name?.[0] || 'P'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <Section id="about" title="About Me" subtitle="A little more about who I am">
        <div className="animate-on-scroll max-w-3xl">
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {profile?.about}
          </p>
          {profile?.domains?.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Interested Domains</h4>
              <div className="flex flex-wrap gap-2">
                {profile.domains.map((d, i) => <span key={i} className="badge">{d}</span>)}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Skills */}
      {skills.length > 0 && (
        <Section id="skills" title="Technical Skills" subtitle="Technologies I work with" className="bg-gray-50 dark:bg-gray-800/50">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat} className="mb-8 animate-on-scroll">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catSkills.map(skill => (
                  <div key={skill._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{skill.name}</span>
                      <span className="text-xs text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Section id="achievements" title="Achievements" subtitle="Milestones I'm proud of">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map(a => (
              <div key={a._id} className="card animate-on-scroll">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 dark:text-primary-400 text-xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.description}</p>
                    <span className="text-xs text-primary-600 dark:text-primary-400 mt-2 inline-block">{a.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Extra Curricular */}
      {activities.length > 0 && (
        <Section id="activities" title="Extra-Curricular Activities" subtitle="Beyond the code" className="bg-gray-50 dark:bg-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map(a => (
              <div key={a._id} className="card animate-on-scroll">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{a.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{a.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Contact */}
      <Section id="contact" title="Get In Touch" subtitle="Let's work together">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="card flex items-center gap-4 animate-on-scroll hover:border-primary-300 dark:hover:border-primary-700 group">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <FiMail size={22} />
              </div>
              <div><p className="text-xs text-gray-500 mb-1">Email</p><p className="font-medium text-gray-900 dark:text-white text-sm">{profile.email}</p></div>
            </a>
          )}
          {profile?.phone && (
            <div className="card flex items-center gap-4 animate-on-scroll">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                <FiPhone size={22} />
              </div>
              <div><p className="text-xs text-gray-500 mb-1">Phone</p><p className="font-medium text-gray-900 dark:text-white text-sm">{profile.phone}</p></div>
            </div>
          )}
          {profile?.location && (
            <div className="card flex items-center gap-4 animate-on-scroll">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                <FiMapPin size={22} />
              </div>
              <div><p className="text-xs text-gray-500 mb-1">Location</p><p className="font-medium text-gray-900 dark:text-white text-sm">{profile.location}</p></div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default Home;
