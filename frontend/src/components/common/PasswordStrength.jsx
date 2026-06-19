import { FiCheck, FiX } from 'react-icons/fi';

// Mirrors backend models/User.js PASSWORD_REGEX rules.
export const passwordChecks = (pwd = '') => ({
  length: pwd.length >= 8,
  lower: /[a-z]/.test(pwd),
  upper: /[A-Z]/.test(pwd),
  number: /\d/.test(pwd),
  special: /[^A-Za-z0-9]/.test(pwd)
});

export const isStrongPassword = (pwd) =>
  Object.values(passwordChecks(pwd)).every(Boolean);

export const passwordScore = (pwd) =>
  Object.values(passwordChecks(pwd)).filter(Boolean).length;

const LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
const BAR = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

const RULES = [
  ['length', 'At least 8 characters'],
  ['upper', 'One uppercase letter'],
  ['lower', 'One lowercase letter'],
  ['number', 'One number'],
  ['special', 'One special character']
];

const PasswordStrength = ({ password = '' }) => {
  if (!password) return null;
  const checks = passwordChecks(password);
  const score = Object.values(checks).filter(Boolean).length;
  const idx = Math.max(0, score - 1);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i < score ? BAR[idx] : 'bg-gray-200 dark:bg-gray-700'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${score >= 4 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {LABELS[idx]}
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
        {RULES.map(([key, label]) => (
          <li key={key} className={`flex items-center gap-1.5 text-xs ${checks[key] ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            {checks[key] ? <FiCheck size={13} /> : <FiX size={13} />}
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrength;
