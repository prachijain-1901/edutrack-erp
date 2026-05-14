"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { batchService } from "@/services/batch.service";
import { attendanceService } from "@/services/attendance.service";
import { AttendanceStatus } from "@/types";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MarkAttendancePage() {
  const router = useRouter();
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>({});
  
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load batches on mount
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await batchService.getBatches({}, 0, 100);
        setBatches(res.data.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load batches");
      } finally {
        setIsLoadingBatches(false);
      }
    };
    loadBatches();
  }, []);

  // Load students and existing attendance when batch or date changes
  useEffect(() => {
    const loadData = async () => {
      if (!selectedBatch) {
        setStudents([]);
        setAttendanceState({});
        return;
      }
      setIsLoadingStudents(true);
      setError(null);
      setSuccess(false);

      try {
        // Fetch batch details to get enrolled students
        const batchRes = await batchService.getBatchById(selectedBatch);
        const enrolledStudents = batchRes.data.students?.map((s: any) => s.student) || [];
        setStudents(enrolledStudents);

        // Fetch existing attendance for this date
        const attRes = await attendanceService.getByBatch(selectedBatch, date);
        const existingMap: Record<string, AttendanceStatus> = {};
        
        attRes.forEach((record: any) => {
          existingMap[record.studentId] = record.status;
        });

        // Initialize state (default to PRESENT if not marked)
        const newState: Record<string, AttendanceStatus> = {};
        enrolledStudents.forEach((student: any) => {
          newState[student.id] = existingMap[student.id] || "PRESENT";
        });
        setAttendanceState(newState);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setIsLoadingStudents(false);
      }
    };
    loadData();
  }, [selectedBatch, date]);

  const handleMarkAll = (status: AttendanceStatus) => {
    const newState = { ...attendanceState };
    students.forEach((s) => {
      newState[s.id] = status;
    });
    setAttendanceState(newState);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!selectedBatch || students.length === 0) return;
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const records = students.map((s) => ({
        studentId: s.id,
        batchId: selectedBatch,
        date: new Date(date).toISOString(),
        status: attendanceState[s.id],
      }));

      await attendanceService.markBulk(records);
      setSuccess(true);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/attendance">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">Mark Attendance</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Select Batch</label>
            <select
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              disabled={isLoadingBatches}
            >
              <option value="">-- Choose a batch --</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.subject})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Attendance saved successfully!
        </div>
      )}

      {selectedBatch && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-muted/30 flex flex-wrap gap-3 items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Students List ({students.length})
            </h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleMarkAll('PRESENT')}>Mark All Present</Button>
              <Button size="sm" variant="outline" onClick={() => handleMarkAll('ABSENT')}>Mark All Absent</Button>
            </div>
          </div>

          {isLoadingStudents ? (
            <div className="py-12 flex justify-center items-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No students enrolled in this batch.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-muted-foreground">Student</th>
                    <th className="px-5 py-3 font-semibold text-muted-foreground text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {getInitials(student.name || student.firstName || "X")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{student.name || student.firstName}</p>
                            <p className="text-xs text-muted-foreground">{student.rollNumber || student.id.slice(0, 6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {(['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as AttendanceStatus[]).map((status) => {
                            const isSelected = attendanceState[student.id] === status;
                            let colorClass = "border-border text-muted-foreground hover:border-primary/50";
                            if (isSelected) {
                              if (status === 'PRESENT') colorClass = "bg-emerald-100 border-emerald-200 text-emerald-700";
                              if (status === 'ABSENT') colorClass = "bg-destructive/10 border-destructive/20 text-destructive";
                              if (status === 'LATE') colorClass = "bg-amber-100 border-amber-200 text-amber-700";
                              if (status === 'LEAVE') colorClass = "bg-blue-100 border-blue-200 text-blue-700";
                            }

                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusChange(student.id, status)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${colorClass}`}
                              >
                                {status.charAt(0)}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Sticky Save Bar */}
      {selectedBatch && students.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-card/80 backdrop-blur-md border-t border-border p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 flex justify-between items-center px-6">
          <div className="text-sm text-muted-foreground hidden md:block">
            <strong>{Object.values(attendanceState).filter(s => s === 'PRESENT').length}</strong> Present | {" "}
            <strong>{Object.values(attendanceState).filter(s => s === 'ABSENT').length}</strong> Absent
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none" onClick={() => router.back()}>Cancel</Button>
            <Button 
              className="flex-1 md:flex-none gap-2 min-w-[120px]" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Attendance
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
