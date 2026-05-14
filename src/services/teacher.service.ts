import { Teacher } from '@/types';
import { PaginatedResponse, SingleResponse } from './student.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const teacherService = {
  async getTeachers(search?: string, skip = 0, take = 50): Promise<PaginatedResponse<Teacher>> {
    const params = new URLSearchParams();
    params.append('skip', String(skip));
    params.append('take', String(take));
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/teachers?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch teachers');
    return response.json();
  },

  async getTeacherById(id: string): Promise<SingleResponse<Teacher>> {
    const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Failed to fetch teacher ${id}`);
    return response.json();
  },

  async createTeacher(data: Partial<Teacher>): Promise<SingleResponse<Teacher>> {
    const response = await fetch(`${API_BASE_URL}/teachers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || 'Failed to create teacher');
    }
    return response.json();
  },

  async updateTeacher(id: string, data: Partial<Teacher>): Promise<SingleResponse<Teacher>> {
    const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update teacher');
    return response.json();
  },
};
