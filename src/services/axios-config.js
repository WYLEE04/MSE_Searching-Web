import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const { response, request, message } = error;
    
    if (response) {
      console.error(`API Error ${response.status}:`, response.data);      
      switch (response.status) {
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Server internal error');
          break;
        case 403:
          console.warn('Access forbidden');
          break;
        default:
          console.error('API error:', response.data);
      }
    } else if (request) {
      console.error('No response from server. Is the server running?');
      console.error('Request URL:', request.responseURL || 'Unknown');
    } else {
      console.error('Request setup error:', message);
    }
    
    return Promise.reject(error);
  }
);
export const checkServerHealth = async () => {
  try {
    const response = await apiClient.get('/api/users/rankings');
    return { connected: true, status: response.status };
  } catch (error) {
    return { 
      connected: false, 
      error: error.message,
      isServerDown: !error.response 
    };
  }
};

export const config = {
  API_BASE_URL,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default apiClient;