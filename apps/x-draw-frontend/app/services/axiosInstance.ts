import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BACKEND_URL } from '../../properties';

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token storage and errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if response contains a token and store it
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  },
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('authToken');
      
      // Optionally redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
