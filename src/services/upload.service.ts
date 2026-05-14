const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const uploadService = {
  async uploadStudentDocument(studentId: string, file: File, category: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const response = await fetch(`${API_BASE_URL}/uploads/student/${studentId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
  },

  async getStudentDocuments(studentId: string) {
    const response = await fetch(`${API_BASE_URL}/uploads/student/${studentId}`, {
      method: 'GET',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  },

  async deleteDocument(id: string) {
    const response = await fetch(`${API_BASE_URL}/uploads/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete document');
    return response.json();
  }
};
