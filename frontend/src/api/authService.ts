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
    const response = await baseApi.post<AuthResponse>('/auth/login', data);
    const { token } = response.data;
    setToken(token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await baseApi.post<AuthResponse>('/auth/register', data);
    const { token } = response.data;
    setToken(token);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};