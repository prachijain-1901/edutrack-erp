import { cn, formatRelativeTime } from "@/lib/utils";
import type { StudentActivity, ActivityType } from "@/types";
import {
  GraduationCap,
  IndianRupee,
  AlertCircle,
  ArrowLeftRight,
  PowerOff,
  MessageSquare,
  FileText,
  TrendingDown,
} from "lucide-react";

// ─────────────────────────────────────────────
// Activity Timeline
// ─────────────────────────────────────────────

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: React.ElementType; iconBg: string; iconColor: string }
> = {
  enrollment: {
    icon: GraduationCap,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  fee_paid: {
    icon: IndianRupee,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  fee_overdue: {
    icon: AlertCircle,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  attendance_alert: {
    icon: TrendingDown,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  batch_change: {
    icon: ArrowLeftRight,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  status_change: {
    icon: PowerOff,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  message_sent: {
    icon: MessageSquare,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  note_added: {
    icon: FileText,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
};

interface ActivityTimelineProps {
  activities: StudentActivity[];
  className?: string;
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-0", className)}>
      {activities.map((activity, idx) => {
        const config = ACTIVITY_CONFIG[activity.type];
        const Icon = config.icon;
        const isLast = idx === activities.length - 1;

        return (
          <div key={activity.id} className="flex gap-3">
            {/* Icon + Line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  config.iconBg
                )}
              >
                <Icon className={cn("w-4 h-4", config.iconColor)} />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-border my-1.5" />
              )}
            </div>

            {/* Content */}
            <div className={cn("flex-1 min-w-0 pb-4", isLast && "pb-0")}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {activity.title}
                </p>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  {formatRelativeTime(activity.createdAt)}
                </span>
              </div>
              {activity.description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {activity.description}
                </p>
              )}
              {activity.createdBy && (
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  by {activity.createdBy}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
