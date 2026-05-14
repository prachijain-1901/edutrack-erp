"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users, UserX, Clock, CalendarDays, TrendingDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { attendanceService } from "@/services/attendance.service";

export default function AttendanceDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const data = await attendanceService.getSummary(date);
        setSummary(data);
      } catch (err: any) {
        setError(err.message || "Failed to load summary");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [date]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Dashboard"
        description="Daily overview and insights"
        actions={
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <Button size="sm" className="gap-2" asChild>
              <Link href="/dashboard/attendance/mark">
                <Plus className="w-4 h-4" />
                Mark Attendance
              </Link>
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Attendance", value: isLoading ? "-" : `${summary?.percentage || 0}%`, icon: Users, color: "bg-primary/10 text-primary" },
          { label: "Present", value: isLoading ? "-" : summary?.present || 0, icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
          { label: "Absent", value: isLoading ? "-" : summary?.absent || 0, icon: UserX, color: "bg-destructive/10 text-destructive" },
          { label: "Late/Leave", value: isLoading ? "-" : (summary?.late || 0) + (summary?.leave || 0), icon: Clock, color: "bg-amber-100 text-amber-600" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground leading-tight">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[300px]">
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/attendance/mark">
              <div className="p-4 rounded-xl border border-border hover:border-primary transition-colors flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Mark Batch Attendance</h4>
                    <p className="text-sm text-muted-foreground">Record attendance for a specific batch</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Go</Button>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            Low Attendance Alerts
          </h3>
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <p>Low attendance tracking requires detailed student reports.</p>
            <p className="text-sm mt-2">Go to Student Profile to see individual trends.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
