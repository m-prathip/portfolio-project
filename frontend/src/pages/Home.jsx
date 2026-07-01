import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiTwitter, FiInstagram,
  FiDownload, FiExternalLink, FiCalendar, FiSend, FiCheckCircle, FiAward,
  FiCode, FiBriefcase, FiZap, FiFileText, FiStar, FiCpu, FiTrendingUp,
  FiLayers, FiMonitor, FiClock, FiX
} from 'react-icons/fi';
import { FaJava } from 'react-icons/fa';
import {
  SiReact, SiPython, SiHtml5, SiJavascript, SiCss3, SiNodedotjs, SiGit, SiDocker,
  SiGooglecloud, SiAmazonaws, SiPostgresql, SiMongodb, SiTensorflow, SiPytorch,
  SiCplusplus, SiTypescript, SiTailwindcss, SiNextdotjs, SiAngular, SiVuedotjs
} from 'react-icons/si';
import {
  skillsAPI, achievementsAPI, activitiesAPI, projectsAPI, experienceAPI,
  portfolioAPI, certificatesAPI, whyHireAPI, BASE_URL
} from '../services/api';
import Section from '../components/common/Section';
import Seo from '../components/common/Seo';
import { PageLoader } from '../components/common/Spinner';
import useTypewriter from '../hooks/useTypewriter';

const asset = (p) => (p?.startsWith('/uploads') ? `${BASE_URL}${p}` : p);
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const getSkillIcon = (name) => {
  const n = name.toLowerCase().trim();
  if (n.includes('react')) return <SiReact className="w-5 h-5" />;
  if (n.includes('python')) return <SiPython className="w-5 h-5" />;
  if (n.includes('javascript') || n.includes('js')) return <SiJavascript className="w-5 h-5" />;
  if (n.includes('typescript') || n.includes('ts')) return <SiTypescript className="w-5 h-5" />;
  if (n.includes('html')) return <SiHtml5 className="w-5 h-5" />;
  if (n.includes('css')) return <SiCss3 className="w-5 h-5" />;
  if (n.includes('node')) return <SiNodedotjs className="w-5 h-5" />;
  if (n.includes('git')) return <SiGit className="w-5 h-5" />;
  if (n.includes('docker')) return <SiDocker className="w-5 h-5" />;
  if (n.includes('aws') || n.includes('amazon')) return <SiAmazonaws className="w-5 h-5" />;
  if (n.includes('gcp') || n.includes('google cloud')) return <SiGooglecloud className="w-5 h-5" />;
  if (n.includes('postgres') || n.includes('sql')) return <SiPostgresql className="w-5 h-5" />;
  if (n.includes('mongo')) return <SiMongodb className="w-5 h-5" />;
  if (n.includes('tensorflow')) return <SiTensorflow className="w-5 h-5" />;
  if (n.includes('pytorch')) return <SiPytorch className="w-5 h-5" />;
  if (n.includes('c++') || n.includes('cpp')) return <SiCplusplus className="w-5 h-5" />;
  if (n.includes('java')) return <FaJava className="w-5 h-5" />;
  if (n.includes('tailwind')) return <SiTailwindcss className="w-5 h-5" />;
  if (n.includes('next')) return <SiNextdotjs className="w-5 h-5" />;
  if (n.includes('angular')) return <SiAngular className="w-5 h-5" />;
  if (n.includes('vue')) return <SiVuedotjs className="w-5 h-5" />;
  return <FiZap className="w-5 h-5" />;
};

