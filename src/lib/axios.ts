// src/services/apiClient.ts
import axios from "axios";

// --- Temporary Setup ---
// TODO: Replace with actual base URL and auth logic
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL; // Example local dev URL

const Axios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add a request interceptor to include token from localStorage
Axios.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Adding token to request:", token.substring(0, 20) + "...");
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log("No token found in localStorage");
      }
    }
    console.log("Request URL:", config.url);
    console.log("Request headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export default Axios;
