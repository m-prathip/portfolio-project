import { useRef } from 'react';

// 6-box OTP input with paste support and auto-advance.
const OtpInput = ({ value = '', onChange, length = 6 }) => {
  const refs = useRef([]);
  const chars = value.padEnd(length, ' ').slice(0, length).split('');

  const setChar = (i, ch) => {
    const next = value.split('');
    next[i] = ch;
    onChange(next.join('').replace(/\s/g, '').slice(0, length));
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !chars[i].trim() && i > 0) refs.current[i - 1]?.focus();
  };

  const handleInput = (i, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) { setChar(i, ' '); return; }
    setChar(i, digit);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          value={chars[i].trim()}
          onChange={(e) => handleInput(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-full aspect-square text-center text-xl font-bold rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      ))}
    </div>
  );
};

export default OtpInput;
