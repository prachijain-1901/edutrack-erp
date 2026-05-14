import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { feeService } from "@/services/fee.service";
import { formatCurrency } from "@/lib/utils";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: any;
  onSuccess: () => void;
}

export function RecordPaymentModal({ isOpen, onClose, fee, onSuccess }: RecordPaymentModalProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState("CASH");
  const [utr, setUtr] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !fee) return null;

  const paid = fee.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
  const balance = fee.amount - paid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0 || amount > balance) {
      setError("Invalid amount");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await feeService.recordPayment({
        studentFeeId: fee.id,
        amount: Number(amount),
        paymentMethod: method,
        utrNumber: utr || undefined,
        notes: notes || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h2 className="font-semibold text-foreground">Record Payment</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-muted/40 rounded-xl p-3 flex justify-between items-center text-sm">
            <div>
              <p className="text-muted-foreground">Due Balance</p>
              <p className="font-bold text-foreground">{formatCurrency(balance)}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">{fee.student?.name || fee.student?.firstName}</p>
              <p className="text-xs text-primary">{fee.feePlan?.name}</p>
            </div>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Amount Paying *</label>
              <input
                type="number"
                required
                max={balance}
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder={`Max: ${balance}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Payment Method *</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>

            {method !== 'CASH' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Transaction ID / UTR</label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="e.g. UTR123456789"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Optional notes"
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || !amount}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Record Payment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
