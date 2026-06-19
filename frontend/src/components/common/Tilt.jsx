import { useRef } from 'react';

// Lightweight 3D tilt-on-hover wrapper (no dependency). Used by project cards.
const Tilt = ({ children, className = '', max = 12, scale = 1.02 }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      className={`transition-transform duration-150 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export default Tilt;
