import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useBackground } from '../../context/BackgroundContext';
import { FiDroplet, FiSun, FiMoon, FiCheck } from 'react-icons/fi';

// Floating-panel theme switcher: light/dark segmented toggle + a grid of
// live preview cards for all 10 palettes. Selection persists (ThemeContext).
const ThemeSwitcher = ({ align = 'right' }) => {
  const { mode, setMode, theme, setTheme, themes } = useTheme();
  const { bg, setBg, backgrounds } = useBackground();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-label="Change theme"
        className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <FiDroplet size={18} />
      </button>

      {open && (
        <div className={`absolute z-50 mt-2 w-72 ${align === 'right' ? 'right-0' : 'left-0'}
          bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 animate-fade-in`}>
          {/* Mode toggle */}
          <div className="flex items-center gap-1 p-1 mb-4 rounded-xl bg-gray-100 dark:bg-gray-900">
            {[['light', FiSun, 'Light'], ['dark', FiMoon, 'Dark']].map(([m, Icon, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${mode === m ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                               : 'text-gray-500 dark:text-gray-400'}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Palette preview cards */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Theme</p>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => {
              const active = t.id === theme;
              return (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`group relative flex items-center gap-2 p-2 rounded-xl border transition-all
                    ${active ? 'border-primary-500 ring-2 ring-primary-500/30'
                             : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                  <span className="h-7 w-7 rounded-lg shrink-0 shadow-inner"
                    style={{ background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})` }} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{t.name}</span>
                  {active && <FiCheck className="absolute top-1.5 right-1.5 text-primary-500" size={13} />}
                </button>
              );
            })}
          </div>

          {/* 3D background selector */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-4 mb-2">Background</p>
          <div className="grid grid-cols-2 gap-1.5">
            {backgrounds.map((b) => (
              <button key={b.id} onClick={() => setBg(b.id)}
                className={`text-xs px-2 py-1.5 rounded-lg border transition-colors text-left truncate
                  ${b.id === bg ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'}`}>
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
