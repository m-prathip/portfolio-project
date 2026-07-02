import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleCanvas from './ParticleCanvas';
import AuroraBackground from './AuroraBackground';
import AnimatedGrid from './AnimatedGrid';
import MouseFollowLight from './MouseFollowLight';
import MagneticButton from './MagneticButton';
import GradientText from './GradientText';
import FloatingMockup from './FloatingMockup';
import DemoVideoModal from './DemoVideoModal';

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const HeroSection = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[72px]">
      {/* Background layers */}
      <AnimatedGrid />
      <AuroraBackground />
      <ParticleCanvas />
      <MouseFollowLight />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center pt-16 sm:pt-24 pb-12">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[13px] text-gray-400 font-medium">Trusted by 10,000+ professionals</span>
      </motion.div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-[-0.03em] mb-6">
        {['Build', 'the', 'Portfolio'].map((word, i) => (
          <motion.span
            key={word}
            custom={i}
            variants={wordVariants}
            initial="hidden"
            animate="visible"
            className="inline-block text-white mr-3 sm:mr-4"
          >
            {word}
          </motion.span>
        ))}
        <br className="hidden sm:block" />
        {['That', 'Gets', 'You'].map((word, i) => (
          <motion.span
            key={word}
            custom={i + 3}
            variants={wordVariants}
            initial="hidden"
            animate="visible"
            className="inline-block text-white mr-3 sm:mr-4"
          >
            {word}
          </motion.span>
        ))}
        <motion.span
          custom={6}
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
        >
          <GradientText
            from="#7c3aed"
            via="#3b82f6"
            to="#06b6d4"
            className="font-extrabold"
          >
            Hired.
          </GradientText>
        </motion.span>
      </h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
      >
        Create your portfolio, resume, personal website, and QR code in minutes.
        <br className="hidden sm:block" />
        Share one beautiful link everywhere.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticButton>
          <Link
            to="/admin/signup"
            className="landing-btn-primary text-base px-8 py-4 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 transition-shadow duration-300"
          >
            <span>Create Free Portfolio</span>
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </MagneticButton>
        <MagneticButton>
          <button onClick={() => setDemoOpen(true)} className="landing-btn-ghost text-base px-8 py-4">
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            <span>Watch Demo</span>
          </button>
        </MagneticButton>
      </motion.div>
    </div>

    {/* Floating Mockups */}
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pb-8"
    >
      <div className="relative">
        {/* Main laptop mockup */}
        <FloatingMockup variant="laptop" className="mx-auto" parallaxStrength={30}>
          <img
            src="/portfolio_mockup.png"
            alt="Portfolio Dashboard"
            className="w-full h-auto rounded-t-lg"
          />
        </FloatingMockup>

        {/* Floating cards around laptop */}
        <motion.div
          className="absolute -left-4 sm:left-4 top-1/4 z-20 hidden sm:block"
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <div className="px-4 py-3 rounded-xl border border-white/[0.08] bg-[#0a0a1a]/80 backdrop-blur-xl shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">99</div>
            <div>
              <div className="text-xs font-semibold text-white">ATS Score</div>
              <div className="text-[10px] text-gray-400">Top 1% Resume</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -right-4 sm:right-8 top-1/2 z-20 hidden sm:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
        >
          <div className="px-4 py-3 rounded-xl border border-white/[0.08] bg-[#0a0a1a]/80 backdrop-blur-xl shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 text-xs font-bold">✨</div>
            <div>
              <div className="text-xs font-semibold text-white">AI Bio Generated</div>
              <div className="text-[10px] text-gray-400">In 2.4 seconds</div>
            </div>
          </div>
        </motion.div>

        {/* Floating analytics badge */}
        <motion.div
          className="absolute -left-2 sm:left-12 top-1/3 z-20 hidden sm:block"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
        >
          <div className="px-4 py-3 rounded-xl border border-white/[0.08] bg-[#0a0a1a]/80 backdrop-blur-xl shadow-xl">
            <div className="text-[10px] text-gray-500 mb-1">Profile Views</div>
            <div className="text-xl font-bold text-white flex items-center gap-1.5">
              2,847
              <span className="text-[10px] text-green-400 font-medium">+24%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>

    {/* Bottom gradient fade */}
    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050816] to-transparent pointer-events-none z-20" />

    {/* Watch Demo Modal */}
    <DemoVideoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
  </section>
  );
};

export default HeroSection;
