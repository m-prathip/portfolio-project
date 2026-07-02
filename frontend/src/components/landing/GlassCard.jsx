/**
 * Reusable glassmorphic card with gradient border, hover glow, and lift.
 */
const GlassCard = ({
  children,
  className = '',
  glowColor = 'rgba(124, 58, 237, 0.15)',
  hoverGlow = 'rgba(124, 58, 237, 0.3)',
  as: Tag = 'div',
  ...rest
}) => (
  <Tag
    className={`landing-glass-card group relative rounded-2xl overflow-hidden ${className}`}
    style={{ '--glow': glowColor, '--hover-glow': hoverGlow }}
    {...rest}
  >
    {/* Gradient border overlay */}
    <div className="landing-glass-card__border absolute inset-0 rounded-2xl pointer-events-none" />
    {/* Content */}
    <div className="relative z-10">
      {children}
    </div>
  </Tag>
);

export default GlassCard;
