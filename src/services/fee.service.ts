const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const feeService = {
  // Fee Plans
  async createPlan(data: any) {
    const response = await fetch(`${API_BASE_URL}/fees/plans`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create fee plan');
    return response.json();
  },

  async getPlans() {
    const response = await fetch(`${API_BASE_URL}/fees/plans`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch fee plans');
    return response.json();
  },

  async assignPlan(data: any) {
    const response = await fetch(`${API_BASE_URL}/fees/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to assign fee plan');
    return response.json();
  },

  // Student Fees
  async getStudentFees(studentId: string) {
    const response = await fetch(`${API_BASE_URL}/fees/student/${studentId}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch student fees');
    return response.json();
  },

  async getPendingFees() {
    const response = await fetch(`${API_BASE_URL}/fees/pending`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch pending fees');
    return response.json();
  },

  // Payments
  async recordPayment(data: any) {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || 'Failed to record payment');
    }
    return response.json();
  },

  async getPaymentsByStudent(studentId: string) {
    const response = await fetch(`${API_BASE_URL}/payments/${studentId}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
  }
};
