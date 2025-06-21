import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const defaultAuthContext: AuthContextType = {
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Mock login functionality with admin support
  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check for admin credentials
        if (email === 'admin' && password === 'admin123') {
          const userData: User = {
            id: 'admin',
            email: 'admin@juiweaprent.com',
            name: 'Administrator',
            isAuthenticated: true,
            role: 'admin',
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else if (email && password) {
          // Regular user login
          const userData: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            isAuthenticated: true,
            role: 'user',
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  // Mock register functionality
  const register = async (email: string, password: string, name: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name) {
          const userData: User = {
            id: '1',
            email,
            name,
            isAuthenticated: true,
            role: 'user',
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};