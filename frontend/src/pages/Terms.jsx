import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium mb-8 transition-colors">
          <FiArrowLeft /> Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p>
            Welcome to PORTFOLIO publisher. By accessing or using our platform, you agree to be bound by these Terms of Service.
            Please read them carefully before using our services.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By creating an account, you agree to these terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. User Accounts</h2>
          <p>
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Content Ownership</h2>
          <p>
            You retain all of your ownership rights in your content. However, by submitting content to PORTFOLIO publisher, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, display, and distribute your content solely for the purpose of operating and providing our services.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Acceptable Use</h2>
          <p>
            You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You may not upload content that is illegal, offensive, or infringes on the intellectual property rights of others.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          
          <p className="text-sm text-gray-500 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
