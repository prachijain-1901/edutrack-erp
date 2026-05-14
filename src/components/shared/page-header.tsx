import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─────────────────────────────────────────────
// Page Header Component
// ─────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        className
      )}
    >
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
