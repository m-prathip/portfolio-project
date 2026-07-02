import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import GlassCard from './GlassCard';
import GradientText from './GradientText';

const CONTENT_MAP = {
  Documentation: {
    category: 'Resources',
    title: 'Documentation & API',
    subtitle: 'Everything you need to integrate and customize Portfolio Publisher.',
    body: (
      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span className="text-violet-400">⚡</span> Quick Start Guide
          </h4>
          <p className="text-gray-400 mb-3">
            Get your live portfolio up and running in under 5 minutes. No coding required for basic setup, with full custom CSS/JS override support for developers.
          </p>
          <div className="bg-[#0a0f24] p-3 rounded-lg border border-white/[0.05] font-mono text-xs text-cyan-300">
            {`// Embed your live portfolio via iframe or web component`}
            <br />
            {`<script src="https://cdn.portfoliopub.com/widget.v2.js"></script>`}
            <br />
            {`<portfolio-embed user="yourusername" theme="dark"></portfolio-embed>`}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Core Architecture & Features</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'ATS Resume Parser', desc: 'Automatic extraction of work history and skills from PDF resumes.' },
              { title: 'Custom Domains', desc: 'CNAME configuration with automatic Let\'s Encrypt SSL provisioning.' },
              { title: 'Webhooks & Events', desc: 'Receive real-time notifications on QR scans and recruiter views.' },
              { title: 'REST & GraphQL APIs', desc: 'Programmatically update project showcases and work experience.' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <p className="text-white font-medium text-xs mb-1">{item.title}</p>
                <p className="text-gray-500 text-[11px] leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
          <span>Version 2.4 (Latest Release)</span>
          <a href="#api" className="text-violet-400 hover:text-violet-300 font-medium">View Full API Docs →</a>
        </div>
      </div>
    ),
  },
  Blog: {
    category: 'Resources',
    title: 'Portfolio Publisher Blog',
    subtitle: 'Insights, career advice, and engineering stories from our team.',
    body: (
      <div className="space-y-4">
        {[
          {
            tag: 'Career Growth',
            date: 'July 2, 2026',
            read: '5 min read',
            title: 'Why 85% of Tech Recruiters Prefer Interactive Portfolios over Static PDFs',
            excerpt: 'We surveyed over 400 hiring managers across Fortune 500 tech companies. Here is what makes a candidate stand out in the first 3 seconds of review.',
            gradient: 'from-violet-500 to-pink-500',
          },
          {
            tag: 'Engineering',
            date: 'June 18, 2026',
            read: '8 min read',
            title: 'How We Built a 60-Second AI Portfolio Generator using Custom LLM Pipelines',
            excerpt: 'A deep dive into our prompt orchestration, ATS semantic parsing, and instant layout generation architecture serving 10,000+ daily builds.',
            gradient: 'from-blue-500 to-cyan-500',
          },
          {
            tag: 'Design Trends',
            date: 'May 29, 2026',
            read: '4 min read',
            title: 'The Art of Glassmorphism & Motion Design in Personal Branding',
            excerpt: 'Why subtle animations, curated typography, and spatial lighting create instant trust and premium credibility for job seekers and freelancers.',
            gradient: 'from-amber-500 to-pink-500',
          },
        ].map((post, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all duration-200 cursor-pointer group">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r ${post.gradient}`}>
                {post.tag}
              </span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.read}</span>
            </div>
            <h4 className="text-white font-semibold text-base mb-1 group-hover:text-violet-300 transition-colors duration-200">
              {post.title}
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed">{post.excerpt}</p>
          </div>
        ))}
      </div>
    ),
  },
  Changelog: {
    category: 'Resources',
    title: 'Platform Changelog',
    subtitle: 'New features, performance enhancements, and regular platform updates.',
    body: (
      <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-3 before:w-0.5 before:bg-white/[0.1]">
        {[
          {
            ver: 'v2.4.0',
            date: 'July 1, 2026',
            badge: 'Latest Release',
            badgeColor: 'bg-green-500/10 text-green-400 border-green-500/20',
            items: [
              'Launched AI Portfolio Generator with plain-text bio parsing.',
              'Added 3D perspective tilt hover effects to portfolio preview showcases.',
              'Improved ATS resume export formatting for multi-page documents.',
            ],
          },
          {
            ver: 'v2.3.2',
            date: 'June 14, 2026',
            badge: 'Performance',
            badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            items: [
              'Optimized particle canvas rendering to maintain 60 FPS across mobile devices.',
              'Reduced production bundle gzipped size by 28% with tree-shaking.',
              'Added instant QR code SVG/PNG download format options.',
            ],
          },
          {
            ver: 'v2.2.0',
            date: 'May 20, 2026',
            badge: 'Feature',
            badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
            items: [
              'Introduced 4 new industry templates: Dev Terminal, Creative Flow, Corporate Edge, and Minimal Pro.',
              'Added Recruiter View analytics tracking unique sessions and device breakdowns.',
            ],
          },
        ].map((release, i) => (
          <div key={i} className="pl-8 relative">
            <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-violet-500 border-2 border-[#050816]" />
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-bold text-sm font-mono">{release.ver}</span>
              <span className="text-xs text-gray-500">{release.date}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${release.badgeColor}`}>
                {release.badge}
              </span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-gray-300 text-xs leading-relaxed">
              {release.items.map((item, j) => (
                <li key={j} className="text-gray-400">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  'Help Center': {
    category: 'Resources',
    title: '24/7 Help Center & Support',
    subtitle: 'Find answers, read tutorials, or connect directly with our engineering support team.',
    body: (
      <div className="space-y-6">
        {/* Search bar mockup */}
        <div className="relative">
          <input
            type="text"
            readOnly
            placeholder="Search for articles, guides, or troubleshooting tips..."
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
            value="How do I connect my custom domain?"
          />
          <button className="absolute right-2 top-2 px-3 py-1 bg-violet-600 rounded-lg text-xs font-semibold text-white">
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { q: 'Connecting Custom Domains', ans: 'Learn how to point your CNAME records and verify DNS propagation in under 10 minutes.' },
            { q: 'AI Generator Prompting Tips', ans: 'Best practices for writing plain-text summaries that generate award-winning layouts.' },
            { q: 'ATS Resume Export Guide', ans: 'How to structure headings and skills so applicant tracking systems score you 95%+.' },
            { q: 'Analytics & Visitor Tracking', ans: 'Understanding unique views, QR code scan geolocations, and session durations.' },
          ].map((faq, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-violet-500/30 transition-colors duration-200 cursor-pointer">
              <p className="text-white font-semibold text-xs mb-1 flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="text-violet-400">→</span>
              </p>
              <p className="text-gray-400 text-[11px] leading-normal">{faq.ans}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-900/40 to-blue-900/40 border border-violet-500/20 flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-semibold">Need personalized support?</p>
            <p className="text-gray-300 text-xs">Our engineering team responds within 2 hours.</p>
          </div>
          <a
            href="mailto:portfoliopublisher@gmail.com"
            className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold text-xs hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    ),
  },
  About: {
    category: 'Company',
    title: 'About Portfolio Publisher',
    subtitle: 'We are on a mission to democratize premium personal branding for professionals worldwide.',
    body: (
      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <p>
          Founded in 2025, Portfolio Publisher started with a simple observation: talented software engineers, students, and designers were losing job opportunities not because they lacked skills, but because traditional PDF resumes failed to showcase their actual interactive work.
        </p>
        <p>
          We built an automated platform combining world-class UI/UX design, instant AI content generation, and universal accessibility through personal URLs and physical QR codes.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/[0.06] text-center">
          <div>
            <span className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">10,000+</span>
            <span className="text-xs text-gray-500">Active Portfolios</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">99.99%</span>
            <span className="text-xs text-gray-500">Platform Uptime</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">14+</span>
            <span className="text-xs text-gray-500">Countries Served</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            PP
          </div>
          <div>
            <p className="text-white font-semibold text-xs">Built for Creators, by Creators</p>
            <p className="text-gray-400 text-[11px]">We believe everyone deserves a digital presence that looks like it cost $100,000 to design.</p>
          </div>
        </div>
      </div>
    ),
  },
  Careers: {
    category: 'Company',
    title: 'Join Our Team',
    subtitle: 'Build the future of personal branding. We are a 100% distributed, global remote team.',
    body: (
      <div className="space-y-6">
        {/* Perks */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🌍', title: 'Work Anywhere', desc: '100% remote across all time zones.' },
            { icon: '🏖️', title: 'Unlimited PTO', desc: 'Flexible time off and wellness days.' },
            { icon: '💻', title: 'Top Gear', desc: '$3,000 workstation & hardware setup stipend.' },
          ].map((perk, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
              <span className="text-lg block mb-1">{perk.icon}</span>
              <p className="text-white font-semibold text-xs">{perk.title}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{perk.desc}</p>
            </div>
          ))}
        </div>

        {/* Open positions */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Open Roles (3)</h4>
          <div className="space-y-2.5">
            {[
              { role: 'Senior Frontend Engineer (React/Framer)', dept: 'Engineering', loc: 'Remote (Global)', type: 'Full-time' },
              { role: 'Staff AI Research Engineer (LLM Pipelines)', dept: 'AI / ML', loc: 'Remote (US/EU)', type: 'Full-time' },
              { role: 'Lead Product Designer (UI/UX Motion)', dept: 'Design', loc: 'Remote (Global)', type: 'Full-time' },
            ].map((pos, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-xs">{pos.role}</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">{pos.dept} • {pos.loc}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  Apply Now →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  Security: {
    category: 'Legal',
    title: 'Enterprise Security & Compliance',
    subtitle: 'We protect your professional data with industry-leading encryption and strict compliance standards.',
    body: (
      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '🔒', title: 'SOC 2 Type II Certified', desc: 'Our infrastructure undergoes annual independent audits verifying controls for security, confidentiality, and availability.' },
            { icon: '🛡️', title: 'End-to-End Encryption', desc: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 block-level encryption.' },
            { icon: '🇪🇺', title: 'GDPR & CCPA Compliant', desc: 'Full adherence to global privacy laws. Users retain 100% ownership and immediate deletion rights over their data.' },
            { icon: '🤖', title: 'AI Privacy Guarantee', desc: 'Your portfolio data and prompts are NEVER used to train public foundational AI models without explicit consent.' },
          ].map((sec, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-xl block mb-2">{sec.icon}</span>
              <h4 className="text-white font-semibold text-xs mb-1">{sec.title}</h4>
              <p className="text-gray-400 text-[11px] leading-normal">{sec.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-green-500/[0.04] border border-green-500/20 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <p className="text-xs text-green-300">
            <strong>System Status:</strong> All security systems operational. Zero security breaches or data leaks since inception.
          </p>
        </div>
      </div>
    ),
  },
  Features: {
    category: 'Product',
    title: 'Platform Features Overview',
    subtitle: 'Explore the powerful tools built into every Portfolio Publisher account.',
    body: (
      <div className="space-y-4">
        {[
          { title: 'One Link Everywhere', desc: 'Generate your clean personal URL (portfoliopub.com/u/yourname) instantly upon publishing.' },
          { title: 'Dynamic Self-Drawing QR Code', desc: 'High-resolution vector QR code ready for business cards, resumes, and networking events.' },
          { title: 'Real-Time Analytics Dashboard', desc: 'Track unique visitors, device breakdowns, and top-performing portfolio sections in real time.' },
          { title: 'ATS-Friendly Resume Builder', desc: 'Export your interactive portfolio as a cleanly structured, recruiter-ready PDF resume.' },
        ].map((feat, i) => (
          <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3">
            <span className="text-violet-400 font-bold">✓</span>
            <div>
              <p className="text-white font-semibold text-xs">{feat.title}</p>
              <p className="text-gray-400 text-[11px] mt-0.5">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  Templates: {
    category: 'Product',
    title: 'Template Gallery Architecture',
    subtitle: 'Professionally crafted, responsive themes designed for maximum visual impact.',
    body: (
      <div className="space-y-4 text-sm text-gray-300">
        <p>
          Every template in our library is engineered from the ground up using modern design systems — incorporating glassmorphism, responsive typography, and subtle micro-animations.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {['Dev Terminal', 'Creative Flow', 'Corporate Edge', 'Minimal Pro', 'AI Research', 'Exec Suite'].map((t, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
              <span className="text-white font-medium text-xs">{t}</span>
              <span className="block text-[10px] text-gray-500 mt-0.5">Customizable & ATS Ready</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  'AI Generator': {
    category: 'Product',
    title: '60-Second AI Portfolio Engine',
    subtitle: 'Transform plain text into an award-winning personal website instantly.',
    body: (
      <div className="space-y-4 text-sm text-gray-300">
        <p>
          Our proprietary LLM pipeline parses your bio, LinkedIn summary, or project notes to automatically generate semantic HTML sections, color palettes, and interactive showcases.
        </p>
        <div className="p-4 rounded-xl bg-violet-500/[0.05] border border-violet-500/20 text-xs">
          <p className="text-violet-300 font-semibold mb-1">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-400">
            <li>Paste your professional summary or upload your resume.</li>
            <li>Select your target job role and desired aesthetic theme.</li>
            <li>AI builds structure, populates content, and deploys your live link in 60s.</li>
          </ol>
        </div>
      </div>
    ),
  },
  'QR Codes': {
    category: 'Product',
    title: 'Universal QR Code System',
    subtitle: 'Bridge the gap between your physical resume and live interactive portfolio.',
    body: (
      <div className="space-y-4 text-sm text-gray-300">
        <p>
          Every published portfolio automatically gets a dedicated, high-contrast QR code optimized for rapid camera scanning in lighting conditions ranging from conference halls to dimly lit networking events.
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <p className="text-white font-medium">Vector Exports</p>
            <p className="text-gray-500 text-[11px] mt-0.5">Download as SVG or 300-DPI PNG for print.</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <p className="text-white font-medium">Scan Tracking</p>
            <p className="text-gray-500 text-[11px] mt-0.5">See exact timestamps when recruiters scan.</p>
          </div>
        </div>
      </div>
    ),
  },
  Contact: {
    category: 'Company',
    title: 'Get in Touch',
    subtitle: 'We would love to hear from you. Here is how to reach our team.',
    body: (
      <div className="space-y-4 text-sm text-gray-300">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-xs">General Support & Inquiries</p>
            <p className="text-gray-400 text-xs">portfoliopublisher@gmail.com</p>
          </div>
          <a
            href="mailto:portfoliopublisher@gmail.com"
            className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500 transition-colors"
          >
            Send Email
          </a>
        </div>
        <p className="text-xs text-gray-500 text-center">
          Our global support team operates 24/7. Average response time is under 2 hours.
        </p>
      </div>
    ),
  },
};

const FooterModal = ({ isOpen, onClose, label }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const data = CONTENT_MAP[label] || {
    category: 'Information',
    title: label,
    subtitle: 'Learn more about Portfolio Publisher.',
    body: <p className="text-gray-400 text-sm">Detailed information regarding {label} will be available shortly.</p>,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
          className="relative z-10 w-full max-w-2xl bg-[#080d24] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

          {/* Modal Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-start justify-between bg-white/[0.02]">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-2 inline-block">
                {data.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">{data.title}</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{data.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.1] transition-colors flex-shrink-0 ml-4"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {data.body}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between text-xs text-gray-500">
            <span>Portfolio Publisher • Official Documentation</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white font-medium transition-colors"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FooterModal;
