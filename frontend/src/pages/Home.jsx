import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiTwitter, FiInstagram,
  FiDownload, FiExternalLink, FiCalendar, FiSend, FiCheckCircle, FiAward,
  FiCode, FiBriefcase, FiZap, FiFileText
} from 'react-icons/fi';
import {
  skillsAPI, achievementsAPI, activitiesAPI, projectsAPI, experienceAPI,
  portfolioAPI, certificatesAPI, BASE_URL
} from '../services/api';
import Section from '../components/common/Section';
import Seo from '../components/common/Seo';
import { PageLoader } from '../components/common/Spinner';
import useTypewriter from '../hooks/useTypewriter';

const asset = (p) => (p?.startsWith('/uploads') ? `${BASE_URL}${p}` : p);
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Home = () => {
  const { profile, username } = useOutletContext();
  const [data, setData] = useState({ skills: [], achievements: [], activities: [], projects: [], experience: [], certificates: [] });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    Promise.all([
      skillsAPI.getPublic(username).catch(() => ({ data: [] })),
      achievementsAPI.getPublic(username).catch(() => ({ data: [] })),
      activitiesAPI.getPublic(username).catch(() => ({ data: [] })),
      projectsAPI.getPublic(username).catch(() => ({ data: [] })),
      experienceAPI.getPublic(username).catch(() => ({ data: [] })),
      certificatesAPI.getPublic(username).catch(() => ({ data: [] }))
    ]).then(([s, a, ac, p, e, c]) =>
      setData({ skills: s.data, achievements: a.data, activities: ac.data, projects: p.data, experience: e.data, certificates: c.data })
    ).finally(() => setLoading(false));
  }, [username]);

  if (loading) return <PageLoader />;

  const { skills, achievements, activities, projects, experience, certificates } = data;
  const social = profile?.social || {};
  const socialLinks = [
    { key: 'linkedin', icon: <FiLinkedin />, label: 'LinkedIn' },
    { key: 'github', icon: <FiGithub />, label: 'GitHub' },
    { key: 'twitter', icon: <FiTwitter />, label: 'Twitter' },
    { key: 'instagram', icon: <FiInstagram />, label: 'Instagram' },
    { key: 'portfolio', icon: <FiExternalLink />, label: 'Portfolio' }
  ].filter((l) => social[l.key]);

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'General';
    (acc[cat] = acc[cat] || []).push(s);
    return acc;
  }, {});

  const roles = [profile?.title, ...(profile?.domains || [])].filter(Boolean);
  const typed = 'Software Developer';
  const topSkills = skills.slice(0, 6).map((s) => s.name);

  const stats = [
    { icon: <FiBriefcase />, value: experience.length, label: 'Experiences' },
    { icon: <FiCode />, value: projects.length, label: 'Projects' },
    { icon: <FiZap />, value: skills.length, label: 'Skills' },
    { icon: <FiAward />, value: achievements.length, label: 'Achievements' }
  ];

  const whyHire = [
    profile?.about ? `${(profile.about || '').slice(0, 110)}${profile.about.length > 110 ? '…' : ''}` : null,
    skills.length ? `Hands-on with ${topSkills.slice(0, 4).join(', ')}${skills.length > 4 ? ' and more' : ''}.` : null,
    projects.length ? `Shipped ${projects.length} real project${projects.length > 1 ? 's' : ''} you can explore live.` : null,
    achievements.length ? `${achievements.length} recognised achievement${achievements.length > 1 ? 's' : ''} & certifications.` : null
  ].filter(Boolean);

  const resumeUrl = asset(profile?.resumeUrl);
  const downloadResume = () => { portfolioAPI.trackResume(username); };

  const sendContact = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await portfolioAPI.contact(username, form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch { /* surfaced via disabled state */ } finally { setSending(false); }
  };

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Person',
    name: profile?.name, jobTitle: profile?.title, email: profile?.email,
    address: profile?.location, knowsAbout: topSkills,
    sameAs: Object.values(social).filter(Boolean)
  };

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
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full">
          <div className="grid grid-cols-2 gap-4 sm:gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="space-y-6">
              <span className="inline-flex items-center gap-2 bg-white/70 dark:bg-gray-800/60 backdrop-blur
                border border-white/40 dark:border-gray-700 text-primary-700 dark:text-primary-300 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Available for opportunities
              </span>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight break-words">
  Hi, I'm <span className="bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
    {profile?.name}
  </span>
