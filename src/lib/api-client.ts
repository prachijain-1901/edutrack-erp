const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  data?: any;
  params?: Record<string, string | number | boolean>;
  requireAuth?: boolean;
}

export async function apiClient(endpoint: string, options: RequestOptions = {}) {
  const { data, params, requireAuth = true, headers: customHeaders, ...customConfig } = options;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  if (data && !(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (requireAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth && !token) {
    // Optionally redirect to login or throw
    console.warn("API request requiring auth made without token:", endpoint);
  }

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
    headers,
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = 'An error occurred with the request.';
      let errorData = null;
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If it's not JSON, try to get text
        const text = await response.text();
        if (text) errorMessage = text;
      }

      // Handle 401 Unauthorized globally
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      throw new ApiError(errorMessage, response.status, errorData);
    }

    // Attempt to return empty for 204 or no content
    if (response.status === 204) return null;

    try {
      return await response.json();
    } catch (e) {
      return null;
    }
  } catch (error) {
    // Catch network errors (like server down)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError('Network error. Please check your connection.', 0);
    }
    throw error; // Rethrow ApiError
  }
}
