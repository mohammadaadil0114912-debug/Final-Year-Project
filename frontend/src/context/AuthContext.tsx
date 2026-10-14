import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, preferredMode?: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (prefs: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('asl_auth_token');
    if (token) {
      apiClient.getMe()
        .then(u => setUser(u))
        .catch(() => {
          localStorage.removeItem('asl_auth_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiClient.login(email, password);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string, preferredMode?: string) => {
    const data = await apiClient.register(email, password, name, preferredMode);
    setUser(data.user);
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  const updatePreferences = async (prefs: Partial<User>) => {
    const updated = await apiClient.updatePreferences(prefs);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updatePreferences,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
