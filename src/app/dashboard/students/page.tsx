"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Download,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  MessageSquare,
  IndianRupee,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { FeeStatusBadge, ActiveBadge } from "@/components/shared/status-badge";
import { StudentStatsCards } from "@/components/students/student-stats-cards";
import { StudentActionsDropdown } from "@/components/students/student-actions-dropdown";
import { mockBatches } from "@/lib/mock-data";
import { formatDate, formatCurrency, getInitials, cn } from "@/lib/utils";
import { studentService } from "@/services/student.service";
import { useStudentStore } from "@/store/student.store";
import type { Student, StudentFilters } from "@/types";

const GRADE_OPTIONS = ["Class X", "Class XI", "Class XII"];

// ─────────────────────────────────────────────
// Students Page Component
// ─────────────────────────────────────────────

export default function StudentsPage() {
  const {
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    isSelected,
    filters,
    setFilter,
    resetFilters,
    isFilterPanelOpen,
    toggleFilterPanel,
  } = useStudentStore();

  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await studentService.getStudents(filters, { skip: 0, take: 50 });
      // Map backend student format to frontend Student format if necessary
      // For now we assume they match or we gracefully handle missing fields in UI
      setStudents(res.data.data as any);
      setTotalStudents(res.data.meta.total);
    } catch (err: any) {
      setError(err.message || "Failed to load students");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.feeStatus !== "all") count++;
    if (filters.isActive !== "all") count++;
    if (filters.grade !== "all") count++;
    if (filters.batchId !== "all") count++;
    if (filters.attendanceBelow !== null) count++;
    return count;
  }, [filters]);

  const allOnPageSelected =
    students.length > 0 &&
    students.every((s) => isSelected(s.id));

  const handleSelectAll = () => {
    if (allOnPageSelected) clearSelection();
    else selectAll(students.map((s) => s.id));
  };

  const handleSortToggle = (col: StudentFilters["sortBy"]) => {
    if (filters.sortBy === col) {
      setFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      setFilter("sortBy", col);
      setFilter("sortOrder", "asc");
    }
  };

  const SortIcon = ({ col }: { col: StudentFilters["sortBy"] }) => {
    if (filters.sortBy !== col) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return filters.sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1 text-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 text-primary" />
    );
  };

  const selectedCount = selectedIds.size;

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <PageHeader
        title="Students"
        description={`${totalStudents} students found`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link href="/dashboard/students/new">
                <Plus className="w-4 h-4" />
                Add Student
              </Link>
            </Button>
          </div>
        }
      />

      {/* ─── Stats ─── */}
      <StudentStatsCards students={students} />

      {/* ─── Search + Filter Bar ─── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="student-search"
            type="search"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Search name, roll no., phone, email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          {filters.search && (
            <button
              onClick={() => setFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          variant={isFilterPanelOpen || activeFilterCount > 0 ? "default" : "outline"}
          className="gap-2 shrink-0"
          onClick={toggleFilterPanel}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full bg-white text-primary">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* ─── Filter Panel ─── */}
      {isFilterPanelOpen && (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Advanced Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Reset all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Fee Status */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Fee Status
              </label>
              <select
                value={filters.feeStatus}
                onChange={(e) => setFilter("feeStatus", e.target.value as StudentFilters["feeStatus"])}
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Status
              </label>
              <select
                value={filters.isActive === "all" ? "all" : filters.isActive ? "active" : "inactive"}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilter(
                    "isActive",
                    val === "all" ? "all" : val === "active"
                  );
                }}
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Grade
              </label>
              <select
                value={filters.grade}
                onChange={(e) => setFilter("grade", e.target.value)}
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Grades</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Batch */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Batch
              </label>
              <select
                value={filters.batchId}
                onChange={(e) => setFilter("batchId", e.target.value)}
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Batches</option>
                {mockBatches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Attendance */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Attendance Below
              </label>
              <select
                value={filters.attendanceBelow ?? "all"}
                onChange={(e) =>
                  setFilter(
                    "attendanceBelow",
                    e.target.value === "all" ? null : Number(e.target.value)
                  )
                }
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Any</option>
                <option value={60}>60%</option>
                <option value={75}>75%</option>
                <option value={80}>80%</option>
                <option value={90}>90%</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bulk Actions Bar ─── */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} student{selectedCount > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Message</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send Reminder</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-8 text-destructive hover:text-destructive border-destructive/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
            <button
              onClick={clearSelection}
              className="p-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Students Table ─── */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p>Loading students...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-destructive flex flex-col items-center justify-center">
            <X className="w-8 h-8 mb-4 opacity-50" />
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchStudents}>
              Try Again
            </Button>
          </div>
        ) : students.length === 0 ? (
          <EmptyState onReset={resetFilters} hasFilters={activeFilterCount > 0 || !!filters.search} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {/* Checkbox */}
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                        aria-label="Select all students"
                      />
                    </th>
                    {/* Name */}
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => handleSortToggle("name")}
                        className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
                      >
                        Student
                        <SortIcon col="name" />
                      </button>
                    </th>
                    {/* Grade */}
                    <th className="text-left px-4 py-3 hidden md:table-cell">
                      <button
                        onClick={() => handleSortToggle("grade")}
                        className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
                      >
                        Grade
                        <SortIcon col="grade" />
                      </button>
                    </th>
                    {/* Attendance */}
                    <th className="text-left px-4 py-3 hidden lg:table-cell">
                      <button
                        onClick={() => handleSortToggle("attendanceRate")}
                        className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
                      >
                        Attendance
                        <SortIcon col="attendanceRate" />
                      </button>
                    </th>
                    {/* Fee Status */}
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => handleSortToggle("feeStatus")}
                        className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
                      >
                        Fees
                        <SortIcon col="feeStatus" />
                      </button>
                    </th>
                    {/* Enrolled */}
                    <th className="text-left px-4 py-3 hidden xl:table-cell">
                      <button
                        onClick={() => handleSortToggle("enrollmentDate")}
                        className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
                      >
                        Enrolled
                        <SortIcon col="enrollmentDate" />
                      </button>
                    </th>
                    {/* Status */}
                    <th className="text-left px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </span>
                    </th>
                    {/* Actions */}
                    <th className="w-12 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      isSelected={isSelected(student.id)}
                      onToggleSelect={() => toggleSelect(student.id)}
                      SortIcon={SortIcon}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
              <p>
                Showing {students.length} of {totalStudents}{" "}
                students
              </p>
              <p>Page 1 of 1</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Student Table Row
