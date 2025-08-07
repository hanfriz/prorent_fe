// src/services/apiClient.ts
import axios from 'axios';

// --- Temporary Setup ---
// TODO: Replace with actual base URL and auth logic
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'; // Example local dev URL

const apiClient = axios.create({
   baseURL: API_BASE_URL,
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer YOUR_MANUAL_TOKEN_HERE`,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEV_AUTH_TOKEN}`
   }
});

// --- Example Interceptor for Development Logging ---
// Uncomment if needed for debugging API calls
/*
apiClient.interceptors.request.use(
  (config) => {
    console.log('Outgoing Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Incoming Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
*/

export default apiClient;
