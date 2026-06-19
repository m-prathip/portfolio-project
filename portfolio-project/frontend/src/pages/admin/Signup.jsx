import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiSun, FiMoon } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

// Mirrors the backend's USERNAME_REGEX in models/User.js
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

const AdminSignup = () => {
  const { register } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null | checking | available | taken | invalid
  const checkTimer = useRef(null);

  useEffect(() => {
    const username = form.username;
    clearTimeout(checkTimer.current);
    if (!username) { setUsernameStatus(null); return; }
    if (!USERNAME_PATTERN.test(username)) { setUsernameStatus('invalid'); return; }

    setUsernameStatus('checking');
    checkTimer.current = setTimeout(() => {
      authAPI.checkUsername(username)
        .then(res => setUsernameStatus(res.data.available ? 'available' : 'taken'))
        .catch(() => setUsernameStatus(null));
    }, 450);

    return () => clearTimeout(checkTimer.current);
  }, [form.username]);

  const handle = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error('Please fill all fields');
    if (usernameStatus === 'taken') return toast.error('That username is already taken');
    if (usernameStatus === 'invalid') return toast.error('Choose a valid username first');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await register(form.username, form.email.trim(), form.password);
      toast.success('Your portfolio is ready!');
      navigate('/admin/share');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create your account');
    } finally {
      setLoading(false);
    }
  };

  const usernameHint = {
    checking: { text: 'Checking availability…', cls: 'text-gray-400' },
    available: { text: 'Available', cls: 'text-green-600 dark:text-green-400' },
    taken: { text: 'Already taken', cls: 'text-red-500' },
    invalid: { text: '3-30 chars: lowercase letters, numbers, hyphens', cls: 'text-red-500' }
  }[usernameStatus];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <button onClick={toggle} className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 shadow">
        {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiUser size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Portfolio</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Get a shareable link and QR code in seconds</p>
          </div>

          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={form.username}
                  onChange={e => setForm({...form, username: e.target.value.toLowerCase()})}
                  className="input pl-10" placeholder="jane-doe" required />
              </div>
              <p className="text-xs mt-1.5 text-gray-400 truncate">
                {typeof window !== 'undefined' ? window.location.origin : ''}/u/{form.username || 'username'}
              </p>
              {usernameHint && <p className={`text-xs mt-1 ${usernameHint.cls}`}>{usernameHint.text}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="input pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pl-10 pr-10" placeholder="At least 6 characters" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input type={showPwd ? 'text' : 'password'} value={form.confirm}
                onChange={e => setForm({...form, confirm: e.target.value})}
                className="input" placeholder="Re-enter your password" required />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Creating your portfolio...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/admin/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
