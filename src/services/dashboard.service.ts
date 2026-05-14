const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const dashboardService = {
  async getOverview() {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch dashboard overview');
    return response.json();
  },

  async getRevenue() {
    const response = await fetch(`${API_BASE_URL}/dashboard/revenue`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch revenue metrics');
    return response.json();
  },

  async getAttendance() {
    const response = await fetch(`${API_BASE_URL}/dashboard/attendance`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch attendance metrics');
    return response.json();
  },

  async getStudents() {
    const response = await fetch(`${API_BASE_URL}/dashboard/students`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch student metrics');
    return response.json();
  },

  async getAlerts() {
    const response = await fetch(`${API_BASE_URL}/dashboard/alerts`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch dashboard alerts');
    return response.json();
  }
};
