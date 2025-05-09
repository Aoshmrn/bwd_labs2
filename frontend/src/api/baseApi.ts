import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json'
  }
});

baseApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      let errorMessage = 'Произошла ошибка';
      
      if (error.response.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors[0];
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data?.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return Promise.reject(errorMessage);
    } else if (error.request) {
      return Promise.reject('Нет ответа от сервера. Проверьте соединение');
    } else {
      return Promise.reject('Ошибка при отправке запроса');
    }
  }
);

export default baseApi;