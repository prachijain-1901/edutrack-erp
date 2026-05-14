import { cn } from "@/lib/utils";
import type { FeeStatus, AttendanceStatus } from "@/types";

// ─────────────────────────────────────────────
// Status Badge for Fee Status
// ─────────────────────────────────────────────

const FEE_STATUS_CONFIG: Record<
  FeeStatus,
  { label: string; className: string }
> = {
  PAID: {
    label: "Paid",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  PARTIAL: {
    label: "Partial",
    className: "bg-sky-100 text-sky-800 border-sky-200",
  },
  OVERDUE: {
    label: "Overdue",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
};

interface FeeStatusBadgeProps {
  status: FeeStatus;
  className?: string;
}

export function FeeStatusBadge({ status, className }: FeeStatusBadgeProps) {
  const config = FEE_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Status Badge for Attendance
// ─────────────────────────────────────────────

const ATTENDANCE_STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; className: string }
> = {
  PRESENT: {
    label: "Present",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  ABSENT: {
    label: "Absent",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
  LATE: {
    label: "Late",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  LEAVE: {
    label: "Leave",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

export function AttendanceStatusBadge({
  status,
  className,
}: AttendanceStatusBadgeProps) {
  const config = ATTENDANCE_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Active / Inactive Badge
// ─────────────────────────────────────────────

interface ActiveBadgeProps {
  isActive: boolean;
  className?: string;
}

export function ActiveBadge({ isActive, className }: ActiveBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        isActive
          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
          : "bg-slate-100 text-slate-600 border-slate-200",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-slate-400"
        )}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
