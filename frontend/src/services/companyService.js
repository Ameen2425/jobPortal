import api from './api';

export const companyService = {
  getCompanies: async (params = {}) => {
    const response = await api.get('/companies/', { params });
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}/`);
    return response.data;
  },

  getMyCompany: async () => {
    const response = await api.get('/companies/my_company/');
    return response.data;
  },

  updateMyCompany: async (companyData) => {
    const response = await api.post('/companies/my_company/', companyData);
    return response.data;
  }
};
