import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginAdmin = (credentials) => API.post('/auth/login', credentials);

// Projects
export const getProjects = () => API.get('/projects');
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// Skills
export const getSkills = () => API.get('/skills');
export const createSkill = (data) => API.post('/skills', data);
export const updateSkill = (id, data) => API.put(`/skills/${id}`, data);
export const deleteSkill = (id) => API.delete(`/skills/${id}`);

// Contact
export const submitContact = (data) => API.post('/contact', data);
export const getMessages = () => API.get('/contact/messages');
export const markMessageRead = (id) => API.patch(`/contact/messages/${id}/read`);
export const deleteMessage = (id) => API.delete(`/contact/messages/${id}`);

export default API;
