import { createContext, useContext, useState, useEffect } from 'react';

const BackgroundContext = createContext();

// Selectable 3D/animated backgrounds (Phase 9). 'off' uses a pure-CSS
// gradient (also the automatic fallback on low-end devices).
export const BACKGROUNDS = [
  { id: 'particles', name: 'Drifting Particles' },
  { id: 'neural',    name: 'AI Neural Network' },
  { id: 'galaxy',    name: 'Cosmic Galaxy' },
  { id: 'grid',      name: 'Cyberpunk Grid' },
  { id: 'spheres',   name: 'Floating Spheres' },
  { id: 'waves',     name: 'Abstract Waves' },
  { id: 'polygons',  name: 'Premium Polygons' },
  { id: 'cubes',     name: 'Wireframe Cubes' },
  { id: 'off',       name: 'Clean (Off)' }
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
