import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAccessToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On load, try to silently restore the session from the refresh cookie.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAPI.refresh();
        setAccessToken(data.token);
        setUser(data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Returns { requiresVerification, email } for unverified accounts.
  const login = async (identifier, password, remember = false) => {
    const res = await authAPI.login({ identifier, password, remember });
    if (res.data.token) {
      setAccessToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  // Register no longer logs in directly — it triggers OTP verification.
  const register = async (username, email, password) => {
    const res = await authAPI.register({ username, email, password });
    return res.data; // { requiresVerification, email }
  };

  // Completes signup OR password-reset auto-login: token + user returned.
  const completeSession = (data) => {
    if (data?.token) {
      setAccessToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const verifyEmail = async (email, code) =>
    completeSession((await authAPI.verifyEmail({ email, code })).data);

  const logout = async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    setAccessToken(null);
    setUser(null);
  };
  console.log("AuthContext Render", user);

  return (
    <AuthContext.Provider value={{
      user, loading, isAuth: !!user,
      login, register, verifyEmail, completeSession, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