// ─────────────────────────────────────────────

function StudentRow({
  student,
  isSelected,
  onToggleSelect,
}: {
  student: Student;
  isSelected: boolean;
  onToggleSelect: () => void;
  SortIcon: React.ComponentType<{ col: StudentFilters["sortBy"] }>;
}) {
  const attendanceColor =
    (student.attendanceRate ?? 100) >= 85
      ? "text-emerald-600"
      : (student.attendanceRate ?? 100) >= 70
      ? "text-amber-600"
      : "text-rose-600";

  const attendanceBg =
    (student.attendanceRate ?? 100) >= 85
      ? "bg-emerald-500"
      : (student.attendanceRate ?? 100) >= 70
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <tr
      className={cn(
        "hover:bg-muted/30 transition-colors cursor-pointer group",
        isSelected && "bg-primary/5"
      )}
    >
      {/* Checkbox */}
      <td className="px-4 py-3.5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
        />
      </td>

      {/* Student Info */}
      <td className="px-4 py-3.5">
        <Link
          href={`/dashboard/students/${student.id}`}
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback
              className={cn(
                "text-xs font-bold",
                student.gender === "female"
                  ? "bg-pink-100 text-pink-700"
                  : "bg-primary/10 text-primary"
              )}
            >
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {student.name || `${(student as any).firstName} ${(student as any).lastName}`}
            </p>
            <p className="text-xs text-muted-foreground">
              #{student.rollNumber || student.id.slice(0, 8)} · {student.phone}
            </p>
          </div>
        </Link>
      </td>

      {/* Grade */}
      <td className="px-4 py-3.5 hidden md:table-cell">
        <span className="text-sm text-foreground">{student.grade ?? "—"}</span>
        {student.medium && (
          <p className="text-xs text-muted-foreground">{student.medium} Medium</p>
        )}
      </td>

      {/* Attendance */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        {student.attendanceRate != null ? (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", attendanceBg)}
                style={{ width: `${student.attendanceRate}%` }}
              />
            </div>
            <span className={cn("text-sm font-semibold", attendanceColor)}>
              {student.attendanceRate}%
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>

      {/* Fee Status */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col gap-1">
          <FeeStatusBadge status={student.feeStatus} />
          {(student.feeBalance ?? 0) > 0 && (
            <p className="text-xs text-rose-600 font-medium">
              {formatCurrency(student.feeBalance!)} due
            </p>
          )}
        </div>
      </td>

      {/* Enrolled */}
      <td className="px-4 py-3.5 text-sm text-muted-foreground hidden xl:table-cell">
        {formatDate(student.enrollmentDate || (student as any).admissionDate || new Date())}
      </td>

      {/* Status */}
      <td className="px-4 py-3.5 hidden sm:table-cell">
        <ActiveBadge isActive={student.isActive ?? ((student as any).status === 'ACTIVE')} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <StudentActionsDropdown
          student={student}
          onViewProfile={() => {}}
          onEdit={() => {}}
          onTransferBatch={() => {}}
          onToggleStatus={() => {}}
          onSendMessage={() => {}}
          onRecordPayment={() => {}}
          onViewAttendance={() => {}}
        />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────

function EmptyState({
  onReset,
  hasFilters,
}: {
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* SVG Illustration */}
      <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-12 h-12 text-muted-foreground/50"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1">
        {hasFilters ? "No students match your filters" : "No students yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {hasFilters
          ? "Try adjusting your search or filter criteria to find what you're looking for."
          : "Get started by adding your first student. You can import existing students or add them one by one."}
      </p>

      <div className="flex items-center gap-3">
        {hasFilters && (
          <Button variant="outline" onClick={onReset} className="gap-2">
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
        <Button className="gap-2" asChild>
          <Link href="/dashboard/students/new">
            <Plus className="w-4 h-4" />
            Add Student
          </Link>
        </Button>
      </div>
    </div>
  );
}
