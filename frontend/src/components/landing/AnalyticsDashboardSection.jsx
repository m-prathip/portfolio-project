import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';
import GlassCard from './GlassCard';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const StatCounter = ({ value, label, suffix = '' }) => {
  const [ref, isVisible] = useScrollAnimation();
  return (
    <div ref={ref} className="text-center">
      <motion.span
        className="text-3xl sm:text-4xl font-bold text-white block"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
      >
        {isVisible ? value : '0'}{suffix}
      </motion.span>
      <span className="text-sm text-gray-500 mt-1 block">{label}</span>
    </div>
  );
};

const BarChart = ({ bars, isVisible }) => (
  <div className="flex items-end gap-2 h-32 sm:h-40">
    {bars.map((bar, i) => (
      <motion.div
        key={i}
        className="flex-1 rounded-t-md"
        initial={{ height: 0 }}
        animate={isVisible ? { height: `${bar.value}%` } : { height: 0 }}
        transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: `linear-gradient(to top, ${bar.color}40, ${bar.color})`,
        }}
      />
    ))}
  </div>
);

const BARS = [
  { value: 60, color: '#7c3aed' },
  { value: 85, color: '#3b82f6' },
  { value: 45, color: '#06b6d4' },
  { value: 92, color: '#7c3aed' },
  { value: 70, color: '#3b82f6' },
  { value: 55, color: '#06b6d4' },
  { value: 78, color: '#7c3aed' },
];

const AnalyticsDashboardSection = () => {
  const [chartRef, chartVisible] = useScrollAnimation();

  return (
    <SectionWrapper variant="fadeUp" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] translate-x-1/3 translate-y-1/3 bg-blue-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-blue-400 tracking-wider uppercase mb-4"
            >
              Analytics Dashboard
            </motion.p>
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
              Know who's{' '}
              <GradientText from="#3b82f6" via="#06b6d4" to="#10b981">looking</GradientText>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Track portfolio views, geographic data, device breakdowns, and top-performing sections. Understand your audience and optimize your professional presence.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCounter value="2.8K" label="Views" />
              <StatCounter value="340" label="Unique Visitors" />
              <StatCounter value="89" label="QR Scans" suffix="" />
            </div>
          </div>

          {/* Right — Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            ref={chartRef}
          >
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold text-white">Portfolio Views</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
                <div className="flex items-center gap-1.5 text-green-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-xs font-medium">+24.5%</span>
                </div>
              </div>

              <BarChart bars={BARS} isVisible={chartVisible} />

              <div className="flex justify-between mt-3 text-[10px] text-gray-600">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              {/* Mini stats row */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/[0.06]">
                {[
                  { label: 'Avg. Session', value: '2m 34s', color: 'text-violet-400' },
                  { label: 'Bounce Rate', value: '24%', color: 'text-cyan-400' },
                  { label: 'Top Section', value: 'Projects', color: 'text-blue-400' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AnalyticsDashboardSection;
