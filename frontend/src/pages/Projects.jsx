import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiSearch, FiStar } from 'react-icons/fi';
import { projectsAPI, BASE_URL } from '../services/api';
import Section from '../components/common/Section';
import Seo from '../components/common/Seo';
import Tilt from '../components/common/Tilt';
import { PageLoader } from '../components/common/Spinner';

const asset = (p) => (p?.startsWith('/uploads') ? `${BASE_URL}${p}` : p);

const Projects = () => {
  const { profile, username } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('All');

  useEffect(() => {
    projectsAPI.getPublic(username)
      .then((res) => setProjects(res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [username]);

  // Build category tabs from the tech stacks across all projects.
  const tabs = useMemo(() => {
    const counts = {};
    projects.forEach((p) => (p.techStack || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
    return ['All', ...top];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects
      .filter((p) => tab === 'All' || (p.techStack || []).includes(tab))
      .filter((p) =>
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (p.techStack || []).some((t) => t.toLowerCase().includes(q)))
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.order || 0) - (b.order || 0));
  }, [projects, query, tab]);

  if (loading) return <PageLoader />;

  return (
    <div className="pt-16">
      <Seo
        title={`Projects — ${profile?.name}`}
        description={`Selected projects and work by ${profile?.name}.`}
        type="website"
      />
      <Section title="Projects" subtitle="Things I've designed, built and shipped">
        {/* Search + tabs */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              className="input pl-10" placeholder="Search projects…" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                  tab === t ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No projects match your search.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div key={project._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}>
                <Tilt className="h-full">
                  <div className="h-full flex flex-col rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-800/70 backdrop-blur border border-white/50 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow">
                    <div className="relative h-40 bg-gradient-to-br from-primary-500/20 to-accent/20 overflow-hidden">
                      {project.image
                        ? <img src={asset(project.image)} alt={project.title} loading="lazy" className="h-full w-full object-cover" />
                        : <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-primary-500/60">{project.title?.[0]}</div>}
                      {project.featured && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-primary-600 text-white shadow">
                          <FiStar size={12} /> Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-bold text-gray-900 dark:text-white">{project.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-1">{project.description}</p>
                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.techStack.map((t) => (
                            <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <FiGithub size={15} /> Code
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 ml-auto">
                            <FiExternalLink size={15} /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default Projects;
