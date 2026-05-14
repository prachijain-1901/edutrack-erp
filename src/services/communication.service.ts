const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const communicationService = {
  // Announcements
  async createAnnouncement(data: any) {
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create announcement');
    return response.json();
  },

  async getAnnouncements(type?: string, targetAudience?: string) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (targetAudience) params.append('targetAudience', targetAudience);

    const response = await fetch(`${API_BASE_URL}/announcements?${params.toString()}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch announcements');
    return response.json();
  },

  async deleteAnnouncement(id: string) {
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete announcement');
    return response.json();
  },

  // Notifications
  async getNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  async markAsRead(id: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
  },

  async markAllAsRead() {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to mark all as read');
    return response.json();
  }
};
