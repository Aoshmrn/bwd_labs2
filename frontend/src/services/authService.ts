import apiClient from './apiClient';
import { AuthResponse, RegisterData, LoginData, ApiError } from '../types/api';

const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/register', data);
    setAuthToken(response.data.token);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Registration failed',
      status: error.response?.status || 500
    };
    throw new Error(apiError.message);
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/login', data);
    setAuthToken(response.data.token);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Login failed',
      status: error.response?.status || 500
    };
    throw new Error(apiError.message);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};