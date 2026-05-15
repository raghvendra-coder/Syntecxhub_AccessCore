import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accesscore_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accesscore_token');
      localStorage.removeItem('accesscore_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth endpoints ───────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// ─── User endpoints ───────────────────────────────────────────────────────────
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  toggleBlock: (id) => api.patch(`/users/${id}/block`),
  delete: (id) => api.delete(`/users/${id}`),
};

// ─── Audit endpoints ──────────────────────────────────────────────────────────
export const auditAPI = {
  getLogs: (params) => api.get('/audit', { params }),
  getStats: () => api.get('/audit/stats'),
};

// ─── Dashboard endpoints ──────────────────────────────────────────────────────
export const dashboardAPI = {
  getAnalytics: () => api.get('/dashboard/analytics'),
};

// ─── Cron endpoints ───────────────────────────────────────────────────────────
export const cronAPI = {
  getAll: () => api.get('/cron'),
  getByName: (name) => api.get(`/cron/${name}`),
  trigger: (name) => api.post(`/cron/${name}/trigger`),
  toggle: (name) => api.patch(`/cron/${name}/toggle`),
};

export default api;
