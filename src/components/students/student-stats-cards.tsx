import { cn, formatCurrency } from "@/lib/utils";
import { GraduationCap, UserCheck, AlertCircle, TrendingDown } from "lucide-react";
import type { Student } from "@/types";

// ─────────────────────────────────────────────
// Student Stats Cards
// ─────────────────────────────────────────────

interface StudentStatsCardsProps {
  students: Student[];
}

export function StudentStatsCards({ students }: StudentStatsCardsProps) {
  const total = students.length;
  const active = students.filter((s) => s.isActive).length;
  const pendingFee = students.filter(
    (s) => s.feeStatus === "PENDING" || s.feeStatus === "OVERDUE" || s.feeStatus === "PARTIAL"
  ).length;
  const totalDue = students.reduce((acc, s) => acc + (s.feeBalance ?? 0), 0);
  const lowAttendance = students.filter(
    (s) => s.isActive && (s.attendanceRate ?? 100) < 75
  ).length;

  const stats = [
    {
      label: "Total Students",
      value: total,
      sub: `${active} active`,
      icon: GraduationCap,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      border: "border-primary/20",
    },
    {
      label: "Active Students",
      value: active,
      sub: `${total - active} inactive`,
      icon: UserCheck,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      border: "border-emerald-200",
    },
    {
      label: "Fee Pending",
      value: pendingFee,
      sub: formatCurrency(totalDue) + " total due",
      icon: AlertCircle,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "border-amber-200",
    },
    {
      label: "Low Attendance",
      value: lowAttendance,
      sub: "Below 75% attendance",
      icon: TrendingDown,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      border: "border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={cn(
            "bg-card border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow",
            s.border
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                s.iconBg
              )}
            >
              <s.icon className={cn("w-5 h-5", s.iconColor)} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {s.value}
          </p>
          <p className="text-sm font-medium text-foreground mt-0.5">{s.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
