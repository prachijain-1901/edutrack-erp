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
  ChevronLeft,
  ChevronRight,
  BookMarked,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { APP_NAME } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─────────────────────────────────────────────
// Nav Item Config
// ─────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    href: "/dashboard/students",
    icon: GraduationCap,
    badge: 3, // overdue fee count placeholder
  },
  {
    label: "Teachers",
    href: "/dashboard/teachers",
    icon: Users,
  },
  {
    label: "Batches",
    href: "/dashboard/batches",
    icon: BookOpen,
  },
  {
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: CalendarCheck,
  },
  {
    label: "Fees",
    href: "/dashboard/fees",
    icon: IndianRupee,
  },
  {
    label: "Announcements",
    href: "/dashboard/announcements",
    icon: Megaphone,
  },
  {
    label: "WhatsApp",
    href: "/dashboard/whatsapp",
    icon: MessageSquare,
  },
] as const;

const BOTTOM_ITEMS = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

// ─────────────────────────────────────────────
// Sidebar Component
// ─────────────────────────────────────────────

export function Sidebar() {
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border sidebar-transition overflow-hidden shrink-0 z-30",
        isCollapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* ─── Logo ─── */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary shrink-0">
          <BookMarked className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-sidebar-primary leading-tight truncate">
              {APP_NAME}
            </p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">
              Institute ERP
            </p>
          </div>
        )}
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            isActive={
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)
            }
          />
        ))}
      </nav>

      {/* ─── Bottom Items ─── */}
      <div className="px-2 pb-4 space-y-1 border-t border-sidebar-border pt-4">
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            isActive={pathname.startsWith(item.href)}
          />
        ))}

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapsed}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-150 text-sm font-medium mt-1",
            isCollapsed && "justify-center"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// NavLink Sub-component
// ─────────────────────────────────────────────

interface NavLinkProps {
  item: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
  };
  isCollapsed: boolean;
  isActive: boolean;
}

function NavLink({ item, isCollapsed, isActive }: NavLinkProps) {
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
        isCollapsed && "justify-center",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon
        className={cn(
          "w-4.5 h-4.5 shrink-0",
          isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60"
        )}
        style={{ width: 18, height: 18 }}
      />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge != null && item.badge > 0 && (
            <Badge
              variant="destructive"
              className="h-5 min-w-5 px-1.5 text-[10px] rounded-full"
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.label}
          {item.badge != null && item.badge > 0 && (
            <Badge variant="destructive" className="ml-2 h-4 px-1 text-[10px]">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
