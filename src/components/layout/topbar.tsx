"use client";

import { useEffect, useState } from "react";
import { Menu, Bell, Search, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatRelativeTime } from "@/lib/utils";
import { communicationService } from "@/services/communication.service";

// ─────────────────────────────────────────────
// Top Navbar
// ─────────────────────────────────────────────

export function Topbar() {
  const { toggleMobile } = useSidebar();
  const breadcrumbs = useBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1]?.label ?? "Dashboard";

  const [notifications, setNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await communicationService.getNotifications();
        setNotifications(res.data || res);
      } catch (e) {
        // silently fail for layout
      }
    };
    fetchNotifications();

    // ─── Realtime Listener ───
    const handleNewNotification = (event: any) => {
      setNotifications(prev => [event.detail, ...prev]);
    };

    window.addEventListener("erp:new_notification", handleNewNotification);
    return () => window.removeEventListener("erp:new_notification", handleNewNotification);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await communicationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await communicationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-card/80 backdrop-blur-sm border-b border-border flex items-center px-4 gap-4 shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={toggleMobile}
        className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Breadcrumb / Page Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-foreground truncate">
          {currentPage}
        </h1>
        {breadcrumbs.length > 1 && (
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1">
                {idx > 0 && <span>/</span>}
                <span
                  className={cn(
                    idx === breadcrumbs.length - 1
                      ? "text-foreground font-medium"
                      : "hover:text-foreground"
                  )}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Search trigger (placeholder) */}
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors border border-border"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
          <span className="text-xs">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] rounded-full"
                >
                  {unreadCount}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">
                  Mark all as read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No notifications right now.
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.slice(0, 10).map((notif) => (
                  <div 
                    key={notif.id} 
                    className={cn(
                      "flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                      !notif.isRead && "bg-muted/10"
                    )}
                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      notif.type === 'ERROR' ? "bg-destructive/10 text-destructive" :
                      notif.type === 'WARNING' ? "bg-amber-100 text-amber-600" :
                      notif.type === 'SUCCESS' ? "bg-emerald-100 text-emerald-600" :
                      "bg-primary/10 text-primary"
                    )}>
                      {notif.type === 'ERROR' ? <AlertTriangle className="w-4 h-4" /> :
                       notif.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> :
                       <Info className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm line-clamp-1", !notif.isRead ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        {formatRelativeTime(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors focus:outline-none"
            aria-label="User menu"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-foreground leading-tight">
                Admin User
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Administrator
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@edutrack.in</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Institute Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
