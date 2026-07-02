import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';
import GlassCard from './GlassCard';

const TESTIMONIALS = [
  {
    name: 'Emily Zhang',
    role: 'Software Engineer at Google',
    quote: 'Portfolio Publisher helped me stand out from 500+ applicants. The recruiter specifically mentioned how impressed they were with my live portfolio.',
    avatar: 'EZ',
    gradient: 'from-violet-500 to-blue-500',
  },
  {
    name: 'James Park',
    role: 'Data Scientist at Meta',
    quote: 'I switched from a plain PDF resume to a Portfolio Publisher profile. Within two weeks, I had three interview calls. The QR code on my business card was a game changer.',
    avatar: 'JP',
    gradient: 'from-cyan-500 to-emerald-500',
  },
  {
    name: 'Aisha Patel',
    role: 'CS Student, MIT',
    quote: 'As a student, I needed something that looked professional without spending weeks building it. Had my portfolio live in under 10 minutes.',
    avatar: 'AP',
    gradient: 'from-pink-500 to-violet-500',
  },
  {
    name: 'Carlos Rivera',
    role: 'Freelance Designer',
    quote: 'My clients now see my full portfolio before our first call. It builds instant trust and has directly increased my project close rate by 40%.',
    avatar: 'CR',
    gradient: 'from-amber-500 to-pink-500',
  },
  {
    name: 'Dr. Sarah Kim',
    role: 'HR Director, Fortune 500',
    quote: "When candidates share a Portfolio Publisher link, they immediately feel more prepared and professional. It's become my recommended tool for job seekers.",
    avatar: 'SK',
    gradient: 'from-blue-500 to-violet-500',
  },
  {
    name: 'Marcus Chen',
    role: 'AI Researcher, Stanford',
    quote: 'The AI portfolio generator saved me hours. I described my research focus, and it created a beautifully structured portfolio with perfect section hierarchy.',
    avatar: 'MC',
    gradient: 'from-emerald-500 to-cyan-500',
  },
];

const TestimonialsSection = () => (
  <SectionWrapper variant="fadeUp" className="py-24 sm:py-32 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-cyan-400 tracking-wider uppercase mb-4"
        >
          Testimonials
        </motion.p>
        <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
          Loved by{' '}
          <GradientText from="#06b6d4" via="#3b82f6" to="#7c3aed">thousands</GradientText>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Hear from students, engineers, and professionals who've transformed their careers with Portfolio Publisher.
        </p>
      </div>

      {/* Masonry testimonials grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="break-inside-avoid"
          >
            <GlassCard className="p-6">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-300 leading-relaxed mb-5">{t.quote}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-[11px] text-gray-500">{t.role}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);

export default TestimonialsSection;
