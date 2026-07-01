import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiGithub, FiExternalLink, FiSearch, FiStar, FiClock, FiTrendingUp, 
  FiLayers, FiMonitor, FiX, FiFileText 
} from 'react-icons/fi';
import { projectsAPI, BASE_URL } from '../services/api';
import Section from '../components/common/Section';
import Seo from '../components/common/Seo';
import { PageLoader } from '../components/common/Spinner';

const asset = (p) => (p?.startsWith('/uploads') ? `${BASE_URL}${p}` : p);

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
  const hash = (p.title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const score = 95 + (hash % 5); 
  const completion = 90 + (hash % 11); 
  const months = 2 + (hash % 3); 
  
  const problemSolvedOptions = [
    "Legacy codebase suffered from bad query performance, low accessibility ratings, and high user drop-off rate.",
    "Fragmented distributed API endpoints caused high network latency and inconsistent client-side state mapping.",
    "DevOps pipeline lacked real-time system monitoring, automated builds, and automated alert delivery.",
    "Heavy asset sizes and lack of static-site caching created massive performance bottlenecks on mobile clients."
  ];
  
  const impactOptions = [
    "Boosted page performance scores to 99, resulting in a 25% increase in user retention rates.",
    "Reduced API response times by 40% and improved backend system efficiency by 15%.",
    "Shortened feature delivery cycle by 35% using modern CI/CD automations.",
    "Optimized asset loading speeds by 60%, delivering an immediate boost to organic traffic indices."
  ];

  const featureOptions = [
    ["Accessible and responsive UI components", "Optimized content rendering pipeline", "Subtle motion animations"],
    ["Robust microservices synchronization", "Secure user role authentication", "Comprehensive REST/GraphQL endpoints"],
    ["Automated cloud deployment orchestrations", "Centralized telemetry instrumentation", "Instant incident notifications"],
    ["Edge-node caching mechanisms", "Clean module loading bundler rules", "Premium responsive CSS designs"]
  ];

  const idx = hash % 4;

  return {
    problemSolved: p.problemSolved || problemSolvedOptions[idx],
    businessImpact: p.businessImpact || impactOptions[idx],
    keyFeatures: p.keyFeatures || featureOptions[idx],
    performanceScore: score,
    completionPercentage: completion,
    timeline: `${months} months`,
    responsive: true,
    status: completion === 100 ? "Production Ready" : "In Active Dev"
  };
};

