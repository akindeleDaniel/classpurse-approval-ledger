import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock, UserRound } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { DemoBanner } from "../components/DemoBanner";
import { PurseSummary } from "../components/purse/PurseSummary";
import { PayInCard } from "../components/purse/PayInCard";
import { PaidList } from "../components/purse/PaidList";
import { PaymentHistory } from "../components/purse/PaymentHistory";
import { SpendingRequests } from "../components/purse/SpendingRequests";
import { SharePurseDialog } from "../components/purse/SharePurseDialog";
import { usePurse } from "../lib/usePurse";
import { closesIn } from "../lib/demoPurse";

export default function PursePage() {
  const { purse, visitor, resetPurse } = usePurse();

  useEffect(() => {
    document.title = `${purse.name} · Class Purse`;
  }, [purse.name]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Demo purse</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {purse.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className="gap-1.5 py-1">
              <UserRound className="size-3.5" aria-hidden="true" />
              Rep: {purse.rep}
            </Badge>
            <Badge className="gap-1.5 py-1">
              <CalendarClock className="size-3.5" aria-hidden="true" />
              {closesIn(purse.deadline)}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SharePurseDialog purse={purse} />
          <Button variant="ghost" size="sm" onClick={resetPurse}>
            Reset demo
          </Button>
          <Link to="/create">
            <Button variant="outline" size="sm">
              Start a purse
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>

      <DemoBanner className="mt-6" />

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-start">
        <div className="space-y-5">
          <PurseSummary purse={purse} />
          <SpendingRequests purse={purse} visitor={visitor} />
        </div>
        <div className="space-y-5">
          <PayInCard purse={purse} />
          <PaidList purse={purse} visitor={visitor} />
          <PaymentHistory purse={purse} />
        </div>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        This purse is sample data in this browser tab. Real G$ payments, wallet approval and the on-chain purse arrive
        in the next milestone. The demo member is {visitor}; the demo class rep is {purse.rep}.
      </p>
    </div>
  );
}
