import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('quickbite_customer');
    return savedCustomer ? JSON.parse(savedCustomer) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('quickbite_token') || null;
  });

  const login = (customerData, tokenData) => {
    setCustomer(customerData);
    setToken(tokenData);
    localStorage.setItem('quickbite_customer', JSON.stringify(customerData));
    localStorage.setItem('quickbite_token', tokenData);
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem('quickbite_customer');
    localStorage.removeItem('quickbite_token');
  };

  return (
    <AuthContext.Provider value={{ customer, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
