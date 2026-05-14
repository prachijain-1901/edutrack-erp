"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  IndianRupee,
  Megaphone,
  Settings,
  X,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { APP_NAME } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

// ─────────────────────────────────────────────
// Nav Items (mirror of sidebar.tsx)
// ─────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/dashboard/students", icon: GraduationCap, badge: 3 },
  { label: "Teachers", href: "/dashboard/teachers", icon: Users },
  { label: "Batches", href: "/dashboard/batches", icon: BookOpen },
  { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { label: "Fees", href: "/dashboard/fees", icon: IndianRupee },
  { label: "Announcements", href: "/dashboard/announcements", icon: Megaphone },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

// ─────────────────────────────────────────────
// Mobile Sidebar (Sheet / Drawer)
// ─────────────────────────────────────────────

export function MobileSidebar() {
  const { isMobileOpen, closeMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <Sheet open={isMobileOpen} onOpenChange={(open) => !open && closeMobile()}>
      <SheetContent side="left" className="p-0 w-[260px] bg-sidebar border-sidebar-border">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-sidebar-primary leading-tight">
                {APP_NAME}
              </p>
              <p className="text-[10px] text-sidebar-foreground/50">
                Institute ERP
              </p>
            </div>
          </div>
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/60"
                  )}
                  style={{ width: 18, height: 18 }}
                />
                <span className="flex-1">{item.label}</span>
                {"badge" in item && item.badge != null && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 min-w-5 px-1.5 text-[10px] rounded-full"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
