import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

const mp = { headers: { 'Content-Type': 'multipart/form-data' } };

// Every resource below supports two read modes:
//   getMine()         — the logged-in user's own items, for the dashboard
//   getPublic(username) — a specific user's items, for their /u/:username page
export const profileAPI = {
  getMine: () => api.get('/profile/me'),
  updateMine: (d) => api.put('/profile/me', d, mp),
  getPublic: (username) => api.get(`/profile/public/${username}`)
};
export const educationAPI = {
  getMine: () => api.get('/education/me'),
  getPublic: (username) => api.get(`/education/public/${username}`),
  create: (d) => api.post('/education', d),
  update: (id, d) => api.put(`/education/${id}`, d),
  delete: (id) => api.delete(`/education/${id}`)
};
export const experienceAPI = {
  getMine: () => api.get('/experience/me'),
  getPublic: (username) => api.get(`/experience/public/${username}`),
  create: (d) => api.post('/experience', d),
  update: (id, d) => api.put(`/experience/${id}`, d),
  delete: (id) => api.delete(`/experience/${id}`)
};
export const projectsAPI = {
  getMine: () => api.get('/projects/me'),
  getPublic: (username) => api.get(`/projects/public/${username}`),
  create: (d) => api.post('/projects', d, mp),
  update: (id, d) => api.put(`/projects/${id}`, d, mp),
  delete: (id) => api.delete(`/projects/${id}`)
};
export const skillsAPI = {
  getMine: () => api.get('/skills/me'),
  getPublic: (username) => api.get(`/skills/public/${username}`),
  create: (d) => api.post('/skills', d),
  update: (id, d) => api.put(`/skills/${id}`, d),
  delete: (id) => api.delete(`/skills/${id}`)
};
export const achievementsAPI = {
  getMine: () => api.get('/achievements/me'),
  getPublic: (username) => api.get(`/achievements/public/${username}`),
  create: (d) => api.post('/achievements', d),
  update: (id, d) => api.put(`/achievements/${id}`, d),
  delete: (id) => api.delete(`/achievements/${id}`)
};
export const activitiesAPI = {
  getMine: () => api.get('/activities/me'),
  getPublic: (username) => api.get(`/activities/public/${username}`),
  create: (d) => api.post('/activities', d),
  update: (id, d) => api.put(`/activities/${id}`, d),
  delete: (id) => api.delete(`/activities/${id}`)
};
export const authAPI = {
  register: (d) => api.post('/auth/register', d),
  login: (d) => api.post('/auth/login', d),
  verify: () => api.get('/auth/verify'),
  checkUsername: (username) => api.get(`/auth/check-username/${encodeURIComponent(username)}`)
};
// Share link + QR code for a user's portfolio
export const portfolioAPI = {
  getMyLink: () => api.get('/portfolio/me/link'),
  qrCodeUrl: (username) => `${BASE_URL}/api/portfolio/${encodeURIComponent(username)}/qrcode`
};

export default api;
