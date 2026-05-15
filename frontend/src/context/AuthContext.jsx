import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ─── Bootstrap: restore session ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('accesscore_token');
    const storedUser = localStorage.getItem('accesscore_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('accesscore_token', token);
    localStorage.setItem('accesscore_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  const register = useCallback(async (formData) => {
    const res = await authAPI.register(formData);
    const { token, user: userData } = res.data.data;
    localStorage.setItem('accesscore_token', token);
    localStorage.setItem('accesscore_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('accesscore_token');
    localStorage.removeItem('accesscore_user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.getMe();
      const userData = res.data.data.user;
      setUser(userData);
      localStorage.setItem('accesscore_user', JSON.stringify(userData));
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
