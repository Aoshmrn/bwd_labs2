import baseApi from './baseApi';
import { setToken } from '../utils/tokenStorage';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    birthDate: string;
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
    if (!data.firstName) throw new Error('Имя обязательно');
    if (!data.lastName) throw new Error('Фамилия обязательна');
    if (!data.middleName) throw new Error('Отчество обязательно');
    if (!data.email) throw new Error('Email обязателен');
    if (!data.password) throw new Error('Пароль обязателен');
    if (!data.gender) throw new Error('Пол обязателен');
    if (!data.birthDate) throw new Error('Дата рождения обязательна');
    
    const response = await baseApi.post<AuthResponse>('/auth/register', data);
    setToken(response.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};