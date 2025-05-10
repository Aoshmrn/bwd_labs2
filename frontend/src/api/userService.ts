import baseApi from './baseApi';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  role: string;
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
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

export const updateUserProfile = async (data: ProfileUpdateData): Promise<UserProfile> => {
  try {
    const response = await baseApi.patch<UserProfile>(`/users/profile`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};