import { motion } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';

/**
 * Wraps section content with a scroll-triggered entrance animation.
 * Supports preset variants: 'fadeUp', 'fadeIn', 'slideLeft', 'slideRight', 'scale'.
 */
const presets = {
  fadeUp:     { hidden: { opacity: 0, y: 60 },  visible: { opacity: 1, y: 0 } },
  fadeIn:     { hidden: { opacity: 0 },          visible: { opacity: 1 } },
  slideLeft:  { hidden: { opacity: 0, x: -80 },  visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: 80 },   visible: { opacity: 1, x: 0 } },
  scale:      { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
};

const SectionWrapper = ({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.7,
  className = '',
  id,
  as = 'section',
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });
  const preset = presets[variant] || presets.fadeUp;

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        hidden: preset.hidden,
        visible: {
          ...preset.visible,
          transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
