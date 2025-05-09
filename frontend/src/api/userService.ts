import baseApi from './baseApi';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await baseApi.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}; 