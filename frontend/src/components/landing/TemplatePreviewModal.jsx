import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SiReact, SiPython, SiTypescript, SiTailwindcss, SiNodedotjs, SiDocker,
  SiAmazonaws, SiPostgresql, SiTensorflow, SiPytorch, SiNextdotjs, SiGit
} from 'react-icons/si';
import { FiExternalLink, FiGithub, FiCheckCircle, FiAward, FiBriefcase, FiCode, FiUser } from 'react-icons/fi';

const MOCK_SKILLS = {
  Frontend: [
    { name: 'React 19', level: 98, icon: <SiReact className="w-4 h-4 text-cyan-400" /> },
    { name: 'TypeScript', level: 95, icon: <SiTypescript className="w-4 h-4 text-blue-400" /> },
    { name: 'Tailwind CSS', level: 99, icon: <SiTailwindcss className="w-4 h-4 text-teal-400" /> },
    { name: 'Next.js', level: 92, icon: <SiNextdotjs className="w-4 h-4 text-white" /> },
  ],
  Backend: [
    { name: 'Python / FastAPI', level: 96, icon: <SiPython className="w-4 h-4 text-amber-400" /> },
    { name: 'Node.js', level: 90, icon: <SiNodedotjs className="w-4 h-4 text-green-400" /> },
    { name: 'PostgreSQL', level: 88, icon: <SiPostgresql className="w-4 h-4 text-blue-300" /> },
  ],
  'AI / ML': [
    { name: 'TensorFlow', level: 94, icon: <SiTensorflow className="w-4 h-4 text-orange-400" /> },
    { name: 'PyTorch / LLMs', level: 91, icon: <SiPytorch className="w-4 h-4 text-red-400" /> },
  ],
  DevOps: [
    { name: 'Docker / K8s', level: 89, icon: <SiDocker className="w-4 h-4 text-blue-500" /> },
    { name: 'AWS Cloud', level: 86, icon: <SiAmazonaws className="w-4 h-4 text-yellow-400" /> },
    { name: 'Git CI/CD', level: 95, icon: <SiGit className="w-4 h-4 text-orange-500" /> },
  ],
};

const MOCK_PROJECTS = [
  {
    title: 'AutonomAI — LLM Agent Pipeline',
    category: 'AI / ML',
    desc: 'Distributed multi-agent orchestration framework processing 50k+ semantic queries per second with sub-100ms latency.',
    stack: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
    metrics: '99.98% Uptime • 4x Query Speed',
  },
  {
    title: 'ApexCloud — Serverless Metric Engine',
    category: 'Full Stack',
    desc: 'Real-time observability dashboard with WebSocket streaming, custom anomaly detection algorithms, and automated alerts.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    metrics: '10k Daily Users • -35% AWS Costs',
  },
  {
    title: 'HyperPulse — Motion Design System',
    category: 'Frontend',
    desc: 'Open-source design token library and Framer Motion micro-interaction toolkit adopted by 400+ frontend engineering teams.',
    stack: ['Next.js', 'Tailwind', 'TypeScript'],
    metrics: '4.8k GitHub Stars • 200k NPM Downloads',
  },
];

