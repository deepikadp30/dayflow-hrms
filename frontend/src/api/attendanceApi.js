import { apiRequest } from './apiClient';

export const attendanceApi = {
  // Get list of attendance records (supports filters: date, user, status)
  getAttendance: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.date) query.append('date', params.date);
    if (params.user) query.append('user', params.user);
    if (params.status) query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = `/attendance/${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint, { method: 'GET' });
  },

  // Perform Check In for today
  checkIn: async (notes = '') => {
    return apiRequest('/attendance/check-in/', {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  // Perform Check Out for today
  checkOut: async (notes = '') => {
    return apiRequest('/attendance/check-out/', {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  // Get today's check-in/out status for current user
  getTodayStatus: async () => {
    return apiRequest('/attendance/today/', { method: 'GET' });
  },

  // Get single attendance record detail
  getAttendanceDetail: async (id) => {
    return apiRequest(`/attendance/${id}/`, { method: 'GET' });
  },
};
