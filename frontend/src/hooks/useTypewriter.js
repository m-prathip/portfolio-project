import { useState, useEffect } from 'react';

export default function useTypewriter(
  words = ['Software Developer'],
  {
    typeMs = 80,
    deleteMs = 40,
    pauseMs = 1400
  } = {}
) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const safeWords =
    Array.isArray(words) && words.length
      ? words
      : ['Software Developer'];

  useEffect(() => {
    const currentWord = safeWords[index];

    let timeout;

    if (!deleting) {
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, typeMs);
      } else {
        timeout = setTimeout(() => {
          setDeleting(true);
        }, pauseMs);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1));
        }, deleteMs);
      } else {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % safeWords.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, safeWords, typeMs, deleteMs, pauseMs]);

  return text;
}