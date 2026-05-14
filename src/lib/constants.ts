// ─────────────────────────────────────────────
// App Constants
// ─────────────────────────────────────────────

export const APP_NAME = "EduTrack ERP";
export const APP_TAGLINE = "Smart Coaching Institute Management";
export const APP_VERSION = "1.0.0";

// ─────────────────────────────────────────────
// Navigation Routes
// ─────────────────────────────────────────────

export const ROUTES = {
  DASHBOARD: "/dashboard",
  STUDENTS: "/dashboard/students",
  STUDENTS_NEW: "/dashboard/students/new",
  TEACHERS: "/dashboard/teachers",
  TEACHERS_NEW: "/dashboard/teachers/new",
  BATCHES: "/dashboard/batches",
  BATCHES_NEW: "/dashboard/batches/new",
  ATTENDANCE: "/dashboard/attendance",
  FEES: "/dashboard/fees",
  ANNOUNCEMENTS: "/dashboard/announcements",
  SETTINGS: "/dashboard/settings",
  LOGIN: "/login",
} as const;

// ─────────────────────────────────────────────
// Sidebar Navigation Items
// ─────────────────────────────────────────────

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: "LayoutDashboard",
  },
  {
    label: "Students",
    href: ROUTES.STUDENTS,
    icon: "GraduationCap",
    badge: 0,
  },
  {
    label: "Teachers",
    href: ROUTES.TEACHERS,
    icon: "Users",
  },
  {
    label: "Batches",
    href: ROUTES.BATCHES,
    icon: "BookOpen",
  },
  {
    label: "Attendance",
    href: ROUTES.ATTENDANCE,
    icon: "CalendarCheck",
  },
  {
    label: "Fees",
    href: ROUTES.FEES,
    icon: "IndianRupee",
  },
  {
    label: "Announcements",
    href: ROUTES.ANNOUNCEMENTS,
    icon: "Megaphone",
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: "Settings",
  },
] as const;

// ─────────────────────────────────────────────
// Fee Types
// ─────────────────────────────────────────────

export const FEE_STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  pending: "Pending",
  partial: "Partial",
  overdue: "Overdue",
};

export const FEE_STATUS_COLORS: Record<string, string> = {
  paid: "success",
  pending: "warning",
  partial: "info",
  overdue: "danger",
};

// ─────────────────────────────────────────────
// Attendance Status
// ─────────────────────────────────────────────

export const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
};

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
