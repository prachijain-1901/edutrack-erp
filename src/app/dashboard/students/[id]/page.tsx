"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Pencil,
  GraduationCap,
  BookOpen,
  IndianRupee,
  CalendarCheck,
  FileText,
  Clock,
  Phone,
  Mail,
  MapPin,
  Droplets,
  School,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FeeStatusBadge, ActiveBadge, AttendanceStatusBadge } from "@/components/shared/status-badge";
import { ParentInfoCard } from "@/components/students/parent-info-card";
import { ActivityTimeline } from "@/components/students/activity-timeline";
import { StudentProfileTabs } from "@/components/students/student-profile-tabs";
import {
  mockStudents,
  mockBatches,
  mockFeeRecords,
  mockAttendance,
  mockStudentActivities,
  mockStudentDocuments,
} from "@/lib/mock-data";
import {
  getInitials,
  formatDate,
  formatCurrency,
  cn,
  percentage,
} from "@/lib/utils";
import { studentService } from "@/services/student.service";
import { attendanceService } from "@/services/attendance.service";
import { feeService } from "@/services/fee.service";
import { uploadService } from "@/services/upload.service";
import { Loader2, Download, Trash2, UploadCloud } from "lucide-react";
import type { Student } from "@/types";

// ─────────────────────────────────────────────
// Student Profile Page
// ─────────────────────────────────────────────

