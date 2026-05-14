"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { batchService } from "@/services/batch.service";
import { teacherService } from "@/services/teacher.service";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function NewBatchPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    grade: "",
    capacity: 30,
    roomNumber: "",
    startTime: "10:00",
    endTime: "11:00",
    days: [] as string[],
    teacherId: "",
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await teacherService.getTeachers("", 0, 100);
        setTeachers(res.data.data as any[]);
      } catch (err) {
        console.error("Failed to load teachers", err);
      }
    };
    fetchTeachers();
  }, []);

  const handleToggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherId) {
      setError("Please select a teacher");
      return;
    }
    if (formData.days.length === 0) {
      setError("Please select at least one day");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await batchService.createBatch(formData);
      router.push("/dashboard/batches");
    } catch (err: any) {
      setError(err.message || "Failed to create batch");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/batches">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">Create New Batch</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Batch Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Physics Class XII - Morning"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Subject *</label>
              <input
                required
                type="text"
                placeholder="e.g. Physics"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Grade *</label>
              <input
                required
                type="text"
                placeholder="e.g. Class XII"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Capacity *</label>
              <input
                required
                type="number"
                min="1"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Room Number</label>
              <input
                type="text"
                placeholder="e.g. Room 101"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Assign Teacher *</label>
              <select
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              >
                <option value="">Select a teacher...</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Start Time *</label>
              <input
                required
                type="time"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">End Time *</label>
              <input
                required
                type="time"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Days *</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const isSelected = formData.days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="button" variant="ghost" className="mr-3" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Batch"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
