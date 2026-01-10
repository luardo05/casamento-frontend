import axios from 'axios';

const backUrl = import.meta.env.VITE_API_URL || 'https://casamento-backend-9bf9.onrender.com';

const api = axios.create({
  baseURL: backUrl, 
});

api.interceptors.request.use((config) => {
  const guestToken = localStorage.getItem('guest_token');
  const adminToken = localStorage.getItem('admin_token');

  if (guestToken) {
    config.headers['x-invite-token'] = guestToken;
  }
  
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

export default api;