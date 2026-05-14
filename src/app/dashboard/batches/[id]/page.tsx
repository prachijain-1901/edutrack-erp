"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Users, UserPlus, X, Info, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { batchService } from "@/services/batch.service";
import { studentService } from "@/services/student.service";
import { ActiveBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { attendanceService } from "@/services/attendance.service";

export default function BatchDetailPage() {
  const params = useParams() as { id: string };
  const id = params?.id;

  const [batch, setBatch] = useState<any>(null);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);

  const [studentSearch, setStudentSearch] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const fetchBatchAndStudents = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const batchRes = await batchService.getBatchById(id);
      setBatch(batchRes.data);

      const studentRes = await studentService.getStudents({}, { skip: 0, take: 500 });
      setAllStudents(studentRes.data.data);

      const summaryRes = await attendanceService.getSummary(undefined, id);
      setAttendanceSummary(summaryRes);
    } catch (err: any) {
      setError(err.message || "Failed to load details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchAndStudents();
  }, [id]);

  const handleAssignStudent = async () => {
    if (!selectedStudentId) return;
    setIsAssigning(true);
    try {
      await batchService.assignStudent(id, selectedStudentId);
      await fetchBatchAndStudents();
      setSelectedStudentId("");
    } catch (err: any) {
      alert(err.message || "Failed to assign student");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm("Remove student from this batch?")) return;
    try {
      await batchService.removeStudent(id, studentId);
      await fetchBatchAndStudents();
    } catch (err: any) {
      alert(err.message || "Failed to remove student");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-destructive gap-4">
        <p>{error || "Batch not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/batches">Back to Batches</Link>
        </Button>
      </div>
    );
  }

  const enrolledCount = batch.students?.length || 0;
  const isFull = enrolledCount >= batch.capacity;

  const availableStudents = allStudents.filter(
    (s) => !batch.students?.some((bs: any) => bs.student.id === s.id)
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/batches">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">{batch.name}</h1>
        <ActiveBadge isActive={batch.status === "ACTIVE"} className="ml-2" />
        <div className="ml-auto flex gap-2">
          <Button size="sm" className="gap-2" asChild>
            <Link href={`/dashboard/attendance/mark`}>
              <CalendarCheck className="w-4 h-4" />
              Mark Attendance
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Batch Details */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Batch Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject</span>
                <span className="font-medium">{batch.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grade</span>
                <span className="font-medium">{batch.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teacher</span>
                <span className="font-medium text-primary">{batch.teacher?.name || "Unassigned"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room</span>
                <span className="font-medium">{batch.roomNumber || "-"}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Schedule</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timings</span>
                <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {batch.startTime} - {batch.endTime}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-2">Days</span>
                <div className="flex flex-wrap gap-1.5">
                  {batch.days?.map((d: string) => (
                    <span key={d} className="bg-muted text-muted-foreground px-2.5 py-1 rounded-md text-xs font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {attendanceSummary && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-primary" />
                Attendance Summary
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center mb-3">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <p className="text-lg font-bold">{attendanceSummary.percentage || 0}%</p>
                  <p className="text-xs">Overall</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 rounded-lg p-2">
                  <p className="text-lg font-bold">{attendanceSummary.present || 0}</p>
                  <p className="text-xs">Present</p>
                </div>
                <div className="bg-destructive/10 text-destructive rounded-lg p-2">
                  <p className="text-lg font-bold">{attendanceSummary.absent || 0}</p>
                  <p className="text-xs">Absent</p>
                </div>
                <div className="bg-amber-100 text-amber-700 rounded-lg p-2">
                  <p className="text-lg font-bold">{(attendanceSummary.late || 0) + (attendanceSummary.leave || 0)}</p>
                  <p className="text-xs">Late/Leave</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Students */}
        <div className="lg:col-span-2 space-y-6">
          {/* Capacity Progress */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Enrolled Students
              </h3>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                {enrolledCount} / {batch.capacity}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-1">
              <div
                className={`h-full transition-all duration-500 ${isFull ? 'bg-destructive' : 'bg-primary'}`}
                style={{ width: `${Math.min(100, (enrolledCount / batch.capacity) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {batch.capacity - enrolledCount} seats remaining
            </p>
          </div>

          {/* Assign Student Block */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              Assign Student
            </h4>
            <div className="flex gap-3">
              <select
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                disabled={isFull}
              >
                <option value="">Select a student to assign...</option>
                {availableStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.firstName} - Roll: {s.rollNumber || s.id.slice(0, 5)}
                  </option>
                ))}
              </select>
              <Button onClick={handleAssignStudent} disabled={!selectedStudentId || isAssigning || isFull}>
                {isAssigning ? "Assigning..." : "Assign"}
              </Button>
            </div>
            {isFull && <p className="text-xs text-destructive mt-2">Cannot assign. Batch is full.</p>}
          </div>

          {/* Student List */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {batch.students?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No students enrolled in this batch yet.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Student</th>
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Grade</th>
                    <th className="w-16 px-5 py-3 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {batch.students?.map(({ student }: any) => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {getInitials(student.name || student.firstName || "X")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{student.name || student.firstName}</p>
                            <p className="text-xs text-muted-foreground">{student.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{student.grade}</td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          title="Remove from batch"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
