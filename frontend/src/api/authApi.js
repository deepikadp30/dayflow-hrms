import { apiRequest } from './apiClient';

export const authApi = {
  // Login user and obtain JWT tokens
  login: async (credentials) => {
    return apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Refresh access token
  refreshToken: async (refresh) => {
    return apiRequest('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
  },

  // Get current authenticated user profile
  getProfile: async () => {
    return apiRequest('/auth/me/', {
      method: 'GET',
    });
  },
};
