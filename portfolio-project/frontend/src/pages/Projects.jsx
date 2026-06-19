import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiSearch, FiCode } from 'react-icons/fi';
import { projectsAPI, BASE_URL } from '../services/api';
import Section from '../components/common/Section';
import { PageLoader } from '../components/common/Spinner';

const Projects = () => {
  const { username } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    projectsAPI.getPublic(username)
      .then(res => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  // Get all unique technologies
  const allTechs = useMemo(() => {
    const techs = new Set();
    projects.forEach(p => p.techStack?.forEach(t => techs.add(t)));
    return ['All', ...Array.from(techs).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.techStack?.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchFilter = filter === 'All' || p.techStack?.includes(filter);
      return matchSearch && matchFilter;
    });
  }, [projects, search, filter]);

  if (loading) return <PageLoader />;

  return (
    <div className="pt-16">
      <Section title="Projects" subtitle="Things I've built">
        {/* Search & Filter */}
        <div className="mb-8 space-y-4 animate-on-scroll">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          {allTechs.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {allTechs.map(tech => (
                <button key={tech} onClick={() => setFilter(tech)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === tech
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}>
                  {tech}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FiCode size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {projects.length === 0 ? 'No projects added yet.' : 'No projects match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(project => (
              <div key={project._id} className="card animate-on-scroll flex flex-col group hover:-translate-y-1 transition-transform duration-200">
                {/* Project Image */}
                <div className="h-44 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/30 dark:to-indigo-900/30">
                  {project.image ? (
                    <img src={`${BASE_URL}${project.image}`} alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiCode size={48} className="text-primary-300 dark:text-primary-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1 line-clamp-3">{project.description}</p>

                  {/* Tech Stack */}
                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="badge text-xs">{tech}</span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <FiGithub size={15} /> Code
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors ml-auto">
                        <FiExternalLink size={15} /> Live Demo
                      </a>
                    )}
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

export default Projects;
