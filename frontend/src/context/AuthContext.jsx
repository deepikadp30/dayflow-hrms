import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('dayflow_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from storage and fetch live user profile
  useEffect(() => {
    async function initAuth() {
      const accessToken = localStorage.getItem('dayflow_access_token');
      if (accessToken) {
        try {
          const profile = await authApi.getProfile();
          setUser(profile);
          localStorage.setItem('dayflow_user', JSON.stringify(profile));
        } catch (err) {
          console.error('Failed to load profile on mount:', err);
          if (err.status === 401) {
            logout();
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  // Handle user login
  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      
      // Store JWT tokens
      localStorage.setItem('dayflow_access_token', response.access);
      localStorage.setItem('dayflow_refresh_token', response.refresh);
      
      const userData = response.user;
      setUser(userData);
      localStorage.setItem('dayflow_user', JSON.stringify(userData));
      
      setLoading(false);
      return userData;
    } catch (err) {
      setLoading(false);
      const errMsg = err.data?.detail || err.data?.non_field_errors?.[0] || 'Invalid credentials. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Handle user registration
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const createdUser = await authApi.register(userData);
      setLoading(false);
      return createdUser;
    } catch (err) {
      setLoading(false);
      let errMsg = 'Registration failed.';
      if (err.data) {
        const firstKey = Object.keys(err.data)[0];
        const val = err.data[firstKey];
        errMsg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
      }
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('dayflow_access_token');
    localStorage.removeItem('dayflow_refresh_token');
    localStorage.removeItem('dayflow_user');
    setUser(null);
    setError(null);
  };

  // Refresh current user profile
  const refreshUser = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      logout();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
