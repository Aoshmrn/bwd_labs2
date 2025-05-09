import baseApi from './baseApi';
import { setToken } from '../utils/tokenStorage';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    if (!data.email) throw new Error('Email is required');
    if (!data.password) throw new Error('Password is required');
    
    const response = await baseApi.post<AuthResponse>('/auth/login', {
      email: data.email,
      password: data.password
    });
    
    setToken(response.data.token);
    return response.data;
  } catch (error: any) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    if (!data.name) throw new Error('Name is required');
    if (!data.email) throw new Error('Email is required');
    if (!data.password) throw new Error('Password is required');
    
    const response = await baseApi.post<AuthResponse>('/auth/register', data);
    setToken(response.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};