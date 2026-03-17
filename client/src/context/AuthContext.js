/**
 * Auth Context
 * Global authentication state management
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Configure axios defaults
const API = axios.create({ baseURL: 'https://nexus-test-tnx7.onrender.com/api' });

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { API };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('nexus_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Check if token is expired
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('nexus_token');
          setLoading(false);
          return;
        }

        // Fetch fresh user data
        const { data } = await API.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('nexus_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('nexus_token', data.token);
    setUser(data.user);
    return data;
  }, []);

  // Register
  const register = useCallback(async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('nexus_token', data.token);
    setUser(data.user);
    return data;
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('nexus_token');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  // Update user in state
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      console.error('Failed to refresh user');
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    API
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
