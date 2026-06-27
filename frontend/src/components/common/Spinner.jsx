import { useState, useEffect } from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-200 border-t-primary-600`} />
    </div>
  );
};

export const PageLoader = () => {
  const [showWakeupText, setShowWakeupText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWakeupText(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 text-center">
      <div className="relative flex items-center justify-center mb-6">
        {/* Soft pulsing glow behind spinner */}
        <div className="absolute w-16 h-16 rounded-full bg-primary-500/10 dark:bg-primary-400/5 animate-pulse" />
        <div className="w-12 h-12 rounded-full border-4 border-gray-100 dark:border-gray-800 border-t-primary-600 dark:border-t-primary-400 animate-spin" />
      </div>
      
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 tracking-wide animate-pulse">
        Loading Portfolio...
      </h3>
      
      {showWakeupText && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed animate-fade-in">
          Waking up the server. This may take up to a minute on Render's free hosting plan. Thank you for your patience!
        </p>
      )}
    </div>
  );
};

export default Spinner;
