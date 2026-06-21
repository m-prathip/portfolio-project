import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { FiMenu, FiX } from 'react-icons/fi';

// Rendered inside a specific user's /u/:username portfolio, so every link
// stays scoped to that portfolio rather than the publisher root.
const Navbar = ({ username, profile }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const base = `/u/${username}`;
  const links = [
    { to: base, label: 'Home' },
    { to: `${base}/education`, label: 'Education' },
    { to: `${base}/projects`, label: 'Projects' },
    { to: `${base}/certificates`, label: 'Certificates' },
  ];

  const navCls = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`;

  const linkCls = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
    }`;

  return (
    <nav className={navCls}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to={base} className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {profile?.name ? profile.name.split(' ')[0] : 'Portfolio'}
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => <NavLink key={l.to} to={l.to} className={linkCls} end={l.to === base}>{l.label}</NavLink>)}
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 mt-2 pt-4 flex flex-col gap-3">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} className={linkCls} end={l.to === base} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