const TEMPLATE_STYLES = {
  'Minimal Pro': {
    bg: 'bg-[#08080a]',
    cardBg: 'bg-white/[0.03]',
    border: 'border-white/[0.08]',
    accentText: 'text-gray-200 font-mono',
    badge: 'bg-white/[0.06] text-gray-300 border-white/[0.1]',
    headerGradient: 'from-gray-100 via-gray-300 to-gray-500',
    navStyle: 'border-b border-white/[0.06] bg-black/40',
    heroSubtext: 'Minimalist monochrome architecture emphasizing clean typography and zero visual jank.',
  },
  'Creative Flow': {
    bg: 'bg-[#0b071a]',
    cardBg: 'bg-gradient-to-br from-violet-900/20 via-white/[0.03] to-pink-900/20',
    border: 'border-violet-500/20',
    accentText: 'text-violet-400 font-sans',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    headerGradient: 'from-violet-400 via-pink-400 to-cyan-400',
    navStyle: 'border-b border-violet-500/20 bg-violet-950/30 backdrop-blur-md',
    heroSubtext: 'Vibrant spatial gradients, glassmorphism depth, and fluid motion-driven layout.',
  },
  'Corporate Edge': {
    bg: 'bg-[#0f172a]',
    cardBg: 'bg-slate-800/40',
    border: 'border-slate-700/60',
    accentText: 'text-blue-400 font-serif',
    badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    headerGradient: 'from-white via-slate-200 to-blue-200',
    navStyle: 'border-b border-slate-700/60 bg-slate-900/60',
    heroSubtext: 'Executive structured layout designed for Fortune 500 tech leaders and staff architects.',
  },
  'Dev Terminal': {
    bg: 'bg-[#030712]',
    cardBg: 'bg-[#0a0f1d] border-l-2 border-l-emerald-500',
    border: 'border-emerald-500/20 font-mono',
    accentText: 'text-emerald-400 font-mono',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono',
    headerGradient: 'from-emerald-400 via-cyan-400 to-green-300 font-mono',
    navStyle: 'border-b border-emerald-500/20 bg-black font-mono',
    heroSubtext: '$ cat bio.txt — Hacker aesthetic with monospace data grid and command line execution elements.',
  },
  'AI Scientist': {
    bg: 'bg-[#060d1f]',
    cardBg: 'bg-gradient-to-r from-cyan-950/30 to-blue-950/30',
    border: 'border-cyan-500/30',
    accentText: 'text-cyan-400 font-sans',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    headerGradient: 'from-cyan-300 via-blue-400 to-indigo-400',
    navStyle: 'border-b border-cyan-500/20 bg-[#060d1f]/80',
    heroSubtext: 'Deep neural network aesthetic featuring glowing cyber matrices and research publication showcases.',
  },
  'SaaS Founder': {
    bg: 'bg-[#0a0a0f]',
    cardBg: 'bg-gradient-to-br from-orange-950/20 via-white/[0.02] to-violet-950/20',
    border: 'border-orange-500/20',
    accentText: 'text-orange-400 font-sans',
    badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    headerGradient: 'from-orange-400 via-pink-500 to-violet-500',
    navStyle: 'border-b border-orange-500/20 bg-black/60',
    heroSubtext: 'High-converting startup pitch deck aesthetic highlighting user ARR metrics and product roadmaps.',
  },
};

