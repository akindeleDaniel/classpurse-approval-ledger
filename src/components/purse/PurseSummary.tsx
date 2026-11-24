import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ProgressBar } from "../ProgressBar";
import { available, collected, gd, paidMembers, progressPercent, releasedTotal, type Purse } from "../../lib/demoPurse";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

/** The purse at a glance: how much is in, how close to the target, and what is left to spend. */
export function PurseSummary({ purse }: { purse: Purse }) {
  const total = collected(purse);
  const percent = progressPercent(purse);
  const members = paidMembers(purse).length;

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Collected</p>
            <p className="mt-1 font-display text-4xl font-semibold leading-none tracking-tight tabular-nums sm:text-5xl">
              {gd(total)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">of {gd(purse.target)} target</p>
        </div>

        <ProgressBar percent={percent} label={`${gd(total)} of ${gd(purse.target)}`} />

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="font-medium tabular-nums">{percent}% of the target</p>
          <Badge tone={percent >= 100 ? "success" : "warning"}>
            {percent >= 100 ? "Target reached" : `${gd(Math.max(0, purse.target - total))} to go`}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Stat label="Members paid" value={`${members} ${members === 1 ? "member" : "members"} paid`} />
          <Stat label="Available" value={`${gd(available(purse))} available`} />
          <Stat label="Share per member" value={`${gd(purse.share)} share`} />
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Available is what is collected minus what has already been released ({gd(releasedTotal(purse))}). Every
          payment and payout is visible to the whole class.
        </p>
      </CardContent>
    </Card>
  );
}
