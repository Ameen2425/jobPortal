import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/auth/profile/', data);
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/auth/upload-resume/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password/', { email });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Skills CRUD
  addSkill: async (skillData) => (await api.post('/users/skills/', skillData)).data,
  deleteSkill: async (id) => (await api.delete(`/users/skills/${id}/`)).data,

  // Experience CRUD
  addExperience: async (expData) => (await api.post('/users/experiences/', expData)).data,
  deleteExperience: async (id) => (await api.delete(`/users/experiences/${id}/`)).data,

  // Education CRUD
  addEducation: async (eduData) => (await api.post('/users/education/', eduData)).data,
  deleteEducation: async (id) => (await api.delete(`/users/education/${id}/`)).data,
};
