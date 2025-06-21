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

// Helper functions for localStorage operations
const getStoredUsers = (): Array<{email: string, password: string, name: string, role: 'user' | 'admin'}> => {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

const storeUser = (email: string, password: string, name: string, role: 'user' | 'admin' = 'user') => {
  const users = getStoredUsers();
  const newUser = { email, password, name, role };
  users.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

const validateCredentials = (email: string, password: string): {email: string, password: string, name: string, role: 'user' | 'admin'} | null => {
  // Check for hardcoded admin credentials
  if (email === 'admin' && password === 'admin123') {
    return {
      email: 'admin@juiweaprent.com',
      password: 'admin123',
      name: 'Administrator',
      role: 'admin'
    };
  }
  
  // Check registered users
  const users = getStoredUsers();
  return users.find(user => user.email === email && user.password === password) || null;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error('Email and password are required'));
          return;
        }

        const validUser = validateCredentials(email, password);
        
        if (validUser) {
          const userData: User = {
            id: validUser.role === 'admin' ? 'admin' : Date.now().toString(),
            email: validUser.email,
            name: validUser.name,
            isAuthenticated: true,
            role: validUser.role,
          };
          
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          resolve();
        } else {
          reject(new Error('Invalid email or password. Please check your credentials.'));
        }
      }, 1000);
    });
  };

  const register = async (email: string, password: string, name: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password || !name) {
          reject(new Error('All fields are required'));
          return;
        }

        // Check if user already exists
        const existingUsers = getStoredUsers();
        if (existingUsers.some(user => user.email === email)) {
          reject(new Error('An account with this email already exists'));
          return;
        }

        // Store new user
        storeUser(email, password, name, 'user');
        
        // Auto-login after registration
        const userData: User = {
          id: Date.now().toString(),
          email,
          name,
          isAuthenticated: true,
          role: 'user',
        };
        
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
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