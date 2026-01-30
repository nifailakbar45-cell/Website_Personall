import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// User APIs
export const userAPI = {
  getAllUsers: () => apiClient.get('/users'),
  createUser: (data) => apiClient.post('/users', data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};

// Task APIs
export const taskAPI = {
  getAllTasks: () => apiClient.get('/tasks'),
  createTask: (data) => apiClient.post('/tasks', data),
  updateTask: (id, data) => apiClient.put(`/tasks/${id}`, data),
  updateTaskStatus: (id, status) => apiClient.patch(`/tasks/${id}/status`, { status }),
  submitAnswer: (id, answer) => apiClient.patch(`/tasks/${id}/answer`, { answer }),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
};

export default apiClient;
