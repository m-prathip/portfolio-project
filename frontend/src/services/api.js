import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'https://student-portfolio-ckpc.onrender.com';

// ── Access token lives in MEMORY only ──────────────────
// The audit flagged storing the JWT in localStorage (XSS-stealable).
// The long-lived session now lives in an httpOnly refresh cookie; the
// short-lived (15m) access token is kept in a module variable and
// silently refreshed on 401. A reload simply calls /auth/refresh.
let accessToken = null;
export const setAccessToken = (t) => { accessToken = t; };
export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // send/receive the refresh cookie
});

// Bare client for refresh (avoids the interceptor loop below).
const refreshClient = axios.create({ baseURL: `${BASE_URL}/api`, withCredentials: true });

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// On 401, try a single silent refresh, then replay the original request.
let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err.response?.status;
    const isAuthCall = original?.url?.includes('/auth/login') ||
                       original?.url?.includes('/auth/refresh') ||
                       original?.url?.includes('/auth/register');

    if (status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        refreshing = refreshing || refreshClient.post('/auth/refresh');
        const { data } = await refreshing;
        refreshing = null;
        setAccessToken(data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch (e) {
        refreshing = null;
        setAccessToken(null);
        if (typeof window !== 'undefined' &&
            window.location.pathname.startsWith('/admin') &&
            window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

const mp = { headers: { 'Content-Type': 'multipart/form-data' } };

// ── Auth ────────────────────────────────────────────────
export const authAPI = {
  register: (d) => api.post('/auth/register', d),
  verifyEmail: (d) => api.post('/auth/verify-email', d),
  resendOtp: (d) => api.post('/auth/resend-otp', d),
  login: (d) => api.post('/auth/login', d),
  refresh: () => refreshClient.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (d) => api.post('/auth/forgot-password', d),
  verifyResetOtp: (d) => api.post('/auth/verify-reset-otp', d),
  resetPassword: (d) => api.post('/auth/reset-password', d),
  verify: () => api.get('/auth/verify'),
  activity: () => api.get('/auth/activity'),
  checkUsername: (u) => api.get(`/auth/check-username/${encodeURIComponent(u)}`)
};

// ── Content resources (unchanged) ───────────────────────
export const profileAPI = {
  getMine: () => api.get('/profile/me'),
  updateMine: (d) => api.put('/profile/me', d, mp),
  getPublic: (u) => api.get(`/profile/public/${u}`)
};
export const educationAPI = {
  getMine: () => api.get('/education/me'),
  getPublic: (u) => api.get(`/education/public/${u}`),
  create: (d) => api.post('/education', d),
  update: (id, d) => api.put(`/education/${id}`, d),
  delete: (id) => api.delete(`/education/${id}`)
};
export const experienceAPI = {
  getMine: () => api.get('/experience/me'),
  getPublic: (u) => api.get(`/experience/public/${u}`),
  create: (d) => api.post('/experience', d),
  update: (id, d) => api.put(`/experience/${id}`, d),
  delete: (id) => api.delete(`/experience/${id}`)
};
export const projectsAPI = {
  getMine: () => api.get('/projects/me'),
  getPublic: (u) => api.get(`/projects/public/${u}`),
  create: (d) => api.post('/projects', d, mp),
  update: (id, d) => api.put(`/projects/${id}`, d, mp),
  delete: (id) => api.delete(`/projects/${id}`)
};
export const skillsAPI = {
  getMine: () => api.get('/skills/me'),
  getPublic: (u) => api.get(`/skills/public/${u}`),
  create: (d) => api.post('/skills', d),
  update: (id, d) => api.put(`/skills/${id}`, d),
  delete: (id) => api.delete(`/skills/${id}`)
};
export const achievementsAPI = {
  getMine: () => api.get('/achievements/me'),
  getPublic: (u) => api.get(`/achievements/public/${u}`),
  create: (d) => api.post('/achievements', d),
  update: (id, d) => api.put(`/achievements/${id}`, d),
  delete: (id) => api.delete(`/achievements/${id}`)
};
export const activitiesAPI = {
  getMine: () => api.get('/activities/me'),
  getPublic: (u) => api.get(`/activities/public/${u}`),
  create: (d) => api.post('/activities', d),
  update: (id, d) => api.put(`/activities/${id}`, d),
  delete: (id) => api.delete(`/activities/${id}`)
};
export const certificatesAPI = {
  getMine: () => api.get('/certificates/me'),
  getPublic: (u) => api.get(`/certificates/public/${u}`),
  create: (d) => api.post('/certificates', d),
  update: (id, d) => api.put(`/certificates/${id}`, d),
  delete: (id) => api.delete(`/certificates/${id}`)
};
export const portfolioAPI = {
  getMyLink: () => api.get('/portfolio/me/link'),
  qrCodeUrl: (u) => `${BASE_URL}/api/portfolio/${encodeURIComponent(u)}/qrcode`,
  // public tracking (best-effort, never blocks the UI)
  trackVisit: (u, path) => api.post(`/portfolio/${encodeURIComponent(u)}/visit`, { path, referrer: document.referrer }).catch(() => {}),
  trackTheme: (u, theme) => api.post(`/portfolio/${encodeURIComponent(u)}/theme`, { theme }).catch(() => {}),
  trackResume: (u) => api.post(`/portfolio/${encodeURIComponent(u)}/resume-download`).catch(() => {}),
  contact: (u, d) => api.post(`/portfolio/${encodeURIComponent(u)}/contact`, d),
  ask: (u, d) => api.post(`/portfolio/${encodeURIComponent(u)}/assistant`, d)
};

// Owner analytics dashboard (Phase 16)
export const analyticsAPI = {
  get: () => api.get('/portfolio/me/analytics'),
  messages: () => api.get('/portfolio/me/messages'),
  markRead: (id) => api.patch(`/portfolio/me/messages/${id}/read`)
};

export default api;
