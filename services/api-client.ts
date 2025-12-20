import { API_BASE_URL, API_TIMEOUT } from '@/constants/api';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log request for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // Handle errors
    console.error('[API Response Error]', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });

    // Customize error messages
    let errorMessage = 'An error occurred while processing your request';

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (!error.response) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Access denied.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
      }
    }

    return Promise.reject({
      ...error,
      customMessage: errorMessage,
    });
  }
);

export default apiClient;
