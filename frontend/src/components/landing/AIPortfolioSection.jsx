import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';
import GlassCard from './GlassCard';

const TYPING_LINES = [
  'I am a full stack developer with 3 years of experience...',
  'Skilled in React, Node.js, Python, and cloud services...',
  'Built scalable applications serving 100K+ users...',
];

const AIPortfolioSection = () => {
  const [typed, setTyped] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    if (lineIdx >= TYPING_LINES.length) return;

    const line = TYPING_LINES[lineIdx];
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setTyped(prev => prev + line[charIdx]);
        setCharIdx(c => c + 1);
      }, 30 + Math.random() * 20);
      return () => clearTimeout(t);
    } else if (lineIdx < TYPING_LINES.length - 1) {
      const t = setTimeout(() => {
        setTyped(prev => prev + '\n');
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [started, lineIdx, charIdx]);

  return (
    <SectionWrapper variant="fadeUp" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 mb-4"
          >
            <span className="text-sm">✨</span>
            <span className="text-xs font-medium text-violet-400">AI-Powered</span>
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
            Let AI build your{' '}
            <GradientText from="#7c3aed" via="#ec4899" to="#f59e0b">portfolio</GradientText>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Describe yourself in plain text. Our AI generates a complete, polished portfolio — sections, layout, and content — in under 60 seconds.
          </p>
        </div>

        {/* AI Demo */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setStarted(true)}
        >
          <GlassCard className="p-0 overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-gray-500 font-mono">AI Portfolio Generator</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
              {/* Input side */}
              <div className="p-6">
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-3">Prompt</p>
                <div className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                  {typed}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-[2px] h-4 bg-violet-400 ml-0.5 align-middle"
                  />
                </div>
              </div>

              {/* Output side */}
              <div className="p-6">
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-3">Generated Preview</p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={lineIdx >= 2 ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                    <div>
                      <div className="h-3 bg-white/[0.08] rounded-full w-28" />
                      <div className="h-2 bg-white/[0.04] rounded-full w-20 mt-1.5" />
                    </div>
                  </div>
                  {[85, 70, 55, 45, 75].map((w, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: 0, opacity: 0 }}
                      animate={lineIdx >= 2 ? { width: `${w}%`, opacity: 1 } : {}}
                      transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                      className="h-2 bg-white/[0.05] rounded-full"
                    />
                  ))}
                  <div className="flex gap-2 mt-4">
                    {['React', 'Node.js', 'Python'].map((s, i) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={lineIdx >= 2 ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 1.5 + i * 0.1 }}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-violet-500/20 text-violet-400 bg-violet-500/5"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default AIPortfolioSection;
