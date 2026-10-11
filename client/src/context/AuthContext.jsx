import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pet_passport_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pet_passport_token') || localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi động: Kiểm tra token còn hợp lệ không bằng cách gọi getMe
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('pet_passport_token') || localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('pet_passport_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('[AuthContext] Token hết hạn hoặc không hợp lệ:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      const res = await authService.login(identifier, password);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('pet_passport_token', res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('pet_passport_user', JSON.stringify(res.user));
        return res;
      }
      throw new Error(res.message || 'Đăng nhập không thành công');
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
      throw new Error(serverMsg);
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('pet_passport_token', res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('pet_passport_user', JSON.stringify(res.user));
        return res;
      }
      throw new Error(res.message || 'Đăng ký không thành công');
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || 'Đăng ký thất bại';
      throw new Error(serverMsg);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pet_passport_token');
    localStorage.removeItem('token');
    localStorage.removeItem('pet_passport_user');
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('pet_passport_user', JSON.stringify(res.user));
      }
    } catch (error) {
      console.error('[AuthContext] Lỗi làm mới dữ liệu người dùng:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
};

export default AuthContext;
