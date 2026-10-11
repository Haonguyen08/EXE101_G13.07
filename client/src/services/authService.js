import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn Authorization Token tự động nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pet_passport_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Đăng nhập
  login: async (identifier, password) => {
    const response = await api.post('/auth/login', {
      identifier,
      password,
    });
    return response.data;
  },

  // Đăng ký
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Lấy thông tin user hiện tại + danh sách Pet
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Lấy danh sách tài khoản & thú cưng trực tiếp từ MongoDB (dữ liệu động)
  getPetAccounts: async () => {
    const response = await api.get('/auth/pet-accounts');
    return response.data;
  },
};

export default api;
