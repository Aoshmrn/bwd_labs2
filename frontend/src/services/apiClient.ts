import axios from 'axios';
import { handleApiError } from '../utils/apiErrorHandler';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(handleApiError(error));
    }

    if (error.response?.status === 429 && originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      originalRequest._retryCount++;

      await sleep(RETRY_DELAY * originalRequest._retryCount);
      return apiClient(originalRequest);
    }

    return Promise.reject(handleApiError(error));
  }
);

export default apiClient;