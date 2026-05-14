import { Batch, BatchStatus } from '@/types';
import { PaginatedResponse, SingleResponse } from './student.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const batchService = {
  async getBatches(filters?: { search?: string; status?: BatchStatus; teacherId?: string }, skip = 0, take = 50): Promise<PaginatedResponse<Batch & { _count?: { students: number } }>> {
    const params = new URLSearchParams();
    params.append('skip', String(skip));
    params.append('take', String(take));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all' as any) params.append('status', filters.status);
    if (filters?.teacherId) params.append('teacherId', filters.teacherId);

    const response = await fetch(`${API_BASE_URL}/batches?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch batches');
    return response.json();
  },

  async getBatchById(id: string): Promise<SingleResponse<Batch & { students: any[] }>> {
    const response = await fetch(`${API_BASE_URL}/batches/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Failed to fetch batch ${id}`);
    return response.json();
  },

  async createBatch(data: Partial<Batch>): Promise<SingleResponse<Batch>> {
    const response = await fetch(`${API_BASE_URL}/batches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || 'Failed to create batch');
    }
    return response.json();
  },

  async updateBatch(id: string, data: Partial<Batch>): Promise<SingleResponse<Batch>> {
    const response = await fetch(`${API_BASE_URL}/batches/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update batch');
    return response.json();
  },

  async assignStudent(batchId: string, studentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/batches/${batchId}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ studentId }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || 'Failed to assign student');
    }
  },

  async removeStudent(batchId: string, studentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/batches/${batchId}/students/${studentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to remove student from batch');
  },
};
