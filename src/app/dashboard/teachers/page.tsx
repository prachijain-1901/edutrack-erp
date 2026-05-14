"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ActiveBadge } from "@/components/shared/status-badge";
import { teacherService } from "@/services/teacher.service";
import { formatDate } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true);
        const res = await teacherService.getTeachers(searchTerm, 0, 50);
        setTeachers(res.data.data as any);
      } catch (err: any) {
        setError(err.message || "Failed to load teachers");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simple debounce for search
    const timer = setTimeout(() => {
      fetchTeachers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description={`${teachers.length} teachers on staff`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link href="/dashboard/teachers/new">
                <Plus className="w-4 h-4" />
                Add Teacher
              </Link>
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search teachers by name, phone, or email..."
          id="teacher-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
      </div>

      {/* Teacher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p>Loading teachers...</p>
          </div>
        ) : error ? (
          <div className="col-span-full py-12 text-center text-destructive flex flex-col items-center">
            <p>{error}</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No teachers found.
          </div>
        ) : (
          teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12 shrink-0">
                <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                  {getInitials(teacher.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground truncate">{teacher.name}</h3>
                  <ActiveBadge isActive={teacher.isActive} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{teacher.employeeId}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-24 shrink-0">Subjects</span>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects?.map((s: string) => (
                    <span
                      key={s}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-24 shrink-0">Qualification</span>
                <span className="text-foreground truncate">{teacher.qualification || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-24 shrink-0">Phone</span>
                <span className="text-foreground">{teacher.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-24 shrink-0">Joining Date</span>
                <span className="text-foreground">{formatDate(teacher.joiningDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-24 shrink-0">Batches</span>
                <span className="text-foreground">{teacher._count?.batches || 0} batches</span>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}