</h1>

              <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-300 font-semibold h-8">
                {typed}<span className="text-primary-500 animate-pulse">|</span>
              </p>

              {profile?.about && <p className="text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">{profile.about.slice(0, 180)}{profile.about.length > 180 ? '…' : ''}</p>}

              {profile?.location && (
                <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><FiMapPin size={15} /> {profile.location}</p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                {resumeUrl && (
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" onClick={downloadResume} className="btn-primary">
                    <FiDownload size={16} /> Resume
                  </a>
                )}
                <button onClick={() => scrollTo('contact')} className="btn-primary">
                  <FiSend size={16} /> Hire Me
                </button>
                {profile?.email && (
                  <a href={`mailto:${profile.email}?subject=Interview%20Request`} className="btn-secondary">
                    <FiCalendar size={16} /> Schedule Interview
                  </a>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex gap-3 pt-2">
                  {socialLinks.map((l) => (
                    <a key={l.key} href={social[l.key]} target="_blank" rel="noopener noreferrer" aria-label={l.label}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-white/40 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:scale-110 transition-all">
                      {l.icon}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Avatar + floating tech */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="relative mx-auto">
              <div className="relative h-32 w-32 sm:h-64 sm:w-64 lg:h-80 lg:w-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent blur-2xl opacity-30 animate-pulse" />
                {profile?.profileImage ? (
                  <img src={asset(profile.profileImage)} alt={profile?.name} loading="lazy"
                    className="relative h-full w-full object-cover rounded-full ring-4 ring-white/60 dark:ring-gray-800 shadow-2xl" />
                ) : (
                  <div className="relative h-full w-full rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white text-7xl font-bold ring-4 ring-white/60 dark:ring-gray-800 shadow-2xl">
                    {profile?.name?.[0] || '?'}
                  </div>
                )}
                {topSkills.map((s, i) => {
                  const angle = (i / topSkills.length) * Math.PI * 2;
                  const radius = window.innerWidth < 640 ? 75 : 150;
                  const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
                  return (
                    <motion.span key={s}
                      animate={{ y: [y, y - 10, y] }} transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium px-3 py-1 rounded-full
                        bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-white/50 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-lg">
                      {s}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── RECRUITER SNAPSHOT (stats) ───── */}
      <Section className="!py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl p-5 text-center bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-white/40 dark:border-gray-700 shadow-sm">
              <div className="mx-auto mb-2 h-10 w-10 flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">{s.icon}</div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{s.value}+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ───── WHY HIRE ME ───── */}
      {whyHire.length > 0 && (
        <Section title="Why hire me?" subtitle="What I bring to your team">
          <div className="grid sm:grid-cols-2 gap-4">
            {whyHire.map((w, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl p-5 bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-white/40 dark:border-gray-700 animate-on-scroll">
                <FiCheckCircle className="text-primary-500 shrink-0 mt-0.5" size={20} />
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
        <Section title="Skills" subtitle="Technologies I work with" className="bg-gray-50/60 dark:bg-gray-900/40">
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(grouped).map(([cat, list]) => (
              <div key={cat} className="animate-on-scroll">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{cat}</h3>
                <div className="space-y-3">
                  {list.map((s) => (
                    <div key={s._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{s.name}</span>
                        <span className="text-gray-400">{s.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent" style={{ width: `${s.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

      {/* ───── ACTIVITIES ───── */}
      {activities.length > 0 && (
        <Section title="Activities" subtitle="Beyond the code" className="bg-gray-50/60 dark:bg-gray-900/40">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map((a) => (
              <div key={a._id} className="rounded-2xl p-5 bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-white/40 dark:border-gray-700 animate-on-scroll">
                <h4 className="font-semibold text-gray-900 dark:text-white">{a.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{a.description}</p>
              </div>
            ))}
          </div>
        </Section>
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
