import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authService';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
import { UserProfile } from '../api/userService';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  role: string;
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
  updateUser: (userData: UserProfile) => void;
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
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        middleName: response.user.middleName,
        email: response.user.email,
        gender: response.user.gender,
        birthDate: response.user.birthDate,
        role: response.user.role
      };
      
      setToken(response.token);
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
    } catch (err: any) {
      console.error('Login error details:', err);
      
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

  const updateUser = (userData: UserProfile) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      ...userData
    };

    setUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
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
        clearError,
        updateUser
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