import api from './api';

export const jobService = {
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs/', { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}/`);
    return response.data;
  },

  getMyJobs: async () => {
    const response = await api.get('/jobs/my_jobs/');
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs/', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.patch(`/jobs/${id}/`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}/`);
    return response.data;
  },

  // Saved Jobs
  getSavedJobs: async () => {
    const response = await api.get('/saved-jobs/');
    return response.data;
  },

  toggleSaveJob: async (jobId) => {
    const response = await api.post('/saved-jobs/toggle/', { job_id: jobId });
    return response.data;
  }
};
