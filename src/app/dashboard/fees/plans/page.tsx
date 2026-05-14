"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { feeService } from "@/services/fee.service";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function FeePlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await feeService.getPlans();
      setPlans(res.data || []);
    } catch (error) {
      console.error("Failed to load fee plans", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await feeService.createPlan({
        name,
        amount: Number(amount),
        billingCycle,
      });
      setIsCreating(false);
      setName("");
      setAmount("");
      loadData();
    } catch (error) {
      alert("Failed to create plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/fees">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">Fee Plans</h1>
        <div className="ml-auto">
          {!isCreating && (
            <Button size="sm" onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Create Plan
            </Button>
          )}
        </div>
      </div>

      {isCreating && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-lg mb-4">New Fee Plan</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Plan Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Grade 10 Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Amount</label>
              <input
                required
                type="number"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Billing Cycle</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
                <option value="ONE_TIME">One Time</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Plan
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-muted-foreground py-10 col-span-full text-center">Loading plans...</p>
        ) : plans.length === 0 ? (
          <p className="text-muted-foreground py-10 col-span-full text-center">No fee plans created yet.</p>
        ) : (
          plans.map(plan => (
            <div key={plan.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-lg text-foreground">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mb-4 capitalize">{plan.billingCycle.toLowerCase().replace('_', ' ')}</p>
              
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-primary">{formatCurrency(plan.amount)}</span>
                <span className="text-xs text-muted-foreground">Created {formatDate(plan.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
