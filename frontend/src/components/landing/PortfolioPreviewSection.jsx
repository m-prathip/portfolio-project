import { motion } from 'framer-motion';
import { useRef } from 'react';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';
import GlassCard from './GlassCard';

const CARDS = [
  {
    title: 'Sarah Chen',
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'Python'],
    color: 'from-violet-500/20 to-cyan-500/20',
    accent: '#7c3aed',
  },
  {
    title: 'Marcus Rivera',
    role: 'AI Engineer',
    skills: ['PyTorch', 'LLMs', 'MLOps'],
    color: 'from-blue-500/20 to-purple-500/20',
    accent: '#3b82f6',
  },
  {
    title: 'Priya Sharma',
    role: 'Data Scientist',
    skills: ['TensorFlow', 'SQL', 'Tableau'],
    color: 'from-cyan-500/20 to-emerald-500/20',
    accent: '#06b6d4',
  },
];

const PortfolioCard = ({ card, index }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="transition-transform duration-200 ease-out will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <GlassCard className="p-6 sm:p-8 cursor-default h-full">
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-40 rounded-2xl`} />
          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-full mb-4 flex items-center justify-center text-white font-bold text-lg"
            style={{ background: `linear-gradient(135deg, ${card.accent}, ${card.accent}88)` }}
          >
            {card.title.charAt(0)}
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
          <p className="text-sm text-gray-400 mb-4">{card.role}</p>
          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {card.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2.5 py-1 rounded-full border border-white/[0.08] text-gray-400 bg-white/[0.03]"
              >
                {skill}
              </span>
            ))}
          </div>
          {/* Bottom bar */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-gray-500">portfoliopub.com/u/{card.title.split(' ')[0].toLowerCase()}</span>
            <div className="flex -space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-[#0a0a1a] bg-gray-700" />
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

const PortfolioPreviewSection = () => (
  <SectionWrapper id="features" variant="fadeUp" className="py-24 sm:py-32">
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      {/* Section header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-violet-400 tracking-wider uppercase mb-4"
        >
          Portfolio Showcase
        </motion.p>
        <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
          Portfolios that make{' '}
          <GradientText>recruiters stop scrolling</GradientText>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Your portfolio is your first impression. Make it count with professional layouts designed to highlight your best work.
        </p>
      </div>

      {/* 3D Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {CARDS.map((card, i) => (
          <PortfolioCard key={card.title} card={card} index={i} />
        ))}
      </div>
    </div>
  </SectionWrapper>
);

export default PortfolioPreviewSection;
