import { motion, useSpring } from 'framer-motion';
import useMousePosition from '../../hooks/useMousePosition';

/**
 * Radial gradient that follows the cursor with smooth spring physics.
 */
const MouseFollowLight = ({ size = 500, opacity = 0.07, className = '' }) => {
  const { x, y } = useMousePosition();
  const springX = useSpring(0, { stiffness: 50, damping: 20 });
  const springY = useSpring(0, { stiffness: 50, damping: 20 });

  springX.set(x - size / 2);
  springY.set(y - size / 2);

  return (
    <motion.div
      className={`fixed pointer-events-none ${className}`}
      style={{
        x: springX,
        y: springY,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(124, 58, 237, ${opacity}) 0%, rgba(59, 130, 246, ${opacity * 0.5}) 40%, transparent 70%)`,
        borderRadius: '50%',
        zIndex: 2,
        filter: 'blur(40px)',
      }}
    />
  );
};

export default MouseFollowLight;
