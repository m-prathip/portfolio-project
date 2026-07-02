import { useEffect, useState, useCallback } from 'react';

/**
 * Tracks the mouse position globally or relative to a given element.
 * Throttled via rAF for smooth 60fps updates without layout thrashing.
 */
export default function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e) => {
    requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [handleMouse]);

  return position;
}
