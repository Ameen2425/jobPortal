import api from './api';

export const analyticsService = {
  getJobSeekerAnalytics: async () => {
    const response = await api.get('/analytics/job-seeker/');
    return response.data;
  },

  getRecruiterAnalytics: async () => {
    const response = await api.get('/analytics/recruiter/');
    return response.data;
  },

  getAdminAnalytics: async () => {
    const response = await api.get('/analytics/admin/');
    return response.data;
  }
};
