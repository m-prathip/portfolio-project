import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';
import GlassCard from './GlassCard';

const QRGeneratorSection = () => (
  <SectionWrapper variant="fadeUp" className="py-24 sm:py-32 relative overflow-hidden">
    <div className="absolute top-1/2 right-0 w-[600px] h-[600px] translate-x-1/2 -translate-y-1/2 bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — QR mockup */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative flex items-center justify-center"
        >
          {/* QR Code display */}
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-pink-500/20 blur-xl scale-110" />
            <GlassCard className="relative p-8 sm:p-12">
              <div className="text-center mb-4">
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium">Your Personal QR</p>
              </div>
              {/* Animated QR grid */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto grid grid-cols-11 gap-[2px] p-2">
                {Array.from({ length: 121 }).map((_, i) => {
                  const isCorner = (i < 33 && (i % 11 < 3 || (i >= 0 && i < 3))) ||
                    (i >= 88 && i % 11 < 3);
                  const probability = isCorner ? 0.9 : 0.55;
                  const show = Math.sin(i * 2.7) > -0.3;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: show ? 1 : 0.08, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.008, duration: 0.2 }}
                      className="rounded-[1.5px]"
                      style={{
                        backgroundColor: show
                          ? `hsl(${260 + (i % 5) * 15}, 70%, 65%)`
                          : 'rgba(255,255,255,0.03)',
                      }}
                    />
                  );
                })}
              </div>
              <div className="text-center mt-4">
                <p className="text-xs text-gray-400 font-mono">portfoliopub.com/u/yourname</p>
              </div>
            </GlassCard>

            {/* Scan line animation */}
            <motion.div
              className="absolute left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
              animate={{ top: ['20%', '85%', '20%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Right — Text content */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-pink-400 tracking-wider uppercase mb-4"
          >
            QR Code Generator
          </motion.p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
            Share your portfolio{' '}
            <GradientText from="#ec4899" via="#7c3aed" to="#06b6d4">instantly</GradientText>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Every portfolio gets a unique, scannable QR code. Print it on your resume, business card, or presentation — recruiters scan and see your full portfolio in seconds.
          </p>

          <div className="space-y-4">
            {[
              { title: 'Instant Generation', desc: 'QR code created automatically when you publish.', icon: '⚡' },
              { title: 'Custom Branding', desc: 'Match your portfolio theme and colors.', icon: '🎨' },
              { title: 'Scan Analytics', desc: 'Track who scans and when they visit.', icon: '📊' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-lg flex-shrink-0 group-hover:border-violet-500/30 transition-colors duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

export default QRGeneratorSection;
