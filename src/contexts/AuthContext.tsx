import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const defaultAuthContext: AuthContextType = {
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
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

  // Mock login functionality
  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to your backend
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulating successful login
        if (email && password) {
          const userData: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            isAuthenticated: true,
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
    // In a real app, this would make an API call to your backend
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name) {
          const userData: User = {
            id: '1',
            email,
            name,
            isAuthenticated: true,
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};