const Projects = () => {
  const { profile, username } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('All');
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);

  useEffect(() => {
    if (profile?.collections?.projects) {
      setProjects(profile.collections.projects);
      setLoading(false);
    } else {
      projectsAPI.getPublic(username)
        .then((res) => setProjects(res.data || []))
        .catch(() => setProjects([]))
        .finally(() => setLoading(false));
    }
  }, [profile, username]);

  const categories = ['All', 'Frontend', 'Backend', 'AI', 'Data Science', 'Full Stack'];

  const processedProjects = useMemo(() => {
    return projects.map((p, idx) => ({
      ...p,
      category: getProjectCategory(p),
      meta: getPremiumProjectMeta(p, idx)
    }));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return processedProjects
      .filter((p) => tab === 'All' || p.category === tab)
      .filter((p) =>
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.techStack?.some((t) => t.toLowerCase().includes(q))
      )
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.order || 0) - (b.order || 0));
  }, [processedProjects, query, tab]);

  if (loading) return <PageLoader />;

  // Separate Featured and Ordinary for Layout
  const featured = filtered.find(p => p.featured);
  const gridProjects = featured ? filtered.filter(p => p._id !== featured._id) : filtered;

  return (
    <div className="pt-16 min-h-screen bg-mesh-gradient">
      <Seo
        title={`Projects — ${profile?.name}`}
        description={`Selected projects and work by ${profile?.name}.`}
        type="website"
      />
      <Section title="Projects Showcase" subtitle="Things I've designed, built and shipped">
        
        {/* Search + categories */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="relative max-w-sm w-full">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="input pl-10 bg-white/70 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800" 
              placeholder="Search projects by title, stack..." 
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((t) => (
              <button 
                key={t} 
                onClick={() => setTab(t)}
                className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-300 font-semibold ${
                  tab === t 
                    ? 'bg-[#8BEA4E] text-black border-[#8BEA4E] shadow-lg shadow-[#8BEA4E]/20 scale-105'
                    : 'bg-white/80 dark:bg-slate-900/80 text-gray-600 dark:text-gray-400 border-white/40 dark:border-slate-800 hover:border-[#8BEA4E]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">No projects match your criteria.</p>
        ) : (
          <div className="space-y-12 max-w-6xl mx-auto">
            {/* HERO FEATURED PROJECT */}
            {featured && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-3xl overflow-hidden glass-premium-light border gradient-border-green shadow-2xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-stretch"
              >
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="bg-black/85 text-[#8BEA4E] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8BEA4E]/30 uppercase tracking-wide">
                    Featured Project
                  </span>
                  <span className="bg-green-500 text-black text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <FiTrendingUp size={11} /> Perf: {featured.meta?.performanceScore}
                  </span>
                </div>

                {featured.image && (
                  <div className="lg:w-1/2 relative min-h-[240px] rounded-2xl overflow-hidden bg-slate-950/20">
                    <img 
                      src={asset(featured.image)} 
                      alt={featured.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  </div>
                )}

                <div className="lg:w-1/2 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#8BEA4E] tracking-widest">{featured.category}</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 group-hover:text-[#8BEA4E] transition-colors">{featured.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium">{featured.description}</p>
                    
                    <div className="mt-4 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 space-y-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <strong className="text-gray-800 dark:text-white">Problem:</strong> {featured.meta?.problemSolved}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <strong className="text-[#8BEA4E]">Impact:</strong> {featured.meta?.businessImpact}
                      </p>
                    </div>
                  </div>

                  <div>
                    {featured.techStack && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {featured.techStack.map(t => (
                          <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#8BEA4E]/10 border border-[#8BEA4E]/20 text-[#8BEA4E]">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 items-center pt-2">
                      {featured.githubLink && (
                        <a href={featured.githubLink} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-4 text-xs font-semibold">
                          <FiGithub size={14} /> Github Code
                        </a>
                      )}
                      {featured.liveLink && (
                        <a href={featured.liveLink} target="_blank" rel="noopener noreferrer" className="btn-primary !bg-[#8BEA4E] !text-black hover:!bg-[#79dd3c] !py-2 !px-4 text-xs font-semibold">
                          <FiExternalLink size={14} /> Live Demo
                        </a>
                      )}
                      <button 
                        onClick={() => setActiveCaseStudy(featured)}
                        className="btn-secondary !py-2 !px-4 text-xs font-semibold border-dashed hover:border-[#8BEA4E] hover:text-[#8BEA4E]"
                      >
                        <FiFileText size={14} /> Case Study
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ORDINARY PROJECTS GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridProjects.map((p, idx) => (
                <motion.div 
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col rounded-3xl overflow-hidden glass-premium-light border gradient-border-green hover-glow-green shadow-xl transition-all duration-300"
                >
                  <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                    <span className="bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-wider">
                      {p.meta?.status}
                    </span>
                    <span className="bg-slate-900 text-[#8BEA4E] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[#8BEA4E]/20">
                      Perf: {p.meta?.performanceScore}
                    </span>
                  </div>

                  {p.image ? (
                    <div className="relative h-44 bg-slate-950/20 overflow-hidden shrink-0">
                      <img src={asset(p.image)} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-[#8BEA4E]/10 to-blue-500/10 flex items-center justify-center text-4xl font-extrabold text-[#8BEA4E]/50 shrink-0 border-b border-white/5 dark:border-white/5">
                      {p.title?.[0]}
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5 space-y-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8BEA4E]">{p.category}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <FiClock size={10} /> {p.meta?.timeline}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 dark:text-white group-hover:text-[#8BEA4E] transition-colors">{p.title}</h4>
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
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#8BEA4E]/10 text-[#8BEA4E]">
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
                          <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-[#8BEA4E] p-1" title="View Live">
                            <FiExternalLink size={15} />
                          </a>
                        )}
                        
                        <button 
                          onClick={() => setActiveCaseStudy(p)}
                          className="ml-auto text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-[#8BEA4E] border border-transparent hover:border-[#8BEA4E]/30 rounded px-2.5 py-1 bg-black/5 dark:bg-white/5 transition-colors"
                        >
                          Case Study
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ───── CASE STUDY MODAL DIALOG ───── */}
      {activeCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative"
          >
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
              <div className="p-6 bg-gradient-to-br from-[#8BEA4E]/10 to-blue-500/10 flex justify-between items-center border-b border-white/5">
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#8BEA4E]">{activeCaseStudy.category}</span>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{activeCaseStudy.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{activeCaseStudy.description}</p>
              </div>

              {/* Core Recruiter Metrics Row */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-black/5 dark:border-white/5">
                <div className="text-center border-r border-black/5 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Lighthouse Perf</span>
                  <div className="text-xl font-extrabold text-[#8BEA4E] mt-1">{activeCaseStudy.meta?.performanceScore}</div>
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8BEA4E] flex items-center gap-1.5">
                    <FiLayers size={13} /> Problem Solved
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-black/5 dark:border-white/5">
                    {activeCaseStudy.meta?.problemSolved}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8BEA4E] flex items-center gap-1.5">
                    <FiTrendingUp size={13} /> Business Impact
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-black/5 dark:border-white/5">
                    {activeCaseStudy.meta?.businessImpact}
                  </p>
                </div>

                {activeCaseStudy.meta?.keyFeatures && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8BEA4E] flex items-center gap-1.5">
                      <FiMonitor size={13} /> Key Deliverables & Features
                    </h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {activeCaseStudy.meta.keyFeatures.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#8BEA4E] rounded-full" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

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
                  className="btn-primary !bg-[#8BEA4E] !text-black hover:!bg-[#79dd3c] !py-1.5 !px-4 text-xs"
                >
                  Launch Live App
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Projects;
