import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import GradientText from './GradientText';

const FAQS = [
  {
    q: 'Is Portfolio Publisher really free to use?',
    a: 'Yes! The free plan includes a complete portfolio page, personal URL, QR code, and basic templates. You can upgrade to Pro anytime for advanced features like AI generation, analytics, and custom domains.',
  },
  {
    q: 'How long does it take to create a portfolio?',
    a: 'Most users have a polished, professional portfolio live in under 10 minutes. With the AI portfolio generator (Pro plan), it takes under 60 seconds — just describe yourself and we handle the rest.',
  },
  {
    q: 'Can I use my own custom domain?',
    a: 'Absolutely. Pro and Team plans support custom domains. You can connect your own domain (e.g., alexchen.com) and we handle SSL certificates, routing, and DNS configuration.',
  },
  {
    q: 'Is my portfolio optimized for ATS systems?',
    a: 'Yes. All portfolios and exported resumes are ATS-optimized with proper heading structure, semantic HTML, and clean formatting that applicant tracking systems can parse easily.',
  },
  {
    q: 'Can recruiters see my analytics?',
    a: 'No. Analytics are private and only visible to you. Recruiters see your beautifully designed portfolio — you see the data behind it (views, visitor locations, top sections, etc.).',
  },
  {
    q: 'What happens if I cancel my Pro subscription?',
    a: 'Your portfolio stays live on the free plan. You keep your personal URL and QR code. Premium features like analytics and custom domains will be paused until you reactivate.',
  },
  {
    q: 'Can I export my resume as a PDF?',
    a: 'Yes. Pro users can export their portfolio content as a beautifully formatted PDF resume with one click. Choose from multiple ATS-friendly resume templates.',
  },
  {
    q: 'Do you support team accounts?',
    a: 'Yes! The Team plan supports up to 50 members with a centralized dashboard, custom branding, and recruiter-specific analytics. Perfect for bootcamps, universities, and companies.',
  },
];

const FAQItem = ({ faq, index, isOpen, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.06 }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 text-left group"
    >
      <span className="text-[15px] font-medium text-white group-hover:text-violet-300 transition-colors duration-200 pr-8">
        {faq.q}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        className="w-6 h-6 rounded-full border border-white/[0.1] flex items-center justify-center flex-shrink-0 group-hover:border-violet-500/30 transition-colors duration-200"
      >
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <p className="text-sm text-gray-400 leading-relaxed pb-5 pr-12">
            {faq.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
    <div className="h-[1px] bg-white/[0.05]" />
  </motion.div>
);

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <SectionWrapper id="faq" variant="fadeUp" className="py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-cyan-400 tracking-wider uppercase mb-4"
          >
            FAQ
          </motion.p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-[-0.02em] mb-5">
            Frequently asked{' '}
            <GradientText from="#06b6d4" via="#3b82f6" to="#7c3aed">questions</GradientText>
          </h2>
        </div>

        {/* FAQ items */}
        <div>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default FAQSection;
