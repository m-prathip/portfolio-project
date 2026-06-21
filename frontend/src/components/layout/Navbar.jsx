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
        <div className="flex items-center justify-between h-16 w-full">
          <Link to={base} className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400 shrink-0">
            {profile?.name ? profile.name.split(' ')[0] : 'Portfolio'}
          </Link>

          {/* Links (Visible on all sizes) */}
          <div className="flex items-center gap-3 md:gap-8 overflow-x-auto no-scrollbar mx-2 sm:mx-4 px-2">
            {links.map(l => <NavLink key={l.to} to={l.to} className={linkCls} end={l.to === base} style={{ whiteSpace: 'nowrap' }}>{l.label}</NavLink>)}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
