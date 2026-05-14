const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const settingsService = {
  // Institute
  async getInstituteSettings() {
    const response = await fetch(`${API_BASE_URL}/settings/institute`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch institute settings');
    return response.json();
  },
  async updateInstituteSettings(data: any) {
    const response = await fetch(`${API_BASE_URL}/settings/institute`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update institute settings');
    return response.json();
  },

  // Attendance
  async getAttendanceSettings() {
    const response = await fetch(`${API_BASE_URL}/settings/attendance`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch attendance settings');
    return response.json();
  },
  async updateAttendanceSettings(data: any) {
    const response = await fetch(`${API_BASE_URL}/settings/attendance`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update attendance settings');
    return response.json();
  },

  // Fees
  async getFeeSettings() {
    const response = await fetch(`${API_BASE_URL}/settings/fees`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch fee settings');
    return response.json();
  },
  async updateFeeSettings(data: any) {
    const response = await fetch(`${API_BASE_URL}/settings/fees`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update fee settings');
    return response.json();
  },

  // Notifications
  async getNotificationSettings() {
    const response = await fetch(`${API_BASE_URL}/settings/notifications`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch notification settings');
    return response.json();
  },
  async updateNotificationSettings(data: any) {
    const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update notification settings');
    return response.json();
  }
};
