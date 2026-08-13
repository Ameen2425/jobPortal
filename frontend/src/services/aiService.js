import api from './api';

export const aiService = {
  getRecommendations: async () => {
    const response = await api.get('/ai/recommendations/');
    return response.data;
  },

  analyzeResume: async (resumeFile = null) => {
    const formData = new FormData();
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    const response = await api.post('/ai/resume-analysis/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  analyzeSkillGap: async (jobId, jobSkills = '') => {
    const response = await api.post('/ai/skill-gap/', { job_id: jobId, job_skills: jobSkills });
    return response.data;
  },

  generateCoverLetter: async (jobId, customNotes = '') => {
    const response = await api.post('/ai/cover-letter/', { job_id: jobId, custom_notes: customNotes });
    return response.data;
  },

  matchCandidates: async (jobId) => {
    const response = await api.post('/ai/candidate-match/', { job_id: jobId });
    return response.data;
  }
};
