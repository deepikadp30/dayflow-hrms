import { apiRequest } from './apiClient';

export const leaveApi = {
  // Get list of leave requests (supports filters: status, leave_type, user)
  getLeaves: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.leave_type) query.append('leave_type', params.leave_type);
    if (params.user) query.append('user', params.user);

    const queryString = query.toString();
    const endpoint = `/leaves/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
  },

  // Submit new leave request
  createLeave: async (data) => {
    return apiRequest('/leaves/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Detail view for leave request
  getLeaveDetail: async (id) => {
    return apiRequest(`/leaves/${id}/`, { method: 'GET' });
  },

  // Cancel pending leave request (Employee)
  cancelLeave: async (id) => {
    return apiRequest(`/leaves/${id}/cancel/`, { method: 'PATCH' });
  },

  // Approve leave request (Admin only)
  approveLeave: async (id, admin_note = '') => {
    return apiRequest(`/leaves/${id}/approve/`, {
      method: 'PATCH',
      body: JSON.stringify({ admin_note }),
    });
  },

  // Reject leave request (Admin only)
  rejectLeave: async (id, admin_note = '') => {
    return apiRequest(`/leaves/${id}/reject/`, {
      method: 'PATCH',
      body: JSON.stringify({ admin_note }),
    });
  },
};
