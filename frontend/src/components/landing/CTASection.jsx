import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from './MagneticButton';
import GradientText from './GradientText';

const CTASection = () => (
  <section className="py-24 sm:py-32 relative overflow-hidden">
    {/* Aurora background */}
    <div className="absolute inset-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-violet-500/[0.07] rounded-full blur-[150px]" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.05] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-[120px]" />
    </div>

    {/* Grid pattern */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.1) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)',
      }}
    />

    <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-[-0.03em] mb-6">
          Ready to build{' '}
          <GradientText className="block sm:inline">your future?</GradientText>
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Join thousands of professionals who've elevated their career with a stunning portfolio. It takes less than 10 minutes. No credit card required.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <Link
              to="/admin/signup"
              className="landing-btn-primary text-base px-10 py-4 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow duration-300"
            >
              Create Free Portfolio
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </MagneticButton>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500"
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Free forever plan
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            No credit card
          </span>
          <span className="flex items-center gap-1.5 hidden sm:flex">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Setup in 10 minutes
          </span>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
