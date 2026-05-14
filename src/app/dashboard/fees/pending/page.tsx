"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { feeService } from "@/services/fee.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RecordPaymentModal } from "@/components/fees/RecordPaymentModal";

export default function PendingFeesPage() {
  const [pendingFees, setPendingFees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFee, setSelectedFee] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await feeService.getPendingFees();
      setPendingFees(res.data || []);
    } catch (error) {
      console.error("Failed to load fees data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredFees = pendingFees.filter(fee => {
    const name = (fee.student?.name || fee.student?.firstName || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/fees">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">Pending Fees</h1>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-3 flex-wrap items-center justify-between bg-muted/20">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <Button variant="outline" size="sm">Send Reminders</Button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">Loading pending fees...</div>
        ) : filteredFees.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No pending fees found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-5 py-3 font-semibold text-muted-foreground uppercase text-xs">Student</th>
                  <th className="px-5 py-3 font-semibold text-muted-foreground uppercase text-xs">Plan</th>
                  <th className="px-5 py-3 font-semibold text-muted-foreground uppercase text-xs">Due Date</th>
                  <th className="px-5 py-3 font-semibold text-muted-foreground uppercase text-xs">Balance</th>
                  <th className="px-5 py-3 font-semibold text-center text-muted-foreground uppercase text-xs">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFees.map((fee) => {
                  const paid = fee.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
                  const balance = fee.amount - paid;
                  const isOverdue = new Date(fee.dueDate) < new Date();

                  return (
                    <tr key={fee.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{fee.student?.name || fee.student?.firstName}</p>
                        <p className="text-xs text-muted-foreground">{fee.student?.rollNumber}</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{fee.feePlan?.name}</td>
                      <td className="px-5 py-4">
                        <span className={isOverdue ? "text-destructive font-medium" : "text-foreground"}>
                          {formatDate(fee.dueDate)}
                        </span>
                        {isOverdue && <span className="ml-2 text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded uppercase">Overdue</span>}
                      </td>
                      <td className="px-5 py-4 font-bold text-foreground">
                        {formatCurrency(balance)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Button size="sm" onClick={() => setSelectedFee(fee)}>Pay Now</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RecordPaymentModal 
        isOpen={!!selectedFee}
        fee={selectedFee}
        onClose={() => setSelectedFee(null)}
        onSuccess={() => {
          setSelectedFee(null);
          setSuccessMsg("Payment recorded successfully!");
          setTimeout(() => setSuccessMsg(""), 3000);
          loadData();
        }}
      />
    </div>
  );
}
