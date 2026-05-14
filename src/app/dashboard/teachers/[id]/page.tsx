"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Phone, Mail, BookOpen, Calendar, IndianRupee, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { teacherService } from "@/services/teacher.service";
import { ActiveBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatDate, formatCurrency } from "@/lib/utils";

export default function TeacherDetailPage() {
  const params = useParams() as { id: string };
  const id = params?.id;

  const [teacher, setTeacher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await teacherService.getTeacherById(id);
        setTeacher(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load teacher details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-destructive gap-4">
        <p>{error || "Teacher not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/teachers">Back to Teachers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/teachers">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">Teacher Profile</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
        <Avatar className="w-24 h-24 shadow-sm border-2 border-background">
          <AvatarFallback className="text-3xl bg-primary/10 text-primary font-semibold">
            {getInitials(teacher.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-foreground">{teacher.name}</h2>
            <ActiveBadge isActive={teacher.isActive !== false} />
          </div>
          <p className="text-muted-foreground font-medium mb-4">{teacher.employeeId || 'EMP-' + teacher.id.slice(0, 4).toUpperCase()}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            {teacher.phone && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                {teacher.phone}
              </div>
            )}
            {teacher.email && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                {teacher.email}
              </div>
            )}
            {teacher.qualification && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Briefcase className="w-4 h-4 text-primary" />
                {teacher.qualification}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Professional Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Subjects</span>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects?.map((s: string) => (
                    <span key={s} className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-medium">
                      {s}
                    </span>
                  ))}
                  {(!teacher.subjects || teacher.subjects.length === 0) && (
                    <span className="text-muted-foreground italic">None assigned</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border/50">
                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4"/> Joining Date</span>
                <span className="font-medium">{formatDate(teacher.joiningDate)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border/50">
                <span className="text-muted-foreground flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Salary ({teacher.salaryType})</span>
                <span className="font-medium">{formatCurrency(teacher.salaryAmount || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm h-full">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Assigned Batches
            </h3>
            
            {!teacher.batches || teacher.batches.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                <BookOpen className="w-8 h-8 mb-3 opacity-20" />
                <p>No batches assigned to this teacher yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacher.batches.map((batch: any) => (
                  <Link href={`/dashboard/batches/${batch.id}`} key={batch.id}>
                    <div className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow hover:border-primary/30 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground">{batch.name}</h4>
                        <ActiveBadge isActive={batch.status === 'ACTIVE'} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{batch.subject}</p>
                      
                      <div className="flex gap-3 text-xs">
                        <div className="bg-muted px-2 py-1 rounded">
                          <span className="text-muted-foreground">Grade:</span> <span className="font-medium">{batch.grade}</span>
                        </div>
                        <div className="bg-muted px-2 py-1 rounded">
                          <span className="text-muted-foreground">Room:</span> <span className="font-medium">{batch.roomNumber || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
