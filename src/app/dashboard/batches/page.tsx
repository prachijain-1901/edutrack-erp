"use client";

import type { Metadata } from "next";
import { Plus, BookOpen, Users, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ActiveBadge } from "@/components/shared/status-badge";
import { batchService } from "@/services/batch.service";
import { formatCurrency, formatTime } from "@/lib/utils";
import { DAY_LABELS } from "@/lib/constants";
import { useEffect, useState } from "react";
import Link from "next/link";

// Metadata removed for client component

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsLoading(true);
        const res = await batchService.getBatches({}, 0, 50);
        setBatches(res.data.data as any);
      } catch (err: any) {
        setError(err.message || "Failed to load batches");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBatches();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batches"
        description={`${batches.filter(b => b.status === 'ACTIVE').length} active batches`}
        actions={
          <Button size="sm" className="gap-2" asChild>
            <Link href="/dashboard/batches/new">
              <Plus className="w-4 h-4" />
              New Batch
            </Link>
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Batches", value: batches.length, icon: BookOpen, color: "bg-primary/10 text-primary" },
          { label: "Total Students", value: batches.reduce((a, b) => a + (b._count?.students ?? b.enrolledStudents ?? 0), 0), icon: Users, color: "bg-emerald-100 text-emerald-600" },
          { label: "Weekly Classes", value: batches.reduce((a, b) => a + (b.schedule?.length ?? 0), 0), icon: Clock, color: "bg-amber-100 text-amber-600" },
          { label: "Avg. Fees/Month", value: batches.length > 0 ? formatCurrency(Math.round(batches.reduce((a, b) => a + b.fees, 0) / batches.length)) : "N/A", icon: IndianRupee, color: "bg-sky-100 text-sky-600" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground leading-tight">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Batch Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p>Loading batches...</p>
          </div>
        ) : error ? (
          <div className="col-span-full py-12 text-center text-destructive flex flex-col items-center">
            <p>{error}</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No batches found. Create one to get started.
          </div>
        ) : (
          batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{batch.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{batch.subject}</p>
                </div>
                <ActiveBadge isActive={batch.status === 'ACTIVE'} className="shrink-0 mt-0.5" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Teacher</p>
                  <p className="text-sm font-medium text-foreground mt-0.5 truncate">{batch.teacherName || 'Not assigned'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Room</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{batch.room || '-'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 col-span-2">
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-xs text-muted-foreground">Students ({batch._count?.students || batch.enrolledStudents || 0}/{batch.capacity})</p>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${Math.min(100, ((batch._count?.students || batch.enrolledStudents || 0) / (batch.capacity || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Schedule</p>
                <div className="flex flex-wrap gap-2">
                  {batch.days?.map((day: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
                    >
                      <span className="font-medium">{day.substring(0, 3)}</span>
                      <span className="text-primary/70">
                        {batch.startTime}–{batch.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-border">
                <Link href={`/dashboard/batches/${batch.id}`}>
                  <Button variant="outline" className="w-full justify-between hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                    View Batch Details
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
