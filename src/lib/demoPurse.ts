/**
 * Class Purse demo data. Everything here lives in memory for this browser tab only:
 * this milestone has no contract, no wallet and no real G$ movements.
 */

export interface Payment {
  id: string;
  name: string;
  amount: number;
  at: number;
  demo?: boolean;
}

export interface SpendRequest {
  id: string;
  reason: string;
  amount: number;
  approvals: string[];
  createdAt: number;
  releasedAt?: number;
}

export interface Purse {
  name: string;
  rep: string;
  target: number;
  share: number;
  deadline: number;
  payments: Payment[];
  requests: SpendRequest[];
}

export interface NewPurseInput {
  name: string;
  rep: string;
  target: number;
  share: number;
  deadline: number;
}

/** The demo visitor: a class member who has already paid in. */
export const VISITOR = "Ada Obi";

const DAY = 86_400_000;

function payment(id: string, name: string, amount: number, daysAgo: number): Payment {
  return { id, name, amount, at: Date.now() - daysAgo * DAY };
}

export function seedPurse(): Purse {
  const now = Date.now();
  return {
    name: "CHM 302 Lab Fund",
    rep: "Chidi Okeke",
    target: 40000,
    share: 2000,
    deadline: now + 12 * DAY,
    payments: [
      payment("p1", "Ada Obi", 2000, 2),
      payment("p2", "Bisi Adeyemi", 2500, 3),
      payment("p3", "Fatima Bello", 3000, 4),
      payment("p4", "Chidi Okeke", 2000, 5),
      payment("p5", "Emeka Nwosu", 2000, 6),
      payment("p6", "Tunde Salami", 2000, 7),
      payment("p7", "Samuel Ade", 1500, 8),
      payment("p8", "Zainab Yusuf", 1000, 9),
    ],
    requests: [
      {
        id: "req-reagents",
        reason: "Reagents for the titration practical",
        amount: 5000,
        approvals: ["Bisi Adeyemi", "Emeka Nwosu", "Fatima Bello", "Tunde Salami"],
        createdAt: now - DAY,
      },
      {
        id: "req-manual",
        reason: "Printing the lab manual for 40 students",
        amount: 3200,
        approvals: ["Chidi Okeke", "Bisi Adeyemi", "Emeka Nwosu", "Fatima Bello", "Tunde Salami", "Zainab Yusuf"],
        createdAt: now - 8 * DAY,
        releasedAt: now - 5 * DAY,
      },
    ],
  };
}

/** Each member who has paid, with everything they have paid in. */
export function paidMembers(purse: Purse): { name: string; total: number }[] {
  const byName = new Map<string, number>();
  for (const p of [...purse.payments].reverse()) {
    byName.set(p.name, (byName.get(p.name) ?? 0) + p.amount);
  }
  return Array.from(byName, ([name, total]) => ({ name, total }));
}

export function paidCount(purse: Purse): number {
  return paidMembers(purse).length;
}

export function collected(purse: Purse): number {
  return purse.payments.reduce((sum, p) => sum + p.amount, 0);
}

export function memberTotal(purse: Purse, name: string): number {
  return purse.payments.filter((p) => p.name === name).reduce((sum, p) => sum + p.amount, 0);
}

export function releasedTotal(purse: Purse): number {
  return purse.requests.reduce((sum, r) => (r.releasedAt ? sum + r.amount : sum), 0);
}

/** Money in the purse that has not been released to the rep yet. */
export function available(purse: Purse): number {
  return Math.max(0, collected(purse) - releasedTotal(purse));
}

/** More than half of the members who paid. */
export function majorityFor(paid: number): number {
  return Math.floor(paid / 2) + 1;
}

export function isReleased(request: SpendRequest): boolean {
  return request.releasedAt !== undefined;
}

/** Approved enough to be released, or already released. */
export function sealed(purse: Purse, request: SpendRequest): boolean {
  return isReleased(request);
}

export function isApproved(purse: Purse, request: SpendRequest): boolean {
  return request.approvals.length >= majorityFor(paidCount(purse));
}

export type RequestStatus = "released" | "ready" | "waiting";

export function statusOf(purse: Purse, request: SpendRequest): RequestStatus {
  if (isReleased(request)) return "released";
  return isApproved(purse, request) ? "ready" : "waiting";
}

/** The one line on the home card: what the class still has to do. */
export function pendingSummary(purse: Purse): string {
  const open = purse.requests.filter((r) => !isReleased(r));
  if (open.length === 0) return "No spending request is waiting for approvals.";
  const waiting = open.filter((r) => !isApproved(purse, r));
  if (waiting.length === 0) return "A spending request is ready for release.";
  const first = waiting[0];
  const short = majorityFor(paidCount(purse)) - first.approvals.length;
  if (waiting.length === 1) {
    return `1 spending request needs ${short} more ${short === 1 ? "approval" : "approvals"}.`;
  }
  return `${waiting.length} spending requests need approvals.`;
}

export function progressPercent(purse: Purse): number {
  if (purse.target <= 0) return 0;
  return Math.min(100, Math.round((collected(purse) / purse.target) * 100));
}

export function daysLeft(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / DAY));
}

export function closesIn(deadline: number): string {
  const days = daysLeft(deadline);
  if (days === 0) return "Closed";
  if (days === 1) return "Closes tomorrow";
  return `Closes in ${days} days`;
}

/** G$ amounts are whole tokens in this demo, shown with thousands separators. */
export function gd(amount: number): string {
  return `${Math.round(amount).toLocaleString("en-US")} G$`;
}

export function toAmount(text: string): number {
  const value = Number.parseFloat(text.replace(/,/g, ""));
  return Number.isFinite(value) ? Math.round(value) : 0;
}

export function relativeTime(at: number): string {
  const seconds = Math.round((Date.now() - at) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.round(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}

export function longDate(at: number): string {
  return new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

/** yyyy-mm-dd for a date input. */
export function dateInputValue(at: number): string {
  const d = new Date(at);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/** End of the chosen day, local time. */
export function deadlineFromInput(value: string): number {
  const at = new Date(`${value}T23:59:59`).getTime();
  return Number.isFinite(at) ? at : 0;
}
