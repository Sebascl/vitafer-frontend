import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoadingUser(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${backendApiUrl}/api/user/data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser({ ...data.user, orders: data.orders, prizes: data.prizes });
      } else {
        logout();
      }
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setIsLoadingUser(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch(`${backendApiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const response = await fetch(`${backendApiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUserSpins = (newSpins, newPrize) => {
    setUser(prev => ({
      ...prev,
      spins: newSpins,
      prizes: newPrize ? [...prev.prizes, { name: newPrize, date: new Date() }] : prev.prizes
    }));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoadingUser, updateUserSpins }}>
      {children}
    </AuthContext.Provider>
  );
};