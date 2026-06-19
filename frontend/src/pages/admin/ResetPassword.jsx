import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import AuthShell from '../../components/admin/AuthShell';
import OtpInput from '../../components/common/OtpInput';
import PasswordStrength, { isStrongPassword } from '../../components/common/PasswordStrength';
import { FiShield, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Steps 2-3 of password recovery: verify OTP, then set a new password.
// On success the user is auto-logged-in (token returned by the backend).
const ResetPassword = () => {
  const { completeSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [step, setStep] = useState('otp'); // 'otp' | 'password'
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!email) navigate('/admin/forgot-password', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    timer.current = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer.current);
  }, [cooldown]);

  const verifyCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return toast.error('Enter the 6-digit code');
    setLoading(true);
    try {
      const { data } = await authAPI.verifyResetOtp({ email, code });
      setResetToken(data.resetToken);
      setStep('password');
      toast.success('Code verified — set a new password');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    try {
      await authAPI.resendOtp({ email, purpose: 'reset' });
      toast.success('A new code is on its way');
      setCooldown(60);
    } catch (err) {
      const wait = err.response?.data?.retryAfter;
      if (wait) setCooldown(wait);
      toast.error(err.response?.data?.message || 'Could not resend');
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(pwd)) return toast.error('Password does not meet the requirements');
    if (pwd !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await authAPI.resetPassword({ resetToken, password: pwd });
      completeSession(data); // auto-login
      toast.success('Password updated — you are signed in');
      navigate('/admin/profile', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      icon={<FiShield size={26} />}
      title="Reset your password"
      subtitle={step === 'otp'
        ? <>Enter the code we sent to <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span></>
        : 'Choose a strong new password'}
      footer={<Link to="/admin/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Back to sign in</Link>}
    >
      {step === 'otp' ? (
        <>
          <form onSubmit={verifyCode} className="space-y-6">
            <OtpInput value={code} onChange={setCode} />
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-60">
              {loading ? 'Verifying…' : 'Verify code'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Didn't get it?{' '}
            <button onClick={resend} disabled={cooldown > 0}
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline disabled:opacity-50 disabled:no-underline">
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </p>
        </>
      ) : (
        <form onSubmit={submitPassword} className="space-y-5">
          <div>
            <label className="label">New password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type={showPwd ? 'text' : 'password'} value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="input pl-10 pr-10" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <PasswordStrength password={pwd} />
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input type={showPwd ? 'text' : 'password'} value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input" placeholder="Re-enter your password" required />
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center py-3 disabled:opacity-60">
            {loading ? 'Updating…' : 'Update password & sign in'}
          </button>
        </form>
      )}
    </AuthShell>
  );
};

export default ResetPassword;
