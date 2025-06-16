import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const register = (username, password) => {
  return axios.post(`${API_URL}/register`, {
    username,
    password
  });
};

const login = (username, password) => {
  return axios.post(`${API_URL}/login`, {
    username,
    password
  })
  .then(response => {
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify({ username }));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser
};

export default authService;