import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { gd, toAmount } from "../../lib/demoPurse";

/** The rep's form for a spending request: a reason and an amount the class must approve. */
export function NewRequestDialog({
  open,
  onOpenChange,
  availableAmount,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableAmount: number;
  onCreate: (reason: string, amount: number) => void;
}) {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ reason?: string; amount?: string }>({});

  function reset() {
    setReason("");
    setAmount("");
    setErrors({});
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: { reason?: string; amount?: string } = {};
    const value = toAmount(amount);
    if (!reason.trim()) next.reason = "Say what the money is for.";
    if (value <= 0) next.amount = "Enter an amount above 0.";
    else if (value > availableAmount) next.amount = `That is more than the ${gd(availableAmount)} available.`;
    setErrors(next);
    if (next.reason || next.amount) return;
    onCreate(reason.trim(), value);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle className="font-display">New spending request</DialogTitle>
            <DialogDescription>
              The class votes on it. Money is released straight to the rep's wallet only after more than half of the
              members who paid approve.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="request-reason">Reason</Label>
            <Input
              id="request-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reagents for the titration practical"
              aria-invalid={Boolean(errors.reason)}
              aria-describedby={errors.reason ? "request-reason-error" : undefined}
              className="h-11"
            />
            {errors.reason ? (
              <p id="request-reason-error" className="text-xs text-danger">
                {errors.reason}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="request-amount">Amount (G$)</Label>
            <Input
              id="request-amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? "request-amount-error" : "request-amount-hint"}
              className="h-11"
            />
            {errors.amount ? (
              <p id="request-amount-error" className="text-xs text-danger">
                {errors.amount}
              </p>
            ) : (
              <p id="request-amount-hint" className="text-xs text-muted-foreground">
                {gd(availableAmount)} is available in the purse.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              Create request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
