import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthShell from '../../components/admin/AuthShell';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '', remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const res = await login(form.identifier, form.password, form.remember);
      if (res.requiresVerification) {
        toast('Please verify your email to continue', { icon: '✉️' });
        return navigate('/admin/verify-email', { state: { email: res.email } });
      }
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.requiresVerification) {
        toast('Please verify your email first', { icon: '✉️' });
        return navigate('/admin/verify-email', { state: { email: data.email } });
      }
      toast.error(data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      icon={<FiLock size={28} />}
      title="Welcome Back"
      subtitle="Sign in to manage your portfolio"
      footer={<>New here?{' '}
        <Link to="/admin/signup" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Create your portfolio</Link>
      </>}
    >
      <form onSubmit={handle} className="space-y-5">
        <div>
          <label className="label">Email or Username</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
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
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer select-none">
            <input type="checkbox" checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            Remember me
          </label>
          <Link to="/admin/forgot-password" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </AuthShell>
  );
};

export default AdminLogin;
