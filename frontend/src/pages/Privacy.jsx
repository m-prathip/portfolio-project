import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium mb-8 transition-colors">
          <FiArrowLeft /> Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p>
            At PORTFOLIO publisher, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you create an account, such as your name, email address, and the content you upload to build your portfolio (including text, images, and links).
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our platform</li>
            <li>Create and display your public portfolio</li>
            <li>Improve, personalize, and expand our services</li>
            <li>Communicate with you regarding updates, support, or security alerts</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Information Sharing</h2>
          <p>
            Your portfolio content is public by design and intended to be shared. We do not sell your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business, as long as those parties agree to keep this information confidential.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is ever completely secure or error-free.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time through your account settings. If you wish to permanently delete your account and all associated data, you may do so or contact our support team.
          </p>
          
          <p className="text-sm text-gray-500 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