const TemplatePreviewModal = ({ isOpen, onClose, template }) => {
  const [activeTab, setActiveTab] = useState('skills'); // skills | projects | resume

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !template) return null;

  const style = TEMPLATE_STYLES[template.name] || TEMPLATE_STYLES['Minimal Pro'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-lg"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 24 }}
          transition={{ type: 'spring', duration: 0.55, bounce: 0.15 }}
          className={`relative z-10 w-full max-w-5xl ${style.bg} border ${style.border} rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white`}
        >
          {/* Top Navbar */}
          <div className={`px-6 py-4 flex items-center justify-between ${style.navStyle}`}>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style.badge}`}>
                {template.category} Theme
              </span>
              <h3 className="text-lg font-bold text-white">{template.name}</h3>
              <span className="hidden sm:inline text-xs text-gray-500">| Powered by Home.jsx Skills Engine</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/signup"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-violet-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Use Template</span>
                <FiExternalLink />
              </Link>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Preview Hero Header */}
          <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className={`text-xs ${style.accentText}`}>AVAILABLE FOR STAFF & LEAD OPPORTUNITIES</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${style.headerGradient} tracking-tight mb-2`}>
                Alex Rivera — Principal AI Architect & Staff Engineer
              </h1>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
                {style.heroSubtext}
              </p>

              {/* Navigation Tabs inside preview */}
              <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
                {[
                  { id: 'skills', label: 'Tech Stack & Skills', icon: <FiCode /> },
                  { id: 'projects', label: 'Featured Projects (3)', icon: <FiBriefcase /> },
                  { id: 'resume', label: 'ATS Experience View', icon: <FiAward /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? 'bg-white/[0.12] text-white border border-white/[0.2] shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Body Area */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Categorized Skills Matrix (From Home.jsx Architecture)
                  </h4>
                  <span className="text-xs text-gray-500 font-mono">12 Validated Skills</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(MOCK_SKILLS).map(([cat, skills]) => (
                    <div key={cat} className={`p-5 rounded-xl ${style.cardBg} border ${style.border}`}>
                      <h5 className={`text-sm font-bold mb-4 flex items-center justify-between ${style.accentText}`}>
                        <span>{cat}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{skills.length} skills</span>
                      </h5>
                      <div className="space-y-3">
                        {skills.map((s, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="flex items-center gap-2 text-white font-medium">
                                {s.icon}
                                <span>{s.name}</span>
                              </span>
                              <span className="text-gray-400 font-mono">{s.level}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${s.level}%` }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className={`h-full rounded-full bg-gradient-to-r ${style.headerGradient}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Interactive Case Studies & Showcases
                  </h4>
                  <span className="text-xs text-gray-500 font-mono">Live Demo Links Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {MOCK_PROJECTS.map((proj, idx) => (
                    <div key={idx} className={`p-5 rounded-xl ${style.cardBg} border ${style.border} flex flex-col justify-between hover:border-white/[0.25] transition-all`}>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${style.badge}`}>
                            {proj.category}
                          </span>
                          <div className="flex items-center gap-2 text-gray-400">
                            <FiGithub className="hover:text-white cursor-pointer" />
                            <FiExternalLink className="hover:text-white cursor-pointer" />
                          </div>
                        </div>
                        <h5 className="text-base font-bold text-white mb-2">{proj.title}</h5>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">{proj.desc}</p>
                      </div>
                      <div>
                        <div className="pt-3 border-t border-white/[0.08] mb-3">
                          <span className="text-[11px] font-semibold text-emerald-400 block font-mono">
                            ⚡ {proj.metrics}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.stack.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] text-gray-300 font-mono">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    ATS-Optimized Executive Timeline
                  </h4>
                  <span className="text-xs text-green-400 font-mono">✓ 99% ATS Parse Score</span>
                </div>

                <div className="space-y-4">
                  {[
                    { role: 'Staff AI Architect', company: 'DeepMind Scaling Lab', period: '2024 — Present', desc: 'Leading design of distributed LLM training pipelines and multi-agent evaluation frameworks.' },
                    { role: 'Senior Frontend Lead', company: 'Vercel Ecosystem', period: '2022 — 2024', desc: 'Architected responsive UI components and React server component rendering optimizations.' },
                    { role: 'Software Engineer', company: 'Stripe Payments', period: '2020 — 2022', desc: 'Developed high-throughput financial API endpoints handling $4B+ daily volume.' },
                  ].map((exp, idx) => (
                    <div key={idx} className={`p-5 rounded-xl ${style.cardBg} border ${style.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                      <div>
                        <h5 className="text-base font-bold text-white">{exp.role} <span className="text-gray-400 font-normal">at {exp.company}</span></h5>
                        <p className="text-xs text-gray-400 mt-1">{exp.desc}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-gray-300 whitespace-nowrap self-start sm:self-center">
                        {exp.period}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Call to Action */}
          <div className="p-5 border-t border-white/[0.08] bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FiCheckCircle className="text-green-400" />
              <span>Includes 1-click personal URL, QR code, and ATS resume PDF export.</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-medium transition-colors w-full sm:w-auto"
              >
                Close Preview
              </button>
              <Link
                to="/admin/signup"
                className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all text-center w-full sm:w-auto"
              >
                Create My Portfolio With {template.name} →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TemplatePreviewModal;
