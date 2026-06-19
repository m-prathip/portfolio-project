import { useState, useRef, useEffect } from 'react';
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

  useEffect(() => { bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight); }, [messages, busy, open]);

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
      <button onClick={() => setOpen((o) => !o)} aria-label="Open assistant"
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-105">
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm h-[30rem] flex flex-col
          rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900 animate-slide-up">
          <div className="px-4 py-3 bg-primary-600 text-white flex items-center gap-2">
            <FiMessageSquare size={18} />
            <span className="font-semibold text-sm">Portfolio Assistant</span>
            <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full">AI</span>
          </div>

          <div ref={bodyRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex gap-1">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-gray-50 dark:bg-gray-900">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)}
                  className="text-xs px-2.5 py-1 rounded-full border border-primary-300 text-primary-700 dark:text-primary-300 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/30">
                  {q}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-2 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-900">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything…"
              className="flex-1 px-3 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500" />
            <button type="submit" disabled={busy}
              className="h-9 w-9 shrink-0 rounded-xl bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center disabled:opacity-50">
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AssistantWidget;
