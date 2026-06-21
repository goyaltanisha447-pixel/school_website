const BASE_URL = 'http://localhost:5000/api';

// Safe wrapper for JSON parse
export const safeJsonParse = (str, fallback = {}) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    // Set headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    const token = localStorage.getItem('dtc_access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    let response = await fetch(url, config);

    // If access token is expired (403), try to refresh it
    if (response.status === 403 && !options._retry) {
      options._retry = true;
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry request with new token
        const newToken = localStorage.getItem('dtc_access_token');
        headers['Authorization'] = `Bearer ${newToken}`;
        config.headers = headers;
        response = await fetch(url, config);
      } else {
        // Refresh token failed, logout user
        localStorage.removeItem('dtc_user');
        localStorage.removeItem('dtc_access_token');
        localStorage.removeItem('dtc_refresh_token');
        window.dispatchEvent(new Event('auth-logout'));
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('dtc_refresh_token');
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('dtc_access_token', data.accessToken);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error refreshing token:', e);
      return false;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE', body });
  }
}

export const api = new ApiClient();
