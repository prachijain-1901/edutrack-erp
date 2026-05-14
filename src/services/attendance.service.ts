import { PaginatedResponse, SingleResponse } from './student.service';
import { AttendanceStatus } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface AttendanceRecordPayload {
  studentId: string;
  batchId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export const attendanceService = {
  async markBulk(records: AttendanceRecordPayload[]): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/attendance/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ records }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || 'Failed to mark attendance');
    }
    return response.json();
  },

  async getByBatch(batchId: string, date: string): Promise<any> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);

    const response = await fetch(`${API_BASE_URL}/attendance/batch/${batchId}?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch batch attendance');
    return response.json();
  },

  async getByStudent(studentId: string, limit: number = 30): Promise<any> {
    const params = new URLSearchParams({ limit: String(limit) });
    const response = await fetch(`${API_BASE_URL}/attendance/student/${studentId}?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch student attendance');
    return response.json();
  },

  async getSummary(date?: string, batchId?: string): Promise<any> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (batchId) params.append('batchId', batchId);

    const response = await fetch(`${API_BASE_URL}/attendance/summary?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch attendance summary');
    return response.json();
  },
};
