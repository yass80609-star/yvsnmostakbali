import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, login as authLogin, register as authRegister, logout as authLogout } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password, rememberMe) => {
    const loggedUser = authLogin(email, password, rememberMe);
    setUser(loggedUser);
    setIsLoggedIn(true);
    return loggedUser;
  };

  const register = (fullName, email, password) => {
    const newUser = authRegister(fullName, email, password);
    setUser(newUser);
    setIsLoggedIn(true);
    return newUser;
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
