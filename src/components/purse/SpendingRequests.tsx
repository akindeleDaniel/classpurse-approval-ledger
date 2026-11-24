import { useState } from "react";
import { Check, Plus, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Notice } from "../ui/notice";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ProgressBar } from "../ProgressBar";
import { NewRequestDialog } from "./NewRequestDialog";
import { available, gd, majorityFor, paidMembers, sealed, statusOf, type Purse, type SpendRequest } from "../../lib/demoPurse";
import { usePurse } from "../../lib/usePurse";

function RequestCard({ request, purse, visitor }: { request: SpendRequest; purse: Purse; visitor: string }) {
  const { approve } = usePurse();
  const paid = paidMembers(purse).length;
  const needed = majorityFor(paid);
  const approved = request.approvals.length;
  const done = sealed(purse, request);
  const approvedByMe = request.approvals.includes(visitor);
  const status = statusOf(purse, request);
  const percent = paid === 0 ? 0 : Math.round((approved / paid) * 100);

  return (
    <li className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-sm font-medium leading-snug">{request.reason}</p>
        <span className="shrink-0 font-display text-base font-semibold tabular-nums">{gd(request.amount)}</span>
      </div>

      <div className="mt-3 space-y-1.5">
        <ProgressBar percent={percent} label={`${approved} of ${paid} approved`} className="h-2" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs tabular-nums text-muted-foreground">
            {approved} of {paid} approved
          </p>
          <p className="text-xs tabular-nums text-muted-foreground">{needed} needed</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {status === "released" ? (
          <Badge tone="success">Released to rep</Badge>
        ) : status === "ready" ? (
          <Badge tone="success">Ready for release</Badge>
        ) : (
          <Badge tone="warning">
            {needed - approved} more {needed - approved === 1 ? "approval" : "approvals"} needed
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {new Date(request.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
      </div>

      {status === "released" ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Released to {purse.rep} after the class approved. It stays here for everyone to see.
        </p>
      ) : approvedByMe ? (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-success">
          <Check className="size-3.5" aria-hidden="true" />
          You approved this request.
        </p>
      ) : (
        <Button
          variant="outline"
          className="mt-3 h-10 w-full sm:w-auto"
          onClick={() => approve(request.id)}
          aria-label={done ? "Approved" : "Approve"}
          disabled={done}
        >
          {done ? "Approved" : "Approve"}
        </Button>
      )}
    </li>
  );
}

/** Spending requests and the member vote that releases them. The rep view can add a request. */
export function SpendingRequests({ purse, visitor }: { purse: Purse; visitor: string }) {
  const { createRequest } = usePurse();
  const [role, setRole] = useState("member");
  const [dialog, setDialog] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  const requests = purse.requests;

  return (
    <Card>
      <CardHeader className="space-y-3 p-5 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <ShieldCheck className="size-4 text-accent" aria-hidden="true" />
            Spending requests
          </CardTitle>
          <Tabs value={role} onValueChange={setRole}>
            <TabsList aria-label="Demo view">
              <TabsTrigger value="member">Member</TabsTrigger>
              <TabsTrigger value="rep">Class rep</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {role === "member" ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Only the class rep can start a spending request. Switch to Class rep view to try it.
          </p>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Rep view (demo): you are {purse.rep}. Requests you create still need the class to approve them.
            </p>
            <Button variant="accent" onClick={() => setDialog(true)} className="h-10 shrink-0">
              <Plus className="size-4" aria-hidden="true" />
              New spending request
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 p-5 pt-0">
        {justCreated ? (
          <Notice tone="success" title="Spending request created">
            It now waits for approvals from members who have paid.
          </Notice>
        ) : null}

        {requests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
            No spending requests yet. The rep can ask the class to approve one.
          </div>
        ) : (
          <ul className="space-y-3">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} purse={purse} visitor={visitor} />
            ))}
          </ul>
        )}

        <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
          Demo: approvals are recorded in this browser tab only. The on-chain version tracks each member's approval
          and releases {gd(available(purse))} only after the majority signs.
        </p>
      </CardContent>

      <NewRequestDialog
        open={dialog}
        onOpenChange={setDialog}
        availableAmount={available(purse)}
        onCreate={(reason, amount) => {
          createRequest(reason, amount);
          setJustCreated(true);
        }}
      />
    </Card>
  );
}
