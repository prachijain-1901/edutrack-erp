import { cn, getInitials, formatDate, formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FeeStatusBadge, ActiveBadge } from "@/components/shared/status-badge";
import type { Student } from "@/types";
import { Phone, Mail, MapPin, BookOpen, GraduationCap } from "lucide-react";

// ─────────────────────────────────────────────
// Student Details Card
// ─────────────────────────────────────────────

interface StudentDetailsCardProps {
  student: Student;
  className?: string;
}

export function StudentDetailsCard({ student, className }: StudentDetailsCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-2xl p-5 shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <Avatar className="w-14 h-14 shrink-0">
          <AvatarFallback className="bg-primary/15 text-primary text-lg font-bold">
            {getInitials(student.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="text-base font-bold text-foreground">{student.name}</h3>
              <p className="text-sm text-muted-foreground">
                Roll #{student.rollNumber}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FeeStatusBadge status={student.feeStatus} />
              <ActiveBadge isActive={student.isActive} />
            </div>
          </div>
          {student.grade && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {student.grade} · {student.medium ?? ""} Medium
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-2.5">
        {student.phone && (
          <InfoRow icon={Phone} label="Phone" value={student.phone} />
        )}
        {student.email && (
          <InfoRow icon={Mail} label="Email" value={student.email} />
        )}
        {(student.city || student.state) && (
          <InfoRow
            icon={MapPin}
            label="Location"
            value={[student.city, student.state].filter(Boolean).join(", ")}
          />
        )}
        {student.batchIds.length > 0 && (
          <InfoRow
            icon={BookOpen}
            label="Batches"
            value={`${student.batchIds.length} batch${student.batchIds.length > 1 ? "es" : ""}`}
          />
        )}
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">
            {student.attendanceRate ?? "—"}
            {student.attendanceRate != null ? "%" : ""}
          </p>
          <p className="text-xs text-muted-foreground">Attendance</p>
        </div>
        <div className="text-center">
          <p
            className={cn(
              "text-lg font-bold",
              (student.feeBalance ?? 0) > 0
                ? "text-rose-600"
                : "text-emerald-600"
            )}
          >
            {student.feeBalance != null
              ? formatCurrency(student.feeBalance)
              : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Balance Due</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">
            {formatDate(student.enrollmentDate)}
          </p>
          <p className="text-xs text-muted-foreground">Enrolled</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Info Row Sub-component
// ─────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
      <span className="text-sm text-foreground truncate">{value}</span>
    </div>
  );
}
