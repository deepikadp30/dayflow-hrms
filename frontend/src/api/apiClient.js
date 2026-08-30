const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Custom fetch wrapper with automatic JWT header injection and token refresh logic
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const token = localStorage.getItem('dayflow_access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token refresh on 401 Unauthorized
  if (response.status === 401 && !options._isRetry) {
    const refreshToken = localStorage.getItem('dayflow_refresh_token');
    
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('dayflow_access_token', refreshData.access);
          
          // Retry original request with new access token
          return apiRequest(endpoint, {
            ...options,
            _isRetry: true,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${refreshData.access}`,
            },
          });
        } else {
          // Token refresh failed -> Clear session
          localStorage.removeItem('dayflow_access_token');
          localStorage.removeItem('dayflow_refresh_token');
          localStorage.removeItem('dayflow_user');
        }
      } catch (err) {
        localStorage.removeItem('dayflow_access_token');
        localStorage.removeItem('dayflow_refresh_token');
        localStorage.removeItem('dayflow_user');
      }
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.detail || data.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
