import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import AuthShell from '../../components/admin/AuthShell';
import PasswordStrength, { isStrongPassword } from '../../components/common/PasswordStrength';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Mirrors the backend's USERNAME_REGEX in models/User.js
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

const AdminSignup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null|checking|available|taken|invalid
  const checkTimer = useRef(null);

  useEffect(() => {
    const username = form.username;
    clearTimeout(checkTimer.current);
    if (!username) { setUsernameStatus(null); return; }
    if (!USERNAME_PATTERN.test(username)) { setUsernameStatus('invalid'); return; }
    setUsernameStatus('checking');
    checkTimer.current = setTimeout(() => {
      authAPI.checkUsername(username)
        .then((res) => setUsernameStatus(res.data.available ? 'available' : 'taken'))
        .catch(() => setUsernameStatus(null));
    }, 450);
    return () => clearTimeout(checkTimer.current);
  }, [form.username]);

  const handle = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error('Please fill all fields');
    if (usernameStatus === 'taken') return toast.error('That username is already taken');
    if (usernameStatus === 'invalid') return toast.error('Choose a valid username first');
    if (!isStrongPassword(form.password)) return toast.error('Password does not meet the requirements');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const res = await register(form.username, form.email.trim(), form.password);
      toast.success('Account created — verify your email');
      navigate('/admin/verify-email', { state: { email: res.email || form.email.trim() } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create your account');
    } finally {
      setLoading(false);
    }
  };

  const hint = {
    checking: { text: 'Checking availability…', cls: 'text-gray-400', icon: null },
    available: { text: 'Available', cls: 'text-green-600 dark:text-green-400', icon: <FiCheckCircle size={14} /> },
    taken: { text: 'Already taken', cls: 'text-red-500', icon: <FiXCircle size={14} /> },
    invalid: { text: '3-30 chars: lowercase letters, numbers, hyphens', cls: 'text-red-500', icon: <FiXCircle size={14} /> }
  }[usernameStatus];

  return (
    <AuthShell
      icon={<FiUser size={28} />}
      title="Create Your Portfolio"
      subtitle="Get a shareable link and QR code in seconds"
      footer={<>Already have an account?{' '}
        <Link to="/admin/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign in</Link>
      </>}
    >
      <form onSubmit={handle} className="space-y-5">
        <div>
          <label className="label">Username</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
              className="input pl-10" placeholder="jane-doe" required />
          </div>
          {hint && <p className={`mt-1 flex items-center gap-1 text-xs ${hint.cls}`}>{hint.icon}{hint.text}</p>}
          <p className="mt-1 text-xs text-gray-400">Your portfolio: <span className="font-mono">/u/{form.username || 'username'}</span></p>
        </div>

        <div>
          <label className="label">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input pl-10" placeholder="you@example.com" required />
          </div>
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type={showPwd ? 'text' : 'password'} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input pl-10 pr-10" placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          <PasswordStrength password={form.password} />
        </div>

        <div>
          <label className="label">Confirm Password</label>
          <input type={showPwd ? 'text' : 'password'} value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="input" placeholder="Re-enter your password" required />
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Creating your account…' : 'Create Account'}
        </button>
      </form>
    </AuthShell>
  );
};

export default AdminSignup;
