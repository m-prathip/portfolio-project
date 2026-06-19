import { createContext, useContext, useState, useEffect } from 'react';

const BackgroundContext = createContext();

// Selectable 3D/animated backgrounds (Phase 9). 'off' uses a pure-CSS
// gradient (also the automatic fallback on low-end devices).
export const BACKGROUNDS = [
  { id: 'off',       name: 'None' },
  { id: 'particles', name: 'Interactive Particles' },
  { id: 'neural',    name: 'AI Neural Network' },
  { id: 'galaxy',    name: 'Galaxy Universe' },
  { id: 'grid',      name: 'Cyber Grid' },
  { id: 'spheres',   name: 'Floating Spheres' },
  { id: 'waves',     name: 'Abstract Waves' }
];
const VALID = BACKGROUNDS.map((b) => b.id);

export const BackgroundProvider = ({ children }) => {
  const [bg, setBgState] = useState(() => {
    const saved = localStorage.getItem('bgScene');
    return VALID.includes(saved) ? saved : 'particles';
  });

  useEffect(() => { localStorage.setItem('bgScene', bg); }, [bg]);

  const setBg = (id) => { if (VALID.includes(id)) setBgState(id); };

  return (
    <BackgroundContext.Provider value={{ bg, setBg, backgrounds: BACKGROUNDS }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
