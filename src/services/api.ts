import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace with your computer's IP address (e.g., 'http://192.168.1.5:5000/api') 
// use 'http://localhost:5000/api' for emulator
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage keys
const TOKEN_KEY = 'forum_auth_token';
const USER_KEY = 'forum_user';

// Logout subscriber for immediate app reflection
let unauthorizedHandler: (() => void) | null = null;
export const onUnauthorized = (handler: () => void) => {
  unauthorizedHandler = handler;
};

// Token management
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const saveUser = async (user: any) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized (401) detected by interceptor");
      // Token expired or invalid
      await removeToken();
      await removeUser();
      
      // Notify AuthContext to update UI
      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
  
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout', {}),
  forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
  resetDirect: (data: any) => api.post('/auth/reset-direct', data),
};

// Topics API
export const topicsAPI = {
  getAll: (page = 1, limit = 20) =>
    api.get(`/topics?page=${page}&limit=${limit}`),
  
  getById: (id: string) => api.get(`/topics/${id}`),
  
  create: (data: { title: string; content: string; tags?: string[] }) =>
    api.post('/topics', data),
  
  update: (id: string, data: { title?: string; content?: string; tags?: string[] }) =>
    api.put(`/topics/${id}`, data),
  
  delete: (id: string) => api.delete(`/topics/${id}`),
  
  getReplies: (id: string, page = 1, limit = 20) =>
    api.get(`/topics/${id}/replies?page=${page}&limit=${limit}`),
};

// Replies API
export const repliesAPI = {
  create: (data: { content: string; topicId: string }) =>
    api.post('/replies', data),
  
  update: (id: string, data: { content: string }) =>
    api.put(`/replies/${id}`, data),
  
  delete: (id: string) => api.delete(`/replies/${id}`),
};

// Users API
export const usersAPI = {
  getMe: () => api.get('/users/me'),
  
  updateMe: (data: { username?: string; bio?: string; avatar?: string }) =>
    api.put('/users/me', data),
  
  getById: (id: string) => api.get(`/users/${id}`),
  
  getTopics: (id: string, page = 1, limit = 10) =>
    api.get(`/users/${id}/topics?page=${page}&limit=${limit}`),
  
  getReplies: (id: string, page = 1, limit = 10) =>
    api.get(`/users/${id}/replies?page=${page}&limit=${limit}`),
};

export default api;
