// utils/auth.js
import { getStorageItem, setStorageItem, getSessionItem, setSessionItem, removeSessionItem } from './storage';

export const register = (fullName, email, password, plan = 'etudiant') => {
  const users = getStorageItem("mb_users", []);
  
  if (users.find(u => u.email === email)) {
    throw new Error("Email déjà utilisé");
  }

  const newUser = {
    id: crypto.randomUUID(),
    fullName,
    email,
    password: btoa(password),
    plan,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  setStorageItem("mb_users", users);
  
  // Auto login after register
  const sessionData = { isLoggedIn: true, userId: newUser.id };
  setSessionItem("mb_session", sessionData);
  
  return newUser;
};

export const login = (email, password, rememberMe = false) => {
  const users = getStorageItem("mb_users", []);
  const hashedPassword = btoa(password);
  
  const user = users.find(u => u.email === email && u.password === hashedPassword);
  
  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const sessionData = { isLoggedIn: true, userId: user.id };
  if (rememberMe) {
      setStorageItem("mb_session", sessionData); // For remember me, we can save to local storage (or hybrid logic)
  } else {
      setSessionItem("mb_session", sessionData);
  }
  
  return user;
};

export const logout = () => {
  removeSessionItem("mb_session");
  // Also remove from localStorage if "remember me" was used
  window.localStorage.removeItem("mb_session"); 
};

export const getCurrentUser = () => {
  // Check sessionStorage first, then localStorage
  let session = getSessionItem("mb_session");
  if (!session) {
      session = getStorageItem("mb_session");
  }
  
  if (!session || !session.isLoggedIn) return null;

  const users = getStorageItem("mb_users", []);
  return users.find(u => u.id === session.userId) || null;
};
