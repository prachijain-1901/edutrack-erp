import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

// ─────────────────────────────────────────────
// Stat Card Component
// ─────────────────────────────────────────────

interface StatCardProps {
  stat: DashboardStat;
  className?: string;
}

const COLOR_MAP: Record<string, { bg: string; icon: string; badge: string }> = {
  primary: {
    bg: "bg-primary/10",
    icon: "text-primary",
    badge: "bg-primary/10 text-primary",
  },
  success: {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-600",
    badge: "bg-emerald-500/10 text-emerald-700",
  },
  warning: {
    bg: "bg-amber-500/10",
    icon: "text-amber-600",
    badge: "bg-amber-500/10 text-amber-700",
  },
  danger: {
    bg: "bg-rose-500/10",
    icon: "text-rose-600",
    badge: "bg-rose-500/10 text-rose-700",
  },
  info: {
    bg: "bg-sky-500/10",
    icon: "text-sky-600",
    badge: "bg-sky-500/10 text-sky-700",
  },
};

export function StatCard({ stat, className }: StatCardProps) {
  const colors = COLOR_MAP[stat.color] ?? COLOR_MAP.primary;
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[
    stat.icon
  ];
  const isPositive = (stat.change ?? 0) >= 0;

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            colors.bg
          )}
        >
          {IconComponent && (
            <IconComponent className={cn("w-5 h-5", colors.icon)} />
          )}
        </div>

        {stat.change != null && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              isPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(stat.change)}%
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {stat.value}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
        {stat.changeLabel && (
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            {stat.changeLabel}
          </p>
        )}
      </div>
    </div>
  );
}
