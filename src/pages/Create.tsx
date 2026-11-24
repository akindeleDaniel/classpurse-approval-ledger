import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { DemoBanner } from "../components/DemoBanner";
import { usePurse } from "../lib/usePurse";
import { dateInputValue, deadlineFromInput, toAmount } from "../lib/demoPurse";

const DAY = 86_400_000;

interface Errors {
  rep?: string;
  name?: string;
  target?: string;
  deadline?: string;
  share?: string;
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-xs text-danger">
      {children}
    </p>
  );
}

export default function Create() {
  const navigate = useNavigate();
  const { replacePurse } = usePurse();
  const [rep, setRep] = useState("Chidi Okeke");
  const [name, setName] = useState("");
  const [target, setTarget] = useState("40000");
  const [deadline, setDeadline] = useState(dateInputValue(Date.now() + 30 * DAY));
  const [share, setShare] = useState("2000");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    document.title = "Open a purse · Class Purse";
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    const targetValue = toAmount(target);
    const shareValue = toAmount(share);
    const deadlineAt = deadlineFromInput(deadline);

    if (!name.trim()) next.name = "Give the purse a name.";
    if (targetValue <= 0) next.target = "Enter a G$ target above 0.";
    if (!deadlineAt || deadlineAt <= Date.now()) next.deadline = "Pick a deadline in the future.";
    if (shareValue <= 0) next.share = "Enter a share per member above 0.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    replacePurse({
      name: name.trim(),
      rep: rep.trim() || "The class rep",
      target: targetValue,
      share: shareValue,
      deadline: deadlineAt,
    });
    navigate("/purse");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start lg:gap-16">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">New purse</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Open a purse for your class
          </h1>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
            You set the target and the deadline. Members pay in G$, and the purse stays read-only for spending until a
            majority approves a request.
          </p>

          <DemoBanner className="mt-6" />

          <Card className="mt-6">
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={onSubmit} noValidate className="max-w-md space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="rep">Your name (class rep)</Label>
                  <Input
                    id="rep"
                    value={rep}
                    onChange={(e) => setRep(e.target.value)}
                    placeholder="Chidi Okeke"
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="purse-name">Purse name</Label>
                  <Input
                    id="purse-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="CHM 302 Lab Fund"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "purse-name-error" : undefined}
                    className="h-11"
                  />
                  {errors.name ? <FieldError id="purse-name-error">{errors.name}</FieldError> : null}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="target">G$ target</Label>
                    <Input
                      id="target"
                      inputMode="decimal"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="40000"
                      aria-invalid={Boolean(errors.target)}
                      aria-describedby={errors.target ? "target-error" : undefined}
                      className="h-11"
                    />
                    {errors.target ? <FieldError id="target-error">{errors.target}</FieldError> : null}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="share">Fixed amount per member (G$)</Label>
                    <Input
                      id="share"
                      inputMode="decimal"
                      value={share}
                      onChange={(e) => setShare(e.target.value)}
                      aria-invalid={Boolean(errors.share)}
                      aria-describedby={errors.share ? "share-error" : "share-hint"}
                      className="h-11"
                    />
                    {errors.share ? (
                      <FieldError id="share-error">{errors.share}</FieldError>
                    ) : (
                      <p id="share-hint" className="text-xs text-muted-foreground">
                        Members may pay more than this.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    aria-invalid={Boolean(errors.deadline)}
                    aria-describedby={errors.deadline ? "deadline-error" : "deadline-hint"}
                    className="h-11"
                  />
                  {errors.deadline ? (
                    <FieldError id="deadline-error">{errors.deadline}</FieldError>
                  ) : (
                    <p id="deadline-hint" className="text-xs text-muted-foreground">
                      Members can pay until this date.
                    </p>
                  )}
                </div>

                <Button type="submit" variant="accent" className="h-12 w-full text-base font-semibold">
                  Create purse
                </Button>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Demo only: the purse lives in this browser tab until real G$ payments are added in the next
                  milestone.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">What the class gets</p>
          <ul className="mt-4 space-y-4 text-sm">
            <li>
              <p className="font-medium">A public target</p>
              <p className="mt-1 text-muted-foreground">
                Everyone watches one progress bar, so nobody has to ask how much came in.
              </p>
            </li>
            <li>
              <p className="font-medium">A paid list</p>
              <p className="mt-1 text-muted-foreground">
                Each member sees who has paid and how much, with every payment in the history.
              </p>
            </li>
            <li>
              <p className="font-medium">One rule for spending</p>
              <p className="mt-1 text-muted-foreground">
                The rep writes a request with a reason. Money moves only after more than half of the paying members
                approve.
              </p>
            </li>
          </ul>
          <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            A purse can be for a lab fund, a study trip, a class gift or exam materials. Same rules every time.
          </p>
        </aside>
      </div>
    </div>
  );
}
