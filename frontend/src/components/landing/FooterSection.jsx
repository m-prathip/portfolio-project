import { useState } from 'react';
import { Link } from 'react-router-dom';
import FooterModal from './FooterModal';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
    { label: 'AI Generator', href: '#' },
    { label: 'QR Codes', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'Help Center', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: 'mailto:portfoliopublisher@gmail.com' },
  ],
  Legal: [
    { label: 'Terms', href: '/terms', router: true },
    { label: 'Privacy', href: '/privacy', router: true },
    { label: 'Security', href: '#' },
  ],
};

const SOCIALS = [
  {
    label: 'Email portfoliopublisher@gmail.com',
    href: 'mailto:portfoliopublisher@gmail.com',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const FooterSection = () => {
  const [activeModal, setActiveModal] = useState(null);

  const handleLinkClick = (e, label, href, router) => {
    if (router) return;
    e.preventDefault();
    setActiveModal(label);
  };

  return (
    <footer className="relative border-t border-white/[0.05]">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-[15px] font-semibold text-white tracking-tight">
                Portfolio<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Publisher</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
              Build your professional portfolio, get a personal URL and QR code. Stand out to recruiters.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title="portfoliopublisher@gmail.com"
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] hover:border-violet-500/30 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href, router }) => (
                  <li key={label}>
                    {router ? (
                      <Link
                        to={href}
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    ) : (
                      <button
                        onClick={(e) => handleLinkClick(e, label, href, router)}
                        className="text-left text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200 w-full"
                      >
                        {label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Portfolio Publisher. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <span>Built with</span>
            <span className="text-red-400">♥</span>
            <span>for professionals worldwide</span>
          </div>
        </div>
      </div>

      {/* Footer Modal Window */}
      <FooterModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        label={activeModal}
      />
    </footer>
  );
};

export default FooterSection;
