import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, User, Briefcase } from "lucide-react";
import type { Student } from "@/types";

// ─────────────────────────────────────────────
// Parent Info Card
// ─────────────────────────────────────────────

interface ParentInfoCardProps {
  student: Student;
  className?: string;
}

export function ParentInfoCard({ student, className }: ParentInfoCardProps) {
  const relationLabel =
    student.parentRelation
      ? student.parentRelation.charAt(0).toUpperCase() + student.parentRelation.slice(1)
      : "Guardian";

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-5 shadow-sm",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Parent / Guardian
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-11 h-11 shrink-0">
          <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
            {getInitials(student.parentName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{student.parentName}</p>
          <p className="text-xs text-muted-foreground">{relationLabel}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
          <a
            href={`tel:${student.parentPhone}`}
            className="text-primary hover:underline"
          >
            {student.parentPhone}
          </a>
        </div>

        {student.alternatePhone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <a
                href={`tel:${student.alternatePhone}`}
                className="text-primary hover:underline"
              >
                {student.alternatePhone}
              </a>
              <span className="text-xs text-muted-foreground ml-1">(alt)</span>
            </div>
          </div>
        )}

        {student.parentEmail && (
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <a
              href={`mailto:${student.parentEmail}`}
              className="text-primary hover:underline truncate"
            >
              {student.parentEmail}
            </a>
          </div>
        )}

        {student.parentRelation && (
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-foreground capitalize">
              {student.parentRelation}
            </span>
          </div>
        )}

        {student.parentOccupation && (
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">{student.parentOccupation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
