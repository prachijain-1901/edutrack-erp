import { Student, StudentFilters, StudentFormData } from '@/types';
import { apiClient } from '@/lib/api-client';

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  timestamp: string;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const studentService = {
  // ─── GET ALL ────────────────────────────────────────────────────────────
  async getStudents(filters?: Partial<StudentFilters>, pagination?: { skip?: number; take?: number }): Promise<PaginatedResponse<Student>> {
    const params: Record<string, any> = {};

    if (pagination?.skip !== undefined) params.skip = pagination.skip;
    if (pagination?.take !== undefined) params.take = pagination.take;

    if (filters) {
      if (filters.search) params.search = filters.search;
      if (filters.grade && filters.grade !== 'all') params.grade = filters.grade;
      if (filters.isActive !== 'all') {
        params.status = filters.isActive ? 'ACTIVE' : 'INACTIVE';
      }
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    }

    return apiClient('/students', { params });
  },

  // ─── GET ONE ────────────────────────────────────────────────────────────
  async getStudentById(id: string): Promise<SingleResponse<Student>> {
    return apiClient(`/students/${id}`);
  },

  // ─── CREATE ─────────────────────────────────────────────────────────────
  async createStudent(data: StudentFormData): Promise<SingleResponse<Student>> {
    // Map Frontend Form Data to Backend DTO
    const payload = {
      firstName: data.name.split(' ')[0] || data.name,
      lastName: data.name.split(' ').slice(1).join(' ') || '',
      gender: data.gender,
      dob: new Date(data.dateOfBirth).toISOString(),
      grade: data.grade,
      schoolName: data.previousSchool,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      bloodGroup: data.bloodGroup,
      status: 'ACTIVE',
      parent: {
        fatherName: data.parentRelation === 'father' ? data.parentName : undefined,
        motherName: data.parentRelation === 'mother' ? data.parentName : undefined,
        phone: data.parentPhone,
        alternatePhone: data.alternatePhone,
        email: data.parentEmail,
        occupation: data.parentOccupation,
      },
    };

    return apiClient('/students', { data: payload });
  },

  // ─── DELETE ─────────────────────────────────────────────────────────────
  async deleteStudent(id: string): Promise<void> {
    return apiClient(`/students/${id}`, { method: 'DELETE' });
  },
};
