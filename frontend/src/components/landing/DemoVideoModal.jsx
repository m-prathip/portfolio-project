import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiCheckCircle, FiPlay, FiAward, FiShield, FiZap } from 'react-icons/fi';

const DemoVideoModal = ({ isOpen, onClose }) => {
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 24 }}
          transition={{ type: 'spring', duration: 0.55, bounce: 0.15 }}
          className="relative z-10 w-full max-w-5xl bg-[#070b19] border border-violet-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-white"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.08] bg-black/60">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <FiPlay className="text-violet-400" /> 10-Second Live Portfolio Demo Video
              </span>
              <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[11px] text-violet-300 font-mono">
                Powered by Home.jsx
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.1] transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Video / Animated WebP Showcase Area */}
          <div className="p-4 sm:p-6 bg-[#030611] flex-1 overflow-y-auto flex flex-col items-center justify-center relative">
            <div className="relative w-full rounded-xl overflow-hidden border border-white/[0.1] shadow-[0_0_40px_rgba(124,58,237,0.15)] bg-black group">
              {/* Animated WebP Video Recording */}
              <img
                src="/portfolio_home_demo.webp"
                alt="10-Second Portfolio Home.jsx Demo Video"
                className="w-full h-auto max-h-[65vh] object-contain mx-auto"
              />

              {/* Overlay pulse indicator */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 border border-red-500/40 backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] text-red-400 font-mono uppercase tracking-wider font-bold">Live Recording (10s Loop)</span>
              </div>
            </div>

            {/* Features Highlight Bar below video */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6">
              {[
                { icon: <FiZap className="text-amber-400" />, label: '3D AI Neural Network', desc: 'Interactive floating nodes & edges' },
                { icon: <FiAward className="text-violet-400" />, label: 'AI Skills Engine', desc: 'Auto-categorized React & ML icons' },
                { icon: <FiShield className="text-cyan-400" />, label: 'ATS Executive Timeline', desc: '99% parse score resume view' },
                { icon: <FiCheckCircle className="text-green-400" />, label: 'Instant Verified URL', desc: 'portfoliopublisher@gmail.com contact' },
              ].map((feat, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                    {feat.icon}
                    <span>{feat.label}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-tight">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-5 border-t border-white/[0.08] bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="text-violet-400 font-bold">Want to test it interactively?</span>
              <span>You can visit the live interactive demo route directly.</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/u/demo"
                onClick={onClose}
                target="_blank"
                className="px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <span>Try Live Interactive Demo (/u/demo)</span>
                <FiExternalLink />
              </Link>
              <Link
                to="/admin/signup"
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all text-center w-full sm:w-auto"
              >
                Create My Free Portfolio Now →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DemoVideoModal;
