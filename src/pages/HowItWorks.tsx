import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Coins, ShieldCheck, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Notice } from "../components/ui/notice";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

const ROLES = [
  {
    icon: Users,
    title: "The class rep",
    points: [
      "Opens the purse: a name, a G$ target, a deadline and a fixed share per member.",
      "Writes a spending request whenever the class needs something bought.",
      "Can never move money alone, and cannot hide a payment or a payout.",
    ],
  },
  {
    icon: Coins,
    title: "Members",
    points: [
      "Pay the fixed share in G$, or more if they want to.",
      "Approve any open spending request, and see who else has approved.",
      "See every payment and every payout, member by member.",
    ],
  },
];

const FAQ = [
  {
    value: "wallet",
    q: "Do I need a wallet to try it?",
    a: "Not in this milestone. Everything on this page is sample data in your browser tab, so you can click through paying in and approving without a wallet. When real G$ payments arrive you will connect a wallet, either a browser wallet or a phone wallet such as MiniPay or Valora.",
  },
  {
    value: "extra",
    q: "What if I pay more than my share?",
    a: "That is welcome and it counts straight away. Your total in the paid list goes up, the progress bar moves, and you still count as one member with one approval.",
  },
  {
    value: "alone",
    q: "Can the rep spend the purse alone?",
    a: "No. A spending request only releases money after more than half of the members who have paid approve it. The rep can create the request, but the class decides.",
  },
  {
    value: "deadline",
    q: "What happens after the deadline?",
    a: "The deadline closes new payments. In this milestone the demo purse simply shows how many days are left; sending leftover money back to members is part of a later milestone.",
  },
];

export default function HowItWorks() {
  useEffect(() => {
    document.title = "How it works · Class Purse";
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">The rules</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        How Class Purse works
      </h1>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
        Class money usually lives in one person's account, and the class has to trust them. Class Purse puts the same
        money in the open: a purse with a target, a list of who paid, and a rule that nobody can spend alone.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ROLES.map((role) => (
          <div key={role.title} className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
              <role.icon className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">{role.title}</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {role.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-accent/25 bg-accent/5 p-5 sm:p-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-accent" aria-hidden="true" />
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">The majority rule</h2>
        </div>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
          A request is released only after more than half of the members who paid have approved it.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="font-display text-lg font-semibold tracking-tight">8 paid members need 5 approvals.</p>
          </div>
          <p className="text-sm text-muted-foreground">
            7 paid members need 4. A new member joins the count as soon as they pay in.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Where the money goes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">In</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Members pay G$ into the purse. Every payment shows up in the history at once.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Held</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Between payments the purse holds the money. The rep cannot touch it on their own.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Out</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              After approval the money goes straight to the rep's own wallet, and the released amount leaves the
              available balance for everyone to see.
            </p>
          </div>
        </div>
      </section>

      <Notice tone="info" title="This preview is local" className="mt-10">
        Payments, approvals and new purses are sample interactions in this browser tab. Real G$ payments, wallet
        signing and the on-chain purse arrive in the next milestone.
      </Notice>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Questions</h2>
        <Accordion type="single" className="mt-4 rounded-xl border border-border bg-card px-5">
          {FAQ.map((item) => (
            <AccordionItem key={item.value} value={item.value} className="last:border-b-0">
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link to="/purse">
          <Button variant="accent" className="h-12 w-full px-6 text-base font-semibold sm:w-auto">
            Open the demo purse
          </Button>
        </Link>
        <Link to="/create">
          <Button variant="outline" className="h-12 w-full px-6 text-base sm:w-auto">
            Start a purse
          </Button>
        </Link>
      </div>
    </div>
  );
}
