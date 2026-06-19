import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import AuthShell from '../../components/admin/AuthShell';
import OtpInput from '../../components/common/OtpInput';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Email-verification step after signup. Email is passed via router state
// (or ?email=) so a refresh keeps context.
const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = location.state?.email || params.get('email') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!email) navigate('/admin/signup', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    timer.current = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer.current);
  }, [cooldown]);

  const submit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return toast.error('Enter the 6-digit code');
    setLoading(true);
    try {
      await verifyEmail(email, code);
      toast.success('Email verified — welcome!');
      navigate('/admin/share', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    try {
      await authAPI.resendOtp({ email, purpose: 'verify' });
      toast.success('A new code is on its way');
      setCooldown(60);
    } catch (err) {
      const wait = err.response?.data?.retryAfter;
      if (wait) setCooldown(wait);
      toast.error(err.response?.data?.message || 'Could not resend code');
    }
  };

  return (
    <AuthShell
      icon={<FiMail size={28} />}
      title="Verify your email"
      subtitle={<>We sent a 6-digit code to <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span></>}
      footer={<Link to="/admin/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Back to sign in</Link>}
    >
      <form onSubmit={submit} className="space-y-6">
        <OtpInput value={code} onChange={setCode} />
        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3 disabled:opacity-60">
          {loading ? 'Verifying…' : 'Verify & continue'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
        Didn't get it?{' '}
        <button onClick={resend} disabled={cooldown > 0}
          className="text-primary-600 dark:text-primary-400 font-medium hover:underline disabled:opacity-50 disabled:no-underline">
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      </p>
    </AuthShell>
  );
};

export default VerifyEmail;
