import { Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { gd, type Payment, type Purse } from "../../lib/demoPurse";

function when(at: number): string {
  const minutes = Math.round((Date.now() - at) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Every payment in, newest first. Nothing is hidden from the class. */
export function PaymentHistory({ purse }: { purse: Purse }) {
  const payments: Payment[] = purse.payments;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 p-5 pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Receipt className="size-4 text-accent" aria-hidden="true" />
          Payment history
        </CardTitle>
        <span className="text-xs tabular-nums text-muted-foreground">{payments.length} in</span>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        {payments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
            No payments yet, so there is no history.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {payments.map((payment) => (
              <li key={payment.id} className="flex items-center gap-3 py-2.5">
                <span className="size-2 shrink-0 rounded-full bg-success" aria-hidden="true" />
                <p className="min-w-0 flex-1 text-sm">
                  <span className="truncate">{payment.name}</span> paid
                  {payment.demo ? (
                    <Badge tone="warning" className="ml-2 align-middle">
                      Demo
                    </Badge>
                  ) : null}
                  <span className="block text-xs text-muted-foreground">{when(payment.at)}</span>
                </p>
                <span className="shrink-0 text-sm font-medium tabular-nums text-success">+{gd(payment.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
