import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authService';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const USER_STORAGE_KEY = 'event_app_user';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const storedUser = localStorage.getItem(USER_STORAGE_KEY);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (err) {
          console.error('Token validation error:', err);
          removeToken();
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!credentials.email || !credentials.password) {
        setError('Email и пароль обязательны');
        return;
      }
      
      const response = await apiLogin(credentials);
      
      const userData: User = {
        id: response.user.id,
        username: response.user.name,
        email: response.user.email,
        role: response.user.role
      };
      
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
    } catch (err: any) {
      console.error('Login error details:', err);
      
      // Используем переданное сообщение об ошибке напрямую с бэкенда
      if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Неверный email или пароль');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      setLoading(true);
      removeToken();
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (err) {
      setError('Ошибка при выходе из системы');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        isAdmin,
        login, 
        logout,
        clearError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};