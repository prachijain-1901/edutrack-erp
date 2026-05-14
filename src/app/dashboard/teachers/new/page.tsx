"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { teacherService } from "@/services/teacher.service";

export default function NewTeacherPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    subjects: "",
    salaryType: "monthly",
    salaryAmount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await teacherService.createTeacher({
        ...formData,
        subjects: formData.subjects.split(",").map((s) => s.trim()).filter(Boolean),
      });
      router.push("/dashboard/teachers");
    } catch (err: any) {
      setError(err.message || "Failed to create teacher");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/teachers">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">Add Teacher</h1>
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
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
              <input
                required
                type="tel"
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Qualification</label>
              <input
                type="text"
                placeholder="e.g. M.Sc Physics"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Subjects (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Physics, Chemistry"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Salary Type</label>
              <select
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.salaryType}
                onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="hourly">Hourly</option>
                <option value="per_student">Per Student</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Salary Amount</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.salaryAmount}
                onChange={(e) => setFormData({ ...formData, salaryAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="button" variant="ghost" className="mr-3" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Teacher"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
