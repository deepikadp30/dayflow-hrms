import { apiRequest } from './apiClient';

export const organizationApi = {
  // Get company profile details
  getOrganization: async () => {
    return apiRequest('/organization/', { method: 'GET' });
  },

  // Update company profile details (Admin only)
  updateOrganization: async (id, data) => {
    return apiRequest(`/organization/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
