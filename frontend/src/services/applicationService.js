import api from './api';

export const applicationService = {
  applyForJob: async (jobId, coverLetter = "", resumeFile = null) => {
    const formData = new FormData();
    formData.append('job', jobId);
    formData.append('cover_letter', coverLetter);
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    const response = await api.post('/applications/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my_applications/');
    return response.data;
  },

  getJobApplicants: async (jobId) => {
    const response = await api.get('/applications/', { params: { job: jobId } });
    return response.data;
  },

  updateStatus: async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/update_status/`, { status });
    return response.data;
  },

  scheduleInterview: async (interviewData) => {
    const response = await api.post('/interviews/', interviewData);
    return response.data;
  },

  getInterviews: async () => {
    const response = await api.get('/interviews/');
    return response.data;
  }
};
