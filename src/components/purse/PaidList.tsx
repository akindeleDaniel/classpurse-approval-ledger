import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { gd, memberTotal, paidMembers, type Purse } from "../../lib/demoPurse";

/** Everyone who has paid in, biggest first. The demo visitor's own row is marked. */
export function PaidList({ purse, visitor }: { purse: Purse; visitor: string }) {
  const members = paidMembers(purse);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 p-5 pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Users className="size-4 text-accent" aria-hidden="true" />
          Who has paid
        </CardTitle>
        <span className="text-xs tabular-nums text-muted-foreground">{members.length} paid</span>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        {members.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
            No payments yet. Share the purse with your class and the first payment will show up here.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {members.map((member) => {
              const mine = member.name === visitor;
              return (
                <li
                  key={member.name}
                  className={
                    "flex items-center gap-3 py-2.5 " + (mine ? "-mx-2 rounded-md bg-accent/5 px-2" : "")
                  }
                >
                  <Avatar name={member.name} size={32} />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {member.name}
                    {mine ? (
                      <Badge tone="warning" className="ml-2 align-middle">
                        You
                      </Badge>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-sm font-medium tabular-nums">{gd(memberTotal(purse, member.name))}</span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
