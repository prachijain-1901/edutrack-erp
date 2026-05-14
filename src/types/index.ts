// ─────────────────────────────────────────────
// Core Entity Types
// ─────────────────────────────────────────────

export type Role = "admin" | "teacher" | "accountant" | "receptionist";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email?: string;
  phone: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  photo?: string;
  // Parent / Guardian
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  parentRelation?: "father" | "mother" | "guardian";
  parentOccupation?: string;
  alternatePhone?: string;
  // Academic
  grade?: string;       // e.g. "Class X", "Class XII"
  medium?: string;      // e.g. "English", "Hindi"
  previousSchool?: string;
  batchIds: string[];
  // Fee
  feeStatus: FeeStatus;
  feeBalance?: number;  // outstanding balance in INR
  // Attendance
  attendanceRate?: number; // 0–100 percentage
  // Status
  isActive: boolean;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Student Activity / Timeline
// ─────────────────────────────────────────────

export type ActivityType =
  | "enrollment"
  | "fee_paid"
  | "fee_overdue"
  | "attendance_alert"
  | "batch_change"
  | "status_change"
  | "message_sent"
  | "note_added";

export interface StudentActivity {
  id: string;
  studentId: string;
  type: ActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
}

// ─────────────────────────────────────────────
// Student Document
// ─────────────────────────────────────────────

export type DocumentType = "aadhar" | "birth_certificate" | "transfer_cert" | "photo" | "other";

export interface StudentDocument {
  id: string;
  studentId: string;
  type: DocumentType;
  name: string;
  url?: string;
  uploadedAt: string;
}

// ─────────────────────────────────────────────
// Student Form (multi-step)
// ─────────────────────────────────────────────

export interface StudentFormData {
  // Step 1: Student Details
  name: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  // Step 2: Parent Details
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentEmail: string;
  parentOccupation: string;
  alternatePhone: string;
  // Step 3: Academic Details
  grade: string;
  medium: string;
  previousSchool: string;
  // Step 4: Batch Assignment
  batchIds: string[];
  // Step 5: Fee Plan
  feeAmount: number;
  feeFrequency: "monthly" | "quarterly" | "annual";
  discountPercent: number;
  // Step 6: Review
}

// ─────────────────────────────────────────────
// Student Filter State
// ─────────────────────────────────────────────

export interface StudentFilters {
  search: string;
  feeStatus: FeeStatus | "all";
  isActive: boolean | "all";
  grade: string | "all";
  batchId: string | "all";
  attendanceBelow: number | null;
  sortBy: "name" | "enrollmentDate" | "feeStatus" | "attendanceRate" | "grade";
  sortOrder: "asc" | "desc";
}

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  qualification: string;
  experience: number; // years
  photo?: string;
  batchIds: string[];
  salary?: number;
  joiningDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName?: string;
  studentCount?: number;
  schedule: BatchSchedule[];
  room?: string;
  startDate: string;
  endDate?: string;
  fees: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BatchStatus = "active" | "inactive" | "completed" | "all";

export interface BatchSchedule {
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// ─────────────────────────────────────────────
// Attendance Types
// ─────────────────────────────────────────────

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "LEAVE";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  batchId: string;
  batchName?: string;
  date: string; // ISO date string
  status: AttendanceStatus;
  markedBy: string; // teacher/admin userId
  remarks?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Fee Types
// ─────────────────────────────────────────────

export type FeeStatus = "PAID" | "PENDING" | "PARTIAL" | "OVERDUE";
export type FeeType = "tuition" | "registration" | "exam" | "material" | "other";
export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | "CARD";

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName?: string;
  batchId?: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  feeType: FeeType;
  dueDate: string;
  paidDate?: string;
  paymentMode?: PaymentMode;
  status: FeeStatus;
  invoiceNumber?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Announcement Types
// ─────────────────────────────────────────────

export type AnnouncementTarget = "all" | "students" | "teachers" | "parents" | "batch";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: AnnouncementTarget;
  targetBatchId?: string;
  isPinned: boolean;
  isPublished: boolean;
  publishedAt?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// UI/Navigation Types
// ─────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ─────────────────────────────────────────────
// API/Response Types
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─────────────────────────────────────────────
// Dashboard Stat Types
// ─────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  value: string | number;
  change?: number; // percentage change
  changeLabel?: string;
  icon: string;
  color: "primary" | "success" | "warning" | "danger" | "info";
}

// ─────────────────────────────────────────────
// WhatsApp & Communications
// ─────────────────────────────────────────────

export type WhatsAppStatus = "PENDING" | "SENT" | "FAILED" | "DELIVERED" | "READ";

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  type: "TRANSACTIONAL" | "PROMOTIONAL" | "OTP";
  createdAt: string;
  updatedAt: string;
}

export interface MessageLog {
  id: string;
  recipient: string;
  message: string;
  status: WhatsAppStatus;
  error?: string;
  sentAt?: string;
  templateId?: string;
  template?: MessageTemplate;
  createdAt: string;
}

export interface WhatsAppStats {
  total: number;
  sent: number;
  failed: number;
  delivered: number;
}

