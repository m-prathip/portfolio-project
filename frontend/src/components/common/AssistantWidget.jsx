import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioAPI } from '../../services/api';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const QUICK = [
  'Tell me about the developer',
  'What are their top skills?',
  'Show their projects',
  'Work experience?',
  'How can I contact them?'
];

// Floating AI assistant for recruiters (Phase 10). Talks to the backend
// /assistant endpoint (OpenAI when configured, offline fallback otherwise).
const AssistantWidget = ({ username, name }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm ${name || 'the'} portfolio assistant 🤖 — ask me anything about ${name ? name.split(' ')[0] + "'s" : 'their'} skills, projects or experience.` }
  ]);
  const bodyRef = useRef(null);

  // Cycling recruiter-focused inviting labels
  const labels = [
    "💼 Ask about my skills & experience",
    "🚀 Let's discuss your next project",
    "💬 Ask Me Anything"
  ];
  const [labelIndex, setLabelIndex] = useState(0);
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => { bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight); }, [messages, busy, open]);

  useEffect(() => {
    // Cycle every 2.6 seconds (transitioning labels over the first 8 seconds)
    const interval = setInterval(() => {
      setLabelIndex((prev) => {
        if (prev < labels.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 2600);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setLabelIndex(labels.length - 1); // land on final "💬 Ask Me Anything"
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput('');
    const history = messages.slice(-6);
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setBusy(true);
    try {
      const { data } = await portfolioAPI.ask(username, { message: q, history });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: "Sorry, I couldn't answer that right now. Try the contact form below." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Cycling Label Speech Bubble */}
      <AnimatePresence>
        {!open && showLabel && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed bottom-[22px] right-20 z-50 bg-accent text-white dark:text-black text-xs font-bold px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap flex items-center gap-2 border border-accent/30"
          >
            <span>{labels[labelIndex]}</span>
            <button onClick={() => setShowLabel(false)} className="hover:text-red-750 ml-1 transition-colors text-white/70 dark:text-black/60 hover:text-white dark:hover:text-black">
              <FiX size={13} />
            </button>
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-accent" />
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen((o) => !o)} aria-label="Open assistant"
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-accent hover:opacity-90 text-white dark:text-black shadow-2xl flex items-center justify-center transition-transform hover:scale-105">
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm h-[30rem] flex flex-col
          rounded-2xl overflow-hidden shadow-2xl border border-gray-250 dark:border-slate-800
          bg-white dark:bg-slate-900 animate-slide-up">
          <div className="px-4 py-3 bg-accent text-white dark:text-black flex items-center gap-2 font-bold">
            <FiMessageSquare size={18} />
            <span className="font-extrabold text-sm">Portfolio Assistant</span>
            <span className="ml-auto text-[10px] bg-black/10 px-2 py-0.5 rounded-full border border-black/10">AI</span>
          </div>

          <div ref={bodyRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-slate-950">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-accent text-white dark:text-black font-semibold rounded-br-sm'
                    : 'bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 border border-black/5 dark:border-white/5 rounded-bl-sm shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 flex gap-1">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-gray-50 dark:bg-slate-950">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-accent/30 text-gray-700 dark:text-gray-300 dark:border-slate-800 hover:bg-accent/10 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-2 border-t border-gray-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything…"
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-accent border border-transparent" />
            <button type="submit" disabled={busy}
              className="h-9 w-9 shrink-0 rounded-xl bg-accent hover:opacity-90 text-white dark:text-black flex items-center justify-center disabled:opacity-50 transition-colors">
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AssistantWidget;
