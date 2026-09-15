import axios from 'axios';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token from localStorage if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('attar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const url = error.config?.url || '';
      // Don't wipe on login/signup attempt errors so the user can see error message
      if (
        !url.includes('/auth/login') &&
        !url.includes('/auth/admin-login') &&
        !url.includes('/auth/register') &&
        !url.includes('/auth/verify-otp') &&
        !url.includes('/auth/send-otp') &&
        !url.includes('/auth/complete-profile') &&
        !url.includes('/auth/google')
      ) {
        localStorage.removeItem('attar_token');
        localStorage.removeItem('attar_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
