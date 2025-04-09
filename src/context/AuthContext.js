// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['x-auth-token'] = token;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['x-auth-token'] = token;
    setUser(user);
    return user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['x-auth-token'];
  };

  const resetPassword = async (email) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password`, { email });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};