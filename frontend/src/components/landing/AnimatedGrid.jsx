/**
 * Perspective dot grid that creates depth in the hero background.
 * Pure CSS with mask-image for fade edges.
 */
const AnimatedGrid = ({ className = '' }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      zIndex: 0,
      backgroundImage: `radial-gradient(circle, rgba(124, 58, 237, 0.15) 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 15%, rgba(0,0,0,0.5) 50%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 15%, rgba(0,0,0,0.5) 50%, transparent 100%)',
      perspective: '500px',
      transform: 'rotateX(45deg) scale(2.5)',
      transformOrigin: 'center top',
    }}
  />
);

export default AnimatedGrid;