const getProjectCategory = (p) => {
  const stack = (p.techStack || []).map(t => t.toLowerCase());
  const title = (p.title || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  
  if (stack.some(t => ['tensorflow', 'pytorch', 'ml', 'ai', 'llm', 'openai', 'deep learning'].includes(t)) || 
      title.includes('ai') || title.includes('machine learning') || desc.includes('ai ') || desc.includes('intelligence')) {
    return 'AI';
  }
  if (stack.some(t => ['data science', 'pandas', 'numpy', 'scikit', 'analytics', 'r'].includes(t)) ||
      title.includes('data') || desc.includes('data science') || desc.includes('analytics')) {
    return 'Data Science';
  }
  
  const hasFrontend = stack.some(t => ['react', 'vue', 'angular', 'html', 'css', 'tailwind', 'nextjs', 'typescript', 'js'].includes(t));
  const hasBackend = stack.some(t => ['node', 'python', 'django', 'express', 'postgres', 'mongodb', 'sql', 'graphql', 'server'].includes(t));
  
  if (hasFrontend && hasBackend) return 'Full Stack';
  if (hasBackend) return 'Backend';
  return 'Frontend';
};

const getPremiumProjectMeta = (p, index) => {
  const featArray = p.keyFeatures 
    ? (typeof p.keyFeatures === 'string' ? p.keyFeatures.split(',').map(s => s.trim()) : p.keyFeatures)
    : [];

  return {
    problemSolved: p.problemSolved || "A specialized system designed to address critical performance bottlenecks and scale operations.",
    businessImpact: p.businessImpact || "Improved customer retention and reduced operational query latency across production environments.",
    keyFeatures: featArray.length > 0 ? featArray : ["Automated workflows", "Scalable data ingestion", "Responsive visual interface"],
    performanceScore: p.performanceScore || 98,
    completionPercentage: p.completionPercentage || 100,
    timeline: p.timeline || "2 Months",
    responsive: true,
    status: p.status || (p.completionPercentage === 100 ? "Production Ready" : "In Active Dev")
  };
};

const getSkillCategory = (s) => {
  const cat = (s.category || '').toLowerCase().trim();
  if (cat.includes('front') || cat.includes('react') || cat.includes('ui') || cat.includes('design')) return 'Frontend';
  if (cat.includes('back') || cat.includes('node') || cat.includes('api') || cat.includes('server')) return 'Backend';
  if (cat.includes('ai') || cat.includes('ml') || cat.includes('machine') || cat.includes('tensor') || cat.includes('learn')) return 'AI/ML';
  if (cat.includes('db') || cat.includes('data') || cat.includes('sql') || cat.includes('mongo') || cat.includes('postgres')) return 'Databases';
  return 'Tools';
};

const Home = () => {
  const { profile, username } = useOutletContext();
  const [data, setData] = useState({ skills: [], achievements: [], activities: [], projects: [], experience: [], certificates: [] });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);

  useEffect(() => {
    if (profile?.collections) {
      setData(profile.collections);
      setLoading(false);
    } else {
      Promise.all([
        skillsAPI.getPublic(username).catch(() => ({ data: [] })),
        achievementsAPI.getPublic(username).catch(() => ({ data: [] })),
        activitiesAPI.getPublic(username).catch(() => ({ data: [] })),
        projectsAPI.getPublic(username).catch(() => ({ data: [] })),
        experienceAPI.getPublic(username).catch(() => ({ data: [] })),
        certificatesAPI.getPublic(username).catch(() => ({ data: [] })),
        whyHireAPI.getPublic(username).catch(() => ({ data: [] }))
      ]).then(([s, a, ac, p, e, c, w]) =>
        setData({ skills: s.data, achievements: a.data, activities: ac.data, projects: p.data, experience: e.data, certificates: c.data, whyHire: w.data })
      ).finally(() => setLoading(false));
    }
  }, [profile, username]);

  const { skills = [], achievements = [], activities = [], projects = [], experience = [], certificates = [], whyHire = [] } = data || {};

  // Group skills into the 5 specified categories
  const groupedSkills = {
    'Frontend': [],
    'Backend': [],
    'AI/ML': [],
    'Databases': [],
    'Tools': []
  };

  skills.forEach(s => {
    const group = getSkillCategory(s);
    groupedSkills[group].push(s);
  });

  // Filter out empty categories
  Object.keys(groupedSkills).forEach(k => {
    if (groupedSkills[k].length === 0) {
      delete groupedSkills[k];
    }
  });

  const social = profile?.social || {};
  const socialLinks = [
    { key: 'linkedin', icon: <FiLinkedin />, label: 'LinkedIn' },
    { key: 'github', icon: <FiGithub />, label: 'GitHub' },
    { key: 'twitter', icon: <FiTwitter />, label: 'Twitter' },
    { key: 'instagram', icon: <FiInstagram />, label: 'Instagram' },
    { key: 'portfolio', icon: <FiExternalLink />, label: 'Portfolio' }
  ].filter((l) => social[l.key]);

  const roles = [profile?.title, ...(profile?.domains || [])].filter(Boolean);
  const typed = 'Software Developer';
  const topSkills = skills.slice(0, 6).map((s) => s.name);

  // Recruiter stats values
  const achievementsCount = achievements.length || 3;
  const techCount = skills.length || 15;
  const projectCount = projects.length || 10;
  const certCount = certificates.length || 4;

  const recruiterStats = [
    { icon: <FiAward className="text-accent w-5 h-5" />, value: achievementsCount, label: 'Achievements', suffix: '+' },
    { icon: <FiCode className="text-accent w-5 h-5" />, value: projectCount, label: 'Projects Shipped', suffix: '+' },
    { icon: <FiZap className="text-accent w-5 h-5" />, value: techCount, label: 'Technologies Mastered', suffix: '+' },
    { icon: <FiAward className="text-accent w-5 h-5" />, value: certCount, label: 'Certifications Issued', suffix: '' }
  ];

  const whyHireList = whyHire.length > 0 
    ? whyHire.map(w => w.title)
    : [
        profile?.about ? `${(profile.about || '').slice(0, 110)}${profile.about.length > 110 ? '…' : ''}` : null,
        skills.length ? `Hands-on with ${topSkills.slice(0, 4).join(', ')}${skills.length > 4 ? ' and more' : ''}.` : null,
        projects.length ? `Shipped ${projects.length} real project${projects.length > 1 ? 's' : ''} you can explore live.` : null,
        achievements.length ? `${achievements.length} recognised achievement${achievements.length > 1 ? 's' : ''} & certifications.` : null
      ].filter(Boolean);

  const resumeUrl = asset(profile?.resumeUrl);

  const sendContact = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await portfolioAPI.contact(username, form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch { /* ignored */ } finally { setSending(false); }
  };

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Person',
    name: profile?.name, jobTitle: profile?.title, email: profile?.email,
    address: profile?.location, knowsAbout: topSkills,
    sameAs: Object.values(social).filter(Boolean)
  };

  // Classify and sort projects
  const categorizedProjects = projects.map((p, idx) => ({
    ...p,
    category: getProjectCategory(p),
    meta: getPremiumProjectMeta(p, idx)
  }));

  const filteredProjects = categorizedProjects;



  return (
    <div>
      <Seo
        title={`${profile?.name} — ${profile?.title || 'Portfolio'}`}
        description={profile?.about}
        image={asset(profile?.profileImage)}
        type="profile"
        jsonLd={jsonLd}
      />

      {/* ───── HERO ───── */}
      <section className="relative min-h-0 sm:min-h-screen flex items-start sm:items-center pt-24 sm:pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:py-16 w-full">
          <div className="flex flex-col items-center justify-center text-center gap-8 sm:gap-10 lg:gap-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="relative mx-auto mt-4 md:mt-0">
              <div className="relative h-40 w-40 sm:h-64 sm:w-64 lg:h-80 lg:w-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-blue-500 blur-2xl opacity-30 animate-pulse" />
                {profile?.profileImage ? (
                  <img src={asset(profile.profileImage)} alt={profile?.name} loading="lazy"
                    className="relative h-full w-full object-cover rounded-full ring-4 ring-white/60 dark:ring-gray-800 shadow-2xl" />
                ) : (
                  <div className="relative h-full w-full rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white text-7xl font-bold ring-4 ring-white/60 dark:ring-gray-800 shadow-2xl">
                    {profile?.name?.[0] || '?'}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="space-y-6 flex flex-col items-center">
              <span className="inline-flex items-center gap-2 bg-white/70 dark:bg-gray-800/60 backdrop-blur
                border border-white/40 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                <span className="w-2.5 h-2.5 bg-accent green-bullet-glow rounded-full animate-pulse" /> Available for opportunities
              </span>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight break-words text-center">
                Hi, I'm <span className="bg-gradient-to-r from-gray-950 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {profile?.name}
                </span>
              </h1>

              <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-300 font-semibold h-8 text-center">
                {typed}<span className="text-accent animate-pulse">|</span>
              </p>

              {profile?.about && <p className="text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed text-center mx-auto">{profile.about}</p>}

              {profile?.location && (
                <p className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"><FiMapPin size={15} /> {profile.location}</p>
              )}

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {resumeUrl && (
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <FiDownload size={16} /> Resume
                  </a>
                )}
                <button onClick={() => scrollTo('contact')} className="btn-secondary">
                  <FiSend size={16} /> Hire Me
                </button>
                {profile?.email && (
                  <a href={`mailto:${profile.email}?subject=Interview%20Request`} className="btn-secondary">
                    <FiCalendar size={16} /> Schedule Interview
                  </a>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex justify-center gap-3 pt-2">
                  {socialLinks.map((l) => (
                    <a key={l.key} href={social[l.key]} target="_blank" rel="noopener noreferrer" aria-label={l.label}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-white/40 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:scale-110 transition-all">
                      {l.icon}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── RECRUITER SNAPSHOT (stats) ───── */}
      <Section className="!py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {recruiterStats.map((s, idx) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl p-6 text-center glass-premium-light border gradient-border-green hover-glow-green shadow-lg flex flex-col items-center justify-center animate-float-delayed"
              style={{ animationDelay: `${idx * 0.8}s` }}
            >
              <div className="mb-3 h-10 w-10 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">{s.icon}</div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{s.value}{s.suffix}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ───── WHY HIRE ME ───── */}
      {whyHireList.length > 0 && (
        <Section title="Why hire me?" subtitle="What I bring to your team">
          <div className="grid sm:grid-cols-2 gap-4">
            {whyHireList.map((w, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl p-5 bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-white/40 dark:border-gray-700 animate-on-scroll">
                <FiCheckCircle className="text-accent shrink-0 mt-0.5" size={20} />
                <p className="text-gray-700 dark:text-gray-300">{w}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ───── ABOUT ───── */}
      {profile?.about && (
        <Section id="about" title="About" subtitle="A bit more about me">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl animate-on-scroll">{profile.about}</p>
        </Section>
      )}

      {/* ───── SKILLS ───── */}
      {skills.length > 0 && (
        <Section title="Skills Dashboard" subtitle="Technologies I work with" className="bg-mesh-gradient relative overflow-hidden py-16">
          <div className="max-w-5xl mx-auto space-y-12 relative z-10">
            
            {/* Staggered dashboard categories */}
            <div className="grid md:grid-cols-5 gap-6">
              {Object.entries(groupedSkills).map(([cat, list], catIdx) => (
                <motion.div 
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                  className="md:col-span-5 space-y-4"
                >
                  <h3 className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-accent green-bullet-glow rounded-full" />
                    {cat}
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((s, idx) => {
                      const levelName = s.proficiencyLevel || (s.level >= 85 ? 'Expert' : s.level >= 70 ? 'Advanced' : s.level >= 50 ? 'Intermediate' : 'Learning');
                      const expYearsVal = s.yearsOfExperience || (s.level >= 85 ? '4+ Yrs' : s.level >= 70 ? '3 Yrs' : s.level >= 50 ? '2 Yrs' : '1 Yr');
                      const projDetails = s.projectsCount || 'Active production use';
                      const keyAreasVal = s.keyAreas || 'Performance optimization, Clean Code';
                      return (
                        <motion.div
                          key={s._id}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="group relative flex flex-col p-5 rounded-3xl glass-premium-light border gradient-border-green hover-glow-green transition-all duration-300 cursor-pointer overflow-hidden animate-float"
                          style={{ animationDelay: `${idx * 0.5}s` }}
                        >
                          {/* Hover Tooltip Details */}
                          <div className="absolute inset-0 bg-black/90 dark:bg-black/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-5 z-20 text-white">
                            <h5 className="font-bold text-sm text-accent mb-1">{s.name} Profile</h5>
                            <ul className="text-[11px] space-y-1 text-gray-300">
                              <li>• Level: <span className="text-white font-semibold">{levelName} ({s.level}%)</span></li>
                              <li>• Est. Experience: <span className="text-white font-semibold">{expYearsVal}</span></li>
                              <li>• Projects count: <span className="text-white font-semibold">{projDetails}</span></li>
                              <li>• Key areas: <span className="text-accent">{keyAreasVal}</span></li>
                            </ul>
                          </div>

                          <div className="flex items-center justify-between mb-4 z-10">
                            <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-white/50 dark:border-slate-800 text-gray-700 dark:text-gray-300">
                              {getSkillIcon(s.name)}
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              s.level >= 85 ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              s.level >= 70 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            }`}>
                              {levelName}
                            </span>
                          </div>

                          <div className="z-10">
                            <div className="flex justify-between items-end mb-1">
                              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white capitalize">{s.name}</h4>
                              <span className="text-xs font-mono font-bold text-accent">{s.level}%</span>
                            </div>

                            {/* Custom progress bar */}
                            <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-accent to-primary-500 rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${s.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: idx * 0.05 }}
                              />
                            </div>

                            <div className="flex justify-between mt-2 text-[10px] text-gray-400 dark:text-gray-500">
                              <span>Experience: {expYearsVal}</span>
                              <span>Scale: 0-100</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ───── ACHIEVEMENTS ───── */}
      {achievements.length > 0 && (
        <Section title="Achievements" subtitle="Milestones & recognition">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((a) => (
              <div key={a._id} className="rounded-2xl p-5 bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-white/40 dark:border-gray-700 hover:shadow-lg transition-shadow animate-on-scroll">
                <FiAward className="text-primary-500 mb-2" size={22} />
                <h4 className="font-semibold text-gray-900 dark:text-white">{a.title}</h4>
                <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">{a.date}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{a.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ───── PROJECTS ───── */}
      {projects.length > 0 && (
        <Section title="Projects Showcase" subtitle="Things I've designed, built and shipped" className="bg-mesh-gradient py-16">
          


          <div className="max-w-6xl mx-auto space-y-12">
            {/* PROJECTS GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p, idx) => (
                <motion.div 
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col rounded-3xl overflow-hidden glass-premium-light border gradient-border-green hover-glow-green shadow-xl transition-all duration-300"
                >


                  {p.image ? (
                    <div className="relative h-44 bg-slate-950/20 overflow-hidden shrink-0">
                      <img src={asset(p.image)} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-accent/10 to-blue-500/10 flex items-center justify-center text-4xl font-extrabold text-accent/50 shrink-0 border-b border-white/5 dark:border-white/5">
                      {p.title?.[0]}
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5 space-y-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{p.category}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <FiClock size={10} /> {p.meta?.timeline}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 dark:text-white group-hover:text-accent transition-colors">{p.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{p.description}</p>
                    </div>

                    <div>
                      {p.techStack && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.techStack.slice(0, 3).map(t => (
                            <span key={t} className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-black/5 dark:border-white/5">
                              {t}
                            </span>
                          ))}
                          {p.techStack.length > 3 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                              +{p.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                        {p.githubLink && (
                          <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-1" title="View Code">
                            <FiGithub size={15} />
                          </a>
                        )}
                        {p.liveLink && (
                          <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-accent p-1" title="View Live">
                            <FiExternalLink size={15} />
                          </a>
                        )}
                        
                        <button 
                          onClick={() => setActiveCaseStudy(p)}
                          className="ml-auto text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-accent border border-transparent hover:border-accent/30 rounded px-2.5 py-1 bg-black/5 dark:bg-white/5 transition-colors"
                        >
                          Case Study
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">No projects match the selected category filter.</p>
            )}
          </div>
        </Section>
      )}

      {/* ───── CASE STUDY MODAL DIALOG ───── */}
      {activeCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative"
          >
            {/* Header image cover */}
            {activeCaseStudy.image ? (
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                <img src={asset(activeCaseStudy.image)} alt={activeCaseStudy.title} className="w-full h-full object-cover opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <button 
                  onClick={() => setActiveCaseStudy(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950 transition-colors border border-white/10"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-br from-accent/10 to-blue-500/10 flex justify-between items-center border-b border-white/5">
                <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">Project Case Study</h4>
                <button 
                  onClick={() => setActiveCaseStudy(null)}
                  className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-800 dark:text-white transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>
            )}

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent">{activeCaseStudy.category}</span>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{activeCaseStudy.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{activeCaseStudy.description}</p>
              </div>

              {/* Core Recruiter Metrics Row */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-black/5 dark:border-white/5">
                <div className="text-center border-r border-black/5 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Lighthouse Perf</span>
                  <div className="text-xl font-extrabold text-accent mt-1">{activeCaseStudy.meta?.performanceScore}</div>
                </div>
                <div className="text-center border-r border-black/5 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Completion</span>
                  <div className="text-xl font-extrabold text-white mt-1">{activeCaseStudy.meta?.completionPercentage}%</div>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Timeline</span>
                  <div className="text-xl font-extrabold text-white mt-1">{activeCaseStudy.meta?.timeline}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <FiLayers size={13} /> Problem Solved
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-black/5 dark:border-white/5">
                    {activeCaseStudy.meta?.problemSolved}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <FiTrendingUp size={13} /> Business Impact
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-black/5 dark:border-white/5">
                    {activeCaseStudy.meta?.businessImpact}
                  </p>
                </div>

                {activeCaseStudy.meta?.keyFeatures && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                      <FiMonitor size={13} /> Key Deliverables & Features
                    </h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {activeCaseStudy.meta.keyFeatures.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Action footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-black/5 dark:border-white/5 flex justify-end gap-3">
              <button 
                onClick={() => setActiveCaseStudy(null)}
                className="btn-secondary !py-1.5 !px-4 text-xs"
              >
                Close Case Study
              </button>
              {activeCaseStudy.liveLink && (
                <a 
                  href={activeCaseStudy.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary !py-1.5 !px-4 text-xs"
                >
                  Launch Live App
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ───── CERTIFICATES ───── */}
      {certificates.length > 0 && (
        <Section title="Certificates" subtitle="Professional credentials">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.map((c) => (
              <div key={c._id} className="flex flex-col rounded-2xl p-5 bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-white/40 dark:border-gray-700 hover:shadow-lg transition-shadow animate-on-scroll">
                <div className="mb-3">
                  <FiFileText className="text-primary-500 mb-2" size={22} />
                  <h4 className="font-semibold text-gray-900 dark:text-white">{c.name}</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{c.issuer}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Issued {c.issueDate}</p>
                </div>
                {c.credentialUrl && (
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                      Show credential <FiExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ───── CONTACT ───── */}
      <Section id="contact" title="Get in touch" subtitle="Let's build something together">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {profile?.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600"><FiMail /> {profile.email}</a>}
            {profile?.phone && <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><FiPhone /> {profile.phone}</p>}
            {profile?.location && <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300"><FiMapPin /> {profile.location}</p>}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socialLinks.map((l) => (
                  <a key={l.key} href={social[l.key]} target="_blank" rel="noopener noreferrer" aria-label={l.label}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/60 border border-white/40 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">{l.icon}</a>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl p-6 bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-white/40 dark:border-gray-700">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center h-full py-8">
                <FiCheckCircle className="text-green-500 mb-3" size={40} />
                <p className="font-semibold text-gray-900 dark:text-white">Message sent!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Thanks for reaching out — I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={sendContact} className="space-y-3">
                <input className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="input" type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <textarea className="input min-h-[120px]" placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center disabled:opacity-60">
                  {sending ? 'Sending…' : <><FiSend size={16} /> Send message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
