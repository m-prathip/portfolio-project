import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

// The 10 selectable palettes. `swatch` is used to render the preview cards
// (a small gradient that approximates the theme's primary + accent colours).
export const THEMES = [
  { id: 'openai',    name: 'OpenAI',       swatch: ['#10a37f', '#0d9488'] },
  { id: 'apple',     name: 'Apple',        swatch: ['#0071e3', '#3b82f6'] },
  { id: 'cyberpunk', name: 'Cyberpunk',    swatch: ['#ec4899', '#22d3ee'] },
  { id: 'royal',     name: 'Royal Purple', swatch: ['#7c3aed', '#a855f7'] },
  { id: 'ocean',     name: 'Ocean Blue',   swatch: ['#0ea5e9', '#06b6d4'] },
  { id: 'emerald',   name: 'Emerald',      swatch: ['#10b981', '#22c55e'] },
  { id: 'blackgold', name: 'Black Gold',   swatch: ['#d4af37', '#92400e'] },
  { id: 'midnight',  name: 'Midnight',     swatch: ['#6366f1', '#312e81'] },
  { id: 'neon',      name: 'Neon Future',  swatch: ['#84cc16', '#39ff14'] },
  { id: 'glass',     name: 'Glass',        swatch: ['#818cf8', '#a78bfa'] }
];

const VALID = THEMES.map((t) => t.id);
const DEFAULT_THEME = 'openai';

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('colorMode');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('themePalette');
    return VALID.includes(saved) ? saved : DEFAULT_THEME;
  });

  // Briefly enable a global transition class so switches animate smoothly
  // without paying the transition cost on every interaction.
  const animate = useCallback(() => {
    const el = document.documentElement;
    el.classList.add('theme-anim');
    window.clearTimeout(animate._t);
    animate._t = window.setTimeout(() => el.classList.remove('theme-anim'), 500);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('colorMode', mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('themePalette', theme);
  }, [theme]);

  const setTheme = useCallback((id) => {
    if (!VALID.includes(id)) return;
    animate();
    setThemeState(id);
  }, [animate]);

  const toggle = useCallback(() => {
    animate();
    setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  }, [animate]);

  const setModeSafe = useCallback((m) => {
    animate();
    setMode(m === 'dark' ? 'dark' : 'light');
  }, [animate]);

  return (
    <ThemeContext.Provider value={{
      // Back-compat with existing components:
      dark: mode === 'dark',
      toggle,
      // New theme engine API:
      mode, setMode: setModeSafe,
      theme, setTheme, themes: THEMES
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
