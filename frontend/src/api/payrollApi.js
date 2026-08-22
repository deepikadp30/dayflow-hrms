import { apiRequest } from './apiClient';

export const payrollApi = {
  // Get list of payroll records (filters: employee, month, year, payment_status)
  getPayrolls: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.employee) query.append('employee', params.employee);
    if (params.month) query.append('month', params.month);
    if (params.year) query.append('year', params.year);
    if (params.payment_status) query.append('payment_status', params.payment_status);

    const queryString = query.toString();
    const endpoint = `/payroll/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
  },

  // Get self payroll history
  getMyPayroll: async () => {
    return apiRequest('/payroll/me/', { method: 'GET' });
  },

  // Get single payroll record detail
  getPayrollDetail: async (id) => {
    return apiRequest(`/payroll/${id}/`, { method: 'GET' });
  },

  // Create new payroll record (Admin only)
  createPayroll: async (data) => {
    return apiRequest('/payroll/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update payroll record (Admin only)
  updatePayroll: async (id, data) => {
    return apiRequest(`/payroll/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
