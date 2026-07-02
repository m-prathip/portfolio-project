import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';
import GlassCard from './GlassCard';

const FEATURES = [
  { icon: '📝', title: 'Professional Templates', desc: 'ATS-friendly resume layouts that recruiters love.' },
  { icon: '🎨', title: 'Custom Styling', desc: 'Personalize fonts, colors, and sections to match your brand.' },
  { icon: '📤', title: 'One-Click Export', desc: 'Download as PDF or share your live resume link.' },
  { icon: '🤖', title: 'AI-Powered Writing', desc: 'Smart suggestions for impactful bullet points.' },
];

const ResumeBuilderSection = () => (
  <SectionWrapper variant="fadeUp" className="py-24 sm:py-32 relative overflow-hidden">
    {/* Background accent */}
    <div className="absolute top-1/2 left-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-violet-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Text content */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-cyan-400 tracking-wider uppercase mb-4"
          >
            Resume Builder
          </motion.p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
            Resumes that land{' '}
            <GradientText from="#06b6d4" via="#3b82f6" to="#7c3aed">interviews</GradientText>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Build a stunning, ATS-optimized resume alongside your portfolio. Same data, beautifully formatted for every use case.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-4 h-full">
                  <span className="text-2xl mb-2 block">{f.icon}</span>
                  <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Resume mockup */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <div className="landing-resume-mockup rounded-2xl border border-white/[0.06] bg-[#0a0e1a] p-6 sm:p-8 shadow-2xl shadow-blue-500/5">
            {/* Resume header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">A</div>
              <div>
                <div className="text-lg font-bold text-white">Alex Chen</div>
                <div className="text-sm text-gray-400">Full Stack Developer</div>
                <div className="text-xs text-gray-500 mt-1">San Francisco, CA • alex@email.com</div>
              </div>
            </div>
            {/* Summary */}
            <div className="mb-5">
              <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">Summary</div>
              <div className="h-2.5 bg-white/[0.04] rounded-full w-full mb-1.5" />
              <div className="h-2.5 bg-white/[0.04] rounded-full w-4/5 mb-1.5" />
              <div className="h-2.5 bg-white/[0.04] rounded-full w-3/5" />
            </div>
            {/* Experience */}
            <div className="mb-5">
              <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">Experience</div>
              <div className="space-y-3">
                {['Senior Developer • Google', 'Developer • Stripe'].map((exp, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                      {i === 0 ? 'G' : 'S'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{exp}</div>
                      <div className="text-xs text-gray-500">2022 – Present</div>
                      <div className="h-2 bg-white/[0.03] rounded-full w-full mt-2" />
                      <div className="h-2 bg-white/[0.03] rounded-full w-3/4 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Skills */}
            <div>
              <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'].map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] text-gray-400 bg-white/[0.03]">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating annotations */}
          <motion.div
            className="absolute -top-3 -right-3 z-20"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-medium backdrop-blur-sm">
              ✓ ATS Score: 95
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </SectionWrapper>
);

export default ResumeBuilderSection;
