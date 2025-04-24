import axios, { AxiosError } from 'axios';
import { ApiError } from '../types/api';

export class ApiRequestError extends Error implements ApiError {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status || 500;
    const message = axiosError.response?.data?.message || axiosError.message || 'An unexpected error occurred';
    throw new ApiRequestError(message, status);
  }
  throw new ApiRequestError('An unexpected error occurred');
};