import { Link } from "react-router-dom";
import { ArrowRight, Coins, ShieldCheck, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { DemoBanner } from "../components/DemoBanner";
import { ProgressBar } from "../components/ProgressBar";
import { usePurse } from "../lib/usePurse";
import { gd, progressPercent, collected, paidMembers, pendingSummary, closesIn } from "../lib/demoPurse";

const STEPS = [
  {
    icon: Users,
    title: "1. The rep opens the purse",
    body: "A purse has a name, a G$ target, a deadline and a fixed share for each member. Everyone can read it.",
  },
  {
    icon: Coins,
    title: "2. Members pay in G$",
    body: "Each member pays their share, or more if they like. The paid list and the total update for the whole class.",
  },
  {
    icon: ShieldCheck,
    title: "3. Money moves only by majority",
    body: "The rep writes a spending request with a reason and an amount. It is released only after more than half of the paying members approve.",
  },
];

export default function Home() {
  const { purse } = usePurse();
  const total = collected(purse);
  const members = paidMembers(purse).length;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 size-[28rem] rounded-full bg-accent/10 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
          <DemoBanner className="mb-10" />

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                G$ class fund on Celo
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Class money everyone can see.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                A class rep opens a purse with a target and a deadline. Members pay in G$. Every payment and every
                payout is open to the whole class, and nothing leaves the purse without a majority.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/purse">
                  <Button variant="accent" className="h-12 w-full px-6 text-base font-semibold sm:w-auto">
                    Open the demo purse
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/create">
                  <Button variant="outline" className="h-12 w-full px-6 text-base sm:w-auto">
                    Start a purse
                  </Button>
                </Link>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                First milestone: the interface runs locally with sample data. Wallet payments and the on-chain purse
                come next.
              </p>
            </div>

            <div className="relative">
              <div
                className="rounded-xl border border-border bg-card p-5 shadow-xl shadow-black/30 sm:-rotate-2 sm:p-6"
                aria-label="Demo purse preview"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Purse · {purse.rep}</p>
                    <p className="mt-1 font-display text-xl font-semibold tracking-tight">{purse.name}</p>
                  </div>
                  <Badge tone="warning">Demo</Badge>
                </div>

                <p className="mt-6 font-display text-3xl font-semibold leading-none tabular-nums">{gd(total)}</p>
                <p className="mt-1 text-sm text-muted-foreground">of {gd(purse.target)} target</p>
                <ProgressBar
                  percent={progressPercent(purse)}
                  label={`${gd(total)} of ${gd(purse.target)}`}
                  className="mt-4"
                />

                <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Paid</p>
                    <p className="mt-1 font-medium tabular-nums">{members} members paid</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Deadline</p>
                    <p className="mt-1 font-medium tabular-nums">{closesIn(purse.deadline)}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs">
                  {pendingSummary(purse)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="max-w-lg font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            How the purse works
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="rounded-xl border border-border bg-card p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-8 rounded-xl border border-accent/25 bg-accent/5 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-accent">The majority rule</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Nobody spends the class money alone.
            </h2>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
              A request is released only after more than half of the members who paid have approved it, and the
              release goes straight to the rep's own wallet. New members join the count as soon as they pay.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Worked example</p>
            <p className="mt-2 font-display text-xl font-semibold tracking-tight">8 paid members need 5 approvals.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              A 9th member pays, and the same request now needs 5 of 9.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
