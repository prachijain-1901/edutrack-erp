"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  IndianRupee, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Plus, 
  FileText,
  CreditCard,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { feeService } from "@/services/fee.service";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function FeesDashboardPage() {
  const [pendingFees, setPendingFees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await feeService.getPendingFees();
        setPendingFees(res.data || []);
      } catch (error) {
        console.error("Failed to load fees data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const totalPending = pendingFees.reduce((acc, fee) => acc + fee.amount, 0);
  const totalPaid = pendingFees.reduce((acc, fee) => {
    const paid = fee.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
    return acc + paid;
  }, 0);
  const netDue = totalPending - totalPaid;
  const overdueFees = pendingFees.filter(f => f.status === 'OVERDUE' || new Date(f.dueDate) < new Date());

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Fees & Payments"
        description="Manage revenue, pending dues, and payment collections"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href="/dashboard/fees/plans">
                <FileText className="w-4 h-4" />
                Fee Plans
              </Link>
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link href="/dashboard/fees/pending">
                <Clock className="w-4 h-4" />
                View Pending
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Collected (This Month)</p>
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(totalPaid)}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Pending Dues</p>
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(netDue)}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Overdue Fees</p>
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">{overdueFees.length} Students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/dashboard/fees/pending">
              <div className="p-4 rounded-xl border border-border hover:border-primary transition-colors flex items-center justify-between group cursor-pointer mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Record Payment</h4>
                    <p className="text-sm text-muted-foreground">Log a cash or UPI payment from pending fees</p>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
            
            <Link href="/dashboard/fees/plans">
              <div className="p-4 rounded-xl border border-border hover:border-primary transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Create Fee Plan</h4>
                    <p className="text-sm text-muted-foreground">Setup a new monthly or yearly billing plan</p>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Overdue */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Recent Overdue
            </h3>
            <Link href="/dashboard/fees/pending" className="text-sm text-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
            ) : overdueFees.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No overdue fees currently. Great job!</p>
            ) : (
              overdueFees.slice(0, 4).map((fee) => {
                const paid = fee.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
                const balance = fee.amount - paid;
                return (
                  <div key={fee.id} className="flex justify-between items-center p-3 border border-border rounded-xl">
                    <div>
                      <p className="font-medium text-sm text-foreground">{fee.student?.name || fee.student?.firstName}</p>
                      <p className="text-xs text-destructive mt-0.5">Due: {formatDate(fee.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground">{formatCurrency(balance)}</p>
                      <p className="text-xs text-muted-foreground">{fee.feePlan?.name}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
