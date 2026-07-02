import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * A device-frame mockup (laptop / phone outline) with parallax movement.
 * Content is passed as children and rendered inside the frame.
 */
const FloatingMockup = ({
  children,
  variant = 'laptop',
  className = '',
  parallaxStrength = 40,
  floatDelay = 0,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [parallaxStrength, -parallaxStrength]);

  const frameClasses = variant === 'phone'
    ? 'w-[220px] sm:w-[260px] rounded-[28px] border-[6px]'
    : 'w-[520px] sm:w-[680px] rounded-[12px] border-[6px]';

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ y }}
      animate={{ y: [0, -8, 0] }}
      transition={{
        y: { repeat: Infinity, duration: 5, ease: 'easeInOut', delay: floatDelay },
      }}
    >
      <div
        className={`${frameClasses} border-white/10 bg-[#0a0a1a] overflow-hidden shadow-2xl shadow-purple-500/10`}
      >
        {/* Notch for phone variant */}
        {variant === 'phone' && (
          <div className="mx-auto mt-2 mb-1 w-20 h-5 bg-[#0a0a1a] rounded-full" />
        )}
        {children}
      </div>
    </motion.div>
  );
};

export default FloatingMockup;
