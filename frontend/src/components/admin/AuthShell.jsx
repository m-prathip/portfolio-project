import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

// Shared card/background for all auth screens (login, signup, verify,
// forgot, reset) so the layout isn't duplicated five times.
const AuthShell = ({ icon, title, subtitle, children, footer }) => {
  const { dark, toggle, setTheme } = useTheme();

  useEffect(() => {
    setTheme('openai');
  }, [setTheme]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <button onClick={toggle} aria-label="Toggle theme"
          className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 shadow">
          {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
              {icon}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
