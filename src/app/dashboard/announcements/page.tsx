"use client";

import { useEffect, useState } from "react";
import { Plus, Pin, Megaphone, Users, GraduationCap, BookOpen, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { communicationService } from "@/services/communication.service";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TARGET_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  ALL: { label: "Everyone", icon: Megaphone, color: "bg-primary/10 text-primary" },
  STUDENTS: { label: "Students", icon: GraduationCap, color: "bg-emerald-100 text-emerald-700" },
  TEACHERS: { label: "Teachers", icon: Users, color: "bg-sky-100 text-sky-700" },
  PARENTS: { label: "Parents", icon: Users, color: "bg-violet-100 text-violet-700" },
  BATCH: { label: "Batch", icon: BookOpen, color: "bg-amber-100 text-amber-700" },
};

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  GENERAL: { label: "General", icon: Megaphone, color: "text-primary" },
  EMERGENCY: { label: "Emergency", icon: AlertTriangle, color: "text-destructive" },
  EXAM: { label: "Exam", icon: BookOpen, color: "text-amber-600" },
  HOLIDAY: { label: "Holiday", icon: Pin, color: "text-emerald-600" },
  FEES: { label: "Fees", icon: Pin, color: "text-blue-600" },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("GENERAL");
  const [targetAudience, setTargetAudience] = useState("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      const res = await communicationService.getAnnouncements();
      setAnnouncements(res.data || res);
    } catch (error) {
      console.error("Failed to load announcements", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await communicationService.createAnnouncement({
        title,
        message,
        type,
        targetAudience,
      });
      setIsCreating(false);
      setTitle("");
      setMessage("");
      loadAnnouncements();
    } catch (error) {
      alert("Failed to create announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mocking pinned (e.g. emergencies)
  const pinned = announcements.filter((a) => a.type === 'EMERGENCY');
  const regular = announcements.filter((a) => a.type !== 'EMERGENCY');

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Announcements"
        description="Communicate with students, teachers, and parents."
        actions={
          !isCreating && (
            <Button size="sm" className="gap-2" onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4" />
              New Announcement
            </Button>
          )
        }
      />

      {isCreating && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-lg mb-4">Create Announcement</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <input
                  required
                  type="text"
                  placeholder="Announcement title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="GENERAL">General</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="EXAM">Exam</option>
                  <option value="HOLIDAY">Holiday</option>
                  <option value="FEES">Fees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="ALL">Everyone</option>
                  <option value="STUDENTS">Students</option>
                  <option value="TEACHERS">Teachers</option>
                  <option value="PARENTS">Parents</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your announcement details here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Publish Announcement
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No announcements published yet.
        </div>
      ) : (
        <>
          {/* Pinned / Emergency */}
          {pinned.length > 0 && (
            <section aria-labelledby="pinned-heading">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h3 id="pinned-heading" className="text-sm font-semibold text-foreground">
                  Emergency & Pinned
                </h3>
              </div>
              <div className="space-y-3">
                {pinned.map((ann) => (
                  <AnnouncementCard key={ann.id} announcement={ann} isPinned />
                ))}
              </div>
            </section>
          )}

          {/* All Announcements */}
          <section aria-labelledby="all-announcements-heading" className={pinned.length > 0 ? "mt-8" : ""}>
            <h3 id="all-announcements-heading" className="text-sm font-semibold text-foreground mb-3">
              All Announcements
            </h3>
            <div className="space-y-3">
              {regular.map((ann) => (
                <AnnouncementCard key={ann.id} announcement={ann} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function AnnouncementCard({
  announcement,
  isPinned = false,
}: {
  announcement: any;
  isPinned?: boolean;
}) {
  const target = TARGET_CONFIG[announcement.targetAudience] || TARGET_CONFIG.ALL;
  const TargetIcon = target.icon;
  const typeConf = TYPE_CONFIG[announcement.type] || TYPE_CONFIG.GENERAL;
  const TypeIcon = typeConf.icon;

  return (
    <div
      className={`bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow ${
        isPinned ? "border-destructive/30 bg-destructive/5" : "border-border"
      }`}
    >
      <div className="flex items-start gap-4">
        <Avatar className="w-9 h-9 shrink-0 mt-0.5">
          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
            {getInitials("Admin")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground">{announcement.title}</h4>
            <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted ${typeConf.color}`}>
              <TypeIcon className="w-2.5 h-2.5" />
              {typeConf.label}
            </span>
            <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${target.color}`}>
              <TargetIcon className="w-2.5 h-2.5" />
              {target.label}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
            {announcement.message}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>By Admin</span>
            <span>·</span>
            <span>{formatRelativeTime(announcement.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
