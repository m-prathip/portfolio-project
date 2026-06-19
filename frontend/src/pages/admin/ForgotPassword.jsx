import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import AuthShell from '../../components/admin/AuthShell';
import { FiKey, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Step 1 of password recovery: enter the registered email. Response is
// intentionally generic (no user enumeration).
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email: email.trim() });
      toast.success('If that email is registered, a code is on its way');
      navigate('/admin/reset-password', { state: { email: email.trim() } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      icon={<FiKey size={26} />}
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset code"
      footer={<Link to="/admin/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Back to sign in</Link>}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input pl-10" placeholder="you@example.com" required />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3 disabled:opacity-60">
          {loading ? 'Sending…' : 'Send reset code'}
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
