/**
 * Text with animated gradient fill + optional shimmer sweep.
 */
const GradientText = ({
  children,
  className = '',
  from = '#7c3aed',
  via = '#3b82f6',
  to = '#06b6d4',
  animate = true,
  as: Tag = 'span',
}) => (
  <Tag
    className={`inline-block text-transparent bg-clip-text ${animate ? 'landing-gradient-text--shimmer' : ''} ${className}`}
    style={{
      backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
      backgroundSize: animate ? '200% 100%' : '100% 100%',
    }}
  >
    {children}
  </Tag>
);

export default GradientText;
