import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiLink, FiGrid, FiShare2, FiArrowRight } from 'react-icons/fi';

const steps = [
  { icon: <FiGrid size={20} />, title: 'Add your work', text: 'Profile, education, experience, projects, skills — all from one dashboard.' },
  { icon: <FiLink size={20} />, title: 'Get your link', text: 'Every account gets a permanent, unique portfolio URL: yoursite.com/u/you.' },
  { icon: <FiShare2 size={20} />, title: 'Share it anywhere', text: 'Copy the link or hand out the QR code on a resume, badge, or business card.' },
];

const Landing = () => {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">Portfolio Hub</span>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <Link to="/admin/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Sign in</Link>
            <Link to="/admin/signup" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              One link. One QR code.<br />Your whole portfolio.
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto">
              Build your portfolio in minutes and get a personal URL and scannable QR code to share on your resume, LinkedIn, or business card.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link to="/admin/signup" className="btn-primary px-6 py-3">
                Create your portfolio <FiArrowRight size={16} />
              </Link>
              <Link to="/admin/login" className="btn-secondary px-6 py-3">Sign in</Link>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="card">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                  {s.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 dark:border-gray-800 py-6">
        <p className="text-center text-sm text-gray-400">© {new Date().getFullYear()} Portfolio Hub</p>
      </footer>
    </div>
  );
};

export default Landing;