export default function StudentProfilePage() {
  const params = useParams() as { id: string };
  const id = params?.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [studentFees, setStudentFees] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        const res = await studentService.getStudentById(id);
        // Ensure mapping to frontend format
        setStudent({
          ...res.data,
          name: res.data.name || `${(res.data as any).firstName} ${(res.data as any).lastName}`,
          rollNumber: res.data.rollNumber || res.data.id.slice(0, 8),
          parentName: res.data.parentName || (res.data as any).parent?.fatherName || (res.data as any).parent?.motherName || "N/A",
          parentPhone: res.data.parentPhone || (res.data as any).parent?.phone || "N/A",
          feeStatus: res.data.feeStatus || "paid",
          feeBalance: res.data.feeBalance || 0,
          isActive: res.data.isActive ?? ((res.data as any).status === 'ACTIVE'),
          attendanceRate: res.data.attendanceRate || 100,
          batchIds: res.data.batchIds || [],
          enrollmentDate: res.data.enrollmentDate || (res.data as any).admissionDate || new Date().toISOString(),
          dateOfBirth: res.data.dateOfBirth || (res.data as any).dob,
          previousSchool: res.data.previousSchool || (res.data as any).schoolName,
        } as Student);

        const attRes = await attendanceService.getByStudent(id);
        setAttendanceRecords(attRes);

        const feeRes = await feeService.getStudentFees(id);
        setStudentFees(feeRes.data || feeRes);

        const docRes = await uploadService.getStudentDocuments(id);
        setDocuments(docRes.data || docRes);
      } catch (err: any) {
        setError(err.message || "Failed to load student");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-destructive gap-4">
        <p>{error || "Student not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/students">Back to Students</Link>
        </Button>
      </div>
    );
  }

  const studentBatches = mockBatches.filter((b) =>
    student.batchIds.includes(b.id)
  );
  const studentAttendance = attendanceRecords;
  const activities = mockStudentActivities.filter(
    (a) => a.studentId === student.id
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only JPG, PNG, and PDF allowed.");
      return;
    }
    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      const category = prompt("Enter document category (e.g. STUDENT_ID, RECEIPT, MARKSHEET, OTHER)", "OTHER") || "OTHER";
      await uploadService.uploadStudentDocument(id, file, category);
      const docRes = await uploadService.getStudentDocuments(id);
      setDocuments(docRes.data || docRes);
    } catch (err) {
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await uploadService.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      alert("Failed to delete document");
    }
  };

  const presentCount = studentAttendance.filter(
    (a) => a.status === "PRESENT"
  ).length;

  const tabs = [
    { id: "overview", label: "Overview", iconName: "GraduationCap" },
    { id: "batches", label: "Batches", iconName: "BookOpen" },
    { id: "fees", label: "Fee Summary", iconName: "IndianRupee" },
    { id: "attendance", label: "Attendance", iconName: "CalendarCheck" },
    { id: "documents", label: "Documents", iconName: "FileText" },
    { id: "activity", label: "Activity", iconName: "Clock" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/students">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <p className="text-xs text-muted-foreground">
              Students / {student.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Message Parent</span>
          </Button>
          <Button size="sm" className="gap-2">
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>
      </div>

      {/* ─── Profile Hero ─── */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-primary to-primary/70" />
        {/* Content */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-4">
            <Avatar className="w-20 h-20 ring-4 ring-card shadow-lg shrink-0">
              <AvatarFallback
                className={cn(
                  "text-2xl font-bold",
                  student.gender === "female"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-primary/10 text-primary"
                )}
              >
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2 pb-1">
              <FeeStatusBadge status={student.feeStatus} />
              <ActiveBadge isActive={student.isActive} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {student.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Roll #{student.rollNumber}
                {student.grade && ` · ${student.grade}`}
                {student.medium && ` · ${student.medium} Medium`}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {student.phone && (
                  <InfoChip icon={Phone} value={student.phone} href={`tel:${student.phone}`} />
                )}
                {student.email && (
                  <InfoChip icon={Mail} value={student.email} href={`mailto:${student.email}`} />
                )}
                {(student.city || student.state) && (
                  <InfoChip
                    icon={MapPin}
                    value={[student.city, student.state].filter(Boolean).join(", ")}
                  />
                )}
                {student.bloodGroup && (
                  <InfoChip icon={Droplets} value={student.bloodGroup} />
                )}
                {student.previousSchool && (
                  <InfoChip icon={School} value={student.previousSchool} />
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 shrink-0">
              <QuickStat
                value={`${student.attendanceRate ?? "—"}${student.attendanceRate != null ? "%" : ""}`}
                label="Attendance"
                color={
                  (student.attendanceRate ?? 100) >= 85
                    ? "text-emerald-600"
                    : (student.attendanceRate ?? 100) >= 70
                    ? "text-amber-600"
                    : "text-rose-600"
                }
              />
              <QuickStat
                value={student.feeBalance != null ? formatCurrency(student.feeBalance) : "—"}
                label="Balance Due"
                color={(student.feeBalance ?? 0) > 0 ? "text-rose-600" : "text-emerald-600"}
              />
              <QuickStat
                value={String(student.batchIds.length)}
                label="Batches"
                color="text-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content: Two Column ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Parent Info */}
        <div className="space-y-4">
          <ParentInfoCard student={student} />

          {/* Quick Info Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Quick Info
            </h3>
            <dl className="space-y-2.5">
              {[
                { label: "Enrolled", value: formatDate(student.enrollmentDate) },
                { label: "Roll No.", value: student.rollNumber },
                student.dateOfBirth
                  ? { label: "Date of Birth", value: formatDate(student.dateOfBirth) }
                  : null,
                student.gender
                  ? { label: "Gender", value: student.gender.charAt(0).toUpperCase() + student.gender.slice(1) }
                  : null,
              ]
                .filter(Boolean)
                .map((item) => (
                  <div
                    key={item!.label}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <dt className="text-muted-foreground">{item!.label}</dt>
                    <dd className="font-medium text-foreground text-right">
                      {item!.value}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <StudentProfileTabs tabs={tabs} className="p-0">
              {/* ─── Overview Tab ─── */}
              <div className="p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Attendance Summary
                  </h3>
                  <div className="bg-muted/40 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Overall attendance
                      </span>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          (student.attendanceRate ?? 0) >= 85
                            ? "text-emerald-600"
                            : "text-amber-600"
                        )}
                      >
                        {student.attendanceRate ?? 0}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          (student.attendanceRate ?? 0) >= 85
                            ? "bg-emerald-500"
                            : (student.attendanceRate ?? 0) >= 70
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        )}
                        style={{ width: `${student.attendanceRate ?? 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>0%</span>
                      <span className="text-amber-600">75% (Min req.)</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Fee Overview
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: "Total Fees",
                        value: formatCurrency(studentFees.reduce((a, f) => a + f.amount, 0)),
                        color: "text-foreground",
                        bg: "bg-muted/40",
                      },
                      {
                        label: "Paid",
                        value: formatCurrency(studentFees.reduce((a, f) => a + f.paidAmount, 0)),
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                      },
                      {
                        label: "Due",
                        value: formatCurrency(student.feeBalance ?? 0),
                        color: (student.feeBalance ?? 0) > 0 ? "text-rose-600" : "text-emerald-600",
                        bg: (student.feeBalance ?? 0) > 0 ? "bg-rose-50" : "bg-emerald-50",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className={cn("rounded-xl p-3 text-center", s.bg)}
                      >
                        <p className={cn("text-base font-bold", s.color)}>
                          {s.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Enrolled Batches
                  </h3>
                  {studentBatches.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No batches assigned.</p>
                  ) : (
                    <div className="space-y-2">
                      {studentBatches.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-2.5"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {b.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {b.teacherName} · {b.room}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            {formatCurrency(b.fees)}/mo
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ─── Batches Tab ─── */}
              <div className="p-5 space-y-3">
                {studentBatches.length === 0 ? (
                  <EmptyTabState
                    icon={BookOpen}
                    title="No batches assigned"
                    description="This student hasn't been assigned to any batch yet."
                  />
                ) : (
                  studentBatches.map((batch) => (
                    <div
                      key={batch.id}
                      className="border border-border rounded-xl p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {batch.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {batch.subject}
                          </p>
                        </div>
                        <ActiveBadge isActive={batch.isActive} />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        {[
                          { label: "Teacher", value: batch.teacherName ?? "—" },
                          { label: "Room", value: batch.room ?? "—" },
                          { label: "Monthly Fee", value: formatCurrency(batch.fees) },
                        ].map((item) => (
                          <div key={item.label} className="bg-muted/40 rounded-lg p-2">
                            <p className="text-muted-foreground">{item.label}</p>
                            <p className="font-medium text-foreground mt-0.5">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* ─── Fee Summary Tab ─── */}
              <div className="p-5 space-y-4">
                {studentFees.length === 0 ? (
                  <EmptyTabState
                    icon={IndianRupee}
                    title="No fee records"
                    description="No fee transactions recorded for this student."
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Total Billed", value: formatCurrency(studentFees.reduce((a, f) => a + f.amount, 0)), color: "text-foreground" },
                        { label: "Paid", value: formatCurrency(studentFees.reduce((a, f) => a + (f.payments?.reduce((s:number, p:any)=>s+p.amount,0)||0), 0)), color: "text-emerald-600" },
                        { label: "Outstanding", value: formatCurrency(studentFees.reduce((a, f) => a + (f.amount - (f.payments?.reduce((s:number, p:any)=>s+p.amount,0)||0)), 0)), color: "text-rose-600" },
                      ].map((s) => (
                        <div key={s.label} className="bg-muted/40 rounded-xl p-3 text-center">
                          <p className={cn("text-base font-bold", s.color)}>{s.value}</p>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {studentFees.map((fee) => {
                      const paidAmount = fee.payments?.reduce((s:number, p:any)=>s+p.amount,0) || 0;
                      const dueAmount = fee.amount - paidAmount;
                      const lastPayment = fee.payments?.[fee.payments.length - 1];

                      return (
                      <div key={fee.id} className="border border-border rounded-xl p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {fee.feePlan?.name || "Custom Fee"}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {fee.feePlan?.billingCycle?.replace("_", " ")} · Due {formatDate(fee.dueDate)}
                            </p>
                          </div>
                          <FeeStatusBadge status={fee.status === 'PAID' ? 'PAID' : fee.status === 'PARTIAL' ? 'PARTIAL' : 'PENDING'} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {formatCurrency(paidAmount)} paid of{" "}
                            {formatCurrency(fee.amount)}
                          </span>
                          {lastPayment && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded capitalize">
                              {lastPayment.paymentMethod.replace("_", " ")}
                            </span>
                          )}
                        </div>
                        {dueAmount > 0 && (
                          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: `${percentage(paidAmount, fee.amount)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )})}
                  </>
                )}
              </div>

              {/* ─── Attendance Tab ─── */}
              <div className="p-5">
                {studentAttendance.length === 0 ? (
                  <EmptyTabState
                    icon={CalendarCheck}
                    title="No attendance records"
                    description="Attendance hasn't been marked for this student yet."
                  />
                ) : (
                  <div className="space-y-2">
                    {studentAttendance.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {record.batch?.name || 'Unknown Batch'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(record.date)}
                          </p>
                        </div>
                        <AttendanceStatusBadge status={record.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ─── Documents Tab ─── */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Student Documents</h3>
                  <div className="relative">
                    <input type="file" id="doc-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={isUploading} accept=".jpg,.jpeg,.png,.pdf" />
                    <Button variant="outline" size="sm" className="gap-2" disabled={isUploading}>
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      Upload File
                    </Button>
                  </div>
                </div>

                {documents.length === 0 ? (
                  <EmptyTabState
                    icon={FileText}
                    title="No documents uploaded"
                    description="Upload student documents like Aadhaar, marksheet, or receipts. Files must be JPG, PNG, or PDF up to 5MB."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-start gap-3 p-4 border border-border rounded-xl hover:shadow-sm transition-all group bg-card"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate" title={doc.name}>
                            {doc.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase">{doc.category.replace('_', ' ')}</span>
                            <span className="text-[10px] text-muted-foreground">{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">Uploaded {formatDate(doc.createdAt)}</p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10" onClick={() => window.open(doc.fileUrl, '_blank')}>
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteDocument(doc.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ─── Activity Tab ─── */}
              <div className="p-5">
                {activities.length === 0 ? (
                  <EmptyTabState
                    icon={Clock}
                    title="No activity yet"
                    description="Actions and events will appear here as they happen."
                  />
                ) : (
                  <ActivityTimeline activities={activities} />
                )}
              </div>
            </StudentProfileTabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────

function InfoChip({
  icon: Icon,
  value,
  href,
}: {
  icon: React.ElementType;
  value: string;
  href?: string;
}) {
  const cls =
    "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors";
  const inner = (
    <>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{value}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return <span className={cls}>{inner}</span>;
}

function QuickStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center bg-muted/50 rounded-xl px-4 py-2.5 min-w-16">
      <p className={cn("text-base font-bold", color)}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function EmptyTabState({
  icon: Icon,
  title,
  description,
  actionLabel,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border/60 rounded-2xl bg-muted/20">
      <div className="w-12 h-12 rounded-full bg-background border border-border shadow-sm flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && (
        <Button variant="outline" size="sm" className="bg-background">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
