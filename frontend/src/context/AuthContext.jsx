import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const data = await authService.getProfile();
      setUser(data);
    } catch (err) {
      setUser(null);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    await fetchUserProfile();
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    await fetchUserProfile();
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshProfile,
    isJobSeeker: user?.role === 'JOB_SEEKER',
    isRecruiter: user?.role === 'RECRUITER',
    isAdmin: user?.role === 'ADMIN' || user?.is_superuser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
