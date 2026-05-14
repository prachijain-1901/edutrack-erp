"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, Bell, CheckCircle2, AlertTriangle, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { communicationService } from "@/services/communication.service";
import { formatRelativeTime } from "@/lib/utils";

export default function CommunicationDashboard() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [annRes, notifRes] = await Promise.all([
          communicationService.getAnnouncements(),
          communicationService.getNotifications()
        ]);
        setAnnouncements(annRes.data || annRes);
        setNotifications(notifRes.data || notifRes);
      } catch (error) {
        console.error("Failed to load communication data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentAnnouncements = announcements.slice(0, 3);
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Communication Center"
        description="Manage announcements, alerts, and system notifications"
        actions={
          <Button size="sm" className="gap-2" asChild>
            <Link href="/dashboard/announcements">
              <Megaphone className="w-4 h-4" />
              New Announcement
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Announcements</p>
            <p className="text-3xl font-bold text-foreground">{announcements.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Unread Notifications</p>
            <p className="text-3xl font-bold text-foreground">{unreadCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Alerts</p>
            <p className="text-3xl font-bold text-foreground">
              {notifications.filter(n => n.type === 'ERROR' || n.type === 'WARNING').length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Recent Announcements
            </h3>
            <Link href="/dashboard/announcements" className="text-sm text-primary hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground py-4">Loading...</p>
            ) : recentAnnouncements.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No announcements published.</p>
            ) : (
              recentAnnouncements.map(ann => (
                <div key={ann.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                  <h4 className="font-medium text-sm mb-1">{ann.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{ann.message}</p>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {formatRelativeTime(ann.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-foreground" />
              Recent Notifications
            </h3>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground py-4">Loading...</p>
            ) : recentNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No recent notifications.</p>
            ) : (
              recentNotifications.map(notif => (
                <div key={notif.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'ERROR' ? 'bg-destructive/10 text-destructive' : notif.type === 'WARNING' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm ${notif.isRead ? 'font-medium text-muted-foreground' : 'font-semibold text-foreground'}`}>{notif.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 mb-1">{notif.message}</p>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeTime(notif.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
