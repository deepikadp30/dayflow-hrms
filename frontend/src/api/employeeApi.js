import { apiRequest } from './apiClient';

export const employeeApi = {
  // Fetch list of employees with query filters (search, department, designation, employment_type, status)
  getEmployees: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.department) query.append('department', params.department);
    if (params.designation) query.append('designation', params.designation);
    if (params.employment_type) query.append('employment_type', params.employment_type);
    if (params.status) query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = `/employees/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
  },

  // Fetch single employee profile by ID
  getEmployee: async (id) => {
    return apiRequest(`/employees/${id}/`, { method: 'GET' });
  },

  // Update employee profile (Admin or authorized)
  updateEmployee: async (id, data) => {
    return apiRequest(`/employees/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Fetch authenticated user's profile
  getMyProfile: async () => {
    return apiRequest('/employees/me/', { method: 'GET' });
  },

  // Update authenticated user's permitted profile fields
  updateMyProfile: async (data) => {
    return apiRequest('/employees/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
