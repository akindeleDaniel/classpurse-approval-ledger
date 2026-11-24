import { useState } from "react";
import { HandCoins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Notice } from "../ui/notice";
import { gd, memberTotal, toAmount, type Purse } from "../../lib/demoPurse";
import { usePurse } from "../../lib/usePurse";

/** Where a member pays into the purse. Demo only: records a sample payment in this tab. */
export function PayInCard({ purse }: { purse: Purse }) {
  const { payIn, visitor } = usePurse();
  const [amount, setAmount] = useState(String(purse.share));
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState<number | null>(null);
  const yours = memberTotal(purse, visitor);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = toAmount(amount);
    if (value <= 0) {
      setPaid(null);
      setError("Enter an amount above 0.");
      return;
    }
    setError(null);
    payIn(value);
    setPaid(value);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 p-5 pb-1">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <HandCoins className="size-4 text-accent" aria-hidden="true" />
          Pay in
        </CardTitle>
        <Badge tone="warning">Demo</Badge>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-3">
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="pay-amount">Amount to pay in (G$)</Label>
            <Input
              id="pay-amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-describedby="pay-hint"
              className="h-11 text-base"
            />
            <p id="pay-hint" className="text-xs text-muted-foreground">
              Your share is {gd(purse.share)}. Paying more is welcome.
            </p>
          </div>

          {error ? <Notice tone="danger">{error}</Notice> : null}

          <Button type="submit" variant="accent" className="h-11 w-full text-sm font-semibold">
            Add my payment
          </Button>
        </form>

        {paid !== null ? (
          <Notice tone="success" title="Payment recorded">
            Demo payment of {gd(paid)}. Real G$ payments arrive in the next milestone.
          </Notice>
        ) : null}

        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm">
          <span className="text-muted-foreground">Your total</span>
          <span className="font-display font-semibold tabular-nums">Your total: {gd(yours)}</span>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Demo: this records a sample payment in this browser tab. No G$ leaves your wallet in this milestone.
        </p>
      </CardContent>
    </Card>
  );
}
