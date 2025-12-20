// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://69.62.85.221:8000';

// API Endpoints
export const ENDPOINTS = {
  DENOISE: '/api/audio/denoise/',
  BOOST: '/api/audio/boost/',
} as const;

// API Timeout
export const API_TIMEOUT = 300000; // 5 minutes for audio processing
