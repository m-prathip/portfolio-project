/**
 * Slowly morphing aurora-style gradient background.
 * Pure CSS animation — no JS overhead.
 */
const AuroraBackground = ({ className = '' }) => (
  <div className={`landing-aurora-wrap absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ zIndex: 0 }}>
    <div className="landing-aurora-blob landing-aurora-blob--1" />
    <div className="landing-aurora-blob landing-aurora-blob--2" />
    <div className="landing-aurora-blob landing-aurora-blob--3" />
    <div className="landing-aurora-blob landing-aurora-blob--4" />
  </div>
);

export default AuroraBackground;
