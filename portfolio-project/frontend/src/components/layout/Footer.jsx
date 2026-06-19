import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

const Footer = ({ profile }) => {
  const year = new Date().getFullYear();
  const social = profile?.social || {};

  const icons = [
    { key: 'github', icon: <FiGithub size={18} />, label: 'GitHub' },
    { key: 'linkedin', icon: <FiLinkedin size={18} />, label: 'LinkedIn' },
    { key: 'twitter', icon: <FiTwitter size={18} />, label: 'Twitter' },
    { key: 'instagram', icon: <FiInstagram size={18} />, label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Personal Info & Contact Email */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {year} {profile?.name || 'Portfolio'}. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
              <FiMail size={14} className="text-gray-400" />
              <span>Questions or Support:</span>
              <a 
                href={`mailto:${profile?.email || 'contact.prathip@gmail.com'}`} 
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                {profile?.email || 'contact.prathip@gmail.com'}
              </a>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {icons.map(s => social[s.key] && (
              <a key={s.key} href={social[s.key]} target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Promotion Link */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Build your own portfolio link &amp; QR code —{' '}
          <Link to="/admin/signup" className="hover:text-primary-600 dark:hover:text-primary-400 underline">
            get started free
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;