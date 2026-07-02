import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';
import GlassCard from './GlassCard';

const RecruiterViewSection = () => (
  <SectionWrapper variant="fadeUp" className="py-24 sm:py-32 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-amber-400 tracking-wider uppercase mb-4"
        >
          Recruiter Experience
        </motion.p>
        <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
          What recruiters{' '}
          <GradientText from="#f59e0b" via="#ec4899" to="#7c3aed">actually see</GradientText>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Your portfolio is optimized for how recruiters actually evaluate candidates — fast, scannable, and impressive at first glance.
        </p>
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-6 sm:p-8 h-full relative">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold uppercase">
              Without
            </div>
            <h3 className="text-lg font-semibold text-white mb-6">Traditional Resume</h3>
            <div className="space-y-3">
              {[
                { label: 'Static PDF document', bad: true },
                { label: 'No visual impact', bad: true },
                { label: 'Limited formatting', bad: true },
                { label: 'No live project demos', bad: true },
                { label: 'Lost in email attachments', bad: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-xs">✕</span>
                  </div>
                  <span className="text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <GlassCard className="p-6 sm:p-8 h-full relative landing-glass-card--highlight">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold uppercase">
              With Portfolio Publisher
            </div>
            <h3 className="text-lg font-semibold text-white mb-6">Your Portfolio</h3>
            <div className="space-y-3">
              {[
                'Interactive, live website',
                'Beautiful visual design',
                'Full customization control',
                'Embedded project demos & code',
                'One link, instant access anywhere',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ATS Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mt-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/15 bg-green-500/5">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-sm text-gray-400">All portfolios are <span className="text-green-400 font-medium">ATS-friendly</span> and recruiter-optimized</span>
        </div>
      </motion.div>
    </div>
  </SectionWrapper>
);

export default RecruiterViewSection;
