import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "../components/ui/toast";
import { VISITOR, seedPurse, type NewPurseInput, type Payment, type Purse, type SpendRequest } from "./demoPurse";

interface PurseStore {
  purse: Purse;
  visitor: string;
  /** Record a sample payment from the demo visitor. */
  payIn: (amount: number) => void;
  approve: (requestId: string) => void;
  createRequest: (reason: string, amount: number) => void;
  replacePurse: (input: NewPurseInput) => void;
  resetPurse: () => void;
}

const PurseContext = createContext<PurseStore | null>(null);

/** The demo purse, held in this browser tab only (no contract and no saved data yet). */
export function PurseProvider({ children }: { children: ReactNode }) {
  const [purse, setPurse] = useState<Purse>(() => seedPurse());

  const payIn = useCallback((amount: number) => {
    const entry: Payment = { id: `pay-${Date.now()}`, name: VISITOR, amount, at: Date.now(), demo: true };
    setPurse((prev) => ({ ...prev, payments: [entry, ...prev.payments] }));
  }, []);

  const approve = useCallback((requestId: string) => {
    setPurse((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r.id === requestId && !r.approvals.includes(VISITOR) ? { ...r, approvals: [...r.approvals, VISITOR] } : r,
      ),
    }));
  }, []);

  const createRequest = useCallback((reason: string, amount: number) => {
    const request: SpendRequest = { id: `req-${Date.now()}`, reason, amount, approvals: [], createdAt: Date.now() };
    setPurse((prev) => ({ ...prev, requests: [request, ...prev.requests] }));
  }, []);

  const replacePurse = useCallback((input: NewPurseInput) => {
    setPurse({
      name: input.name,
      rep: input.rep,
      target: input.target,
      share: input.share,
      deadline: input.deadline,
      payments: [],
      requests: [],
    });
    toast.success("Purse created (demo)", { description: "Sample data only: this purse resets when you reload." });
  }, []);

  const resetPurse = useCallback(() => setPurse(seedPurse()), []);

  const value = useMemo<PurseStore>(
    () => ({ purse, visitor: VISITOR, payIn, approve, createRequest, replacePurse, resetPurse }),
    [purse, payIn, approve, createRequest, replacePurse, resetPurse],
  );

  return <PurseContext.Provider value={value}>{children}</PurseContext.Provider>;
}

export function usePurse(): PurseStore {
  const store = useContext(PurseContext);
  if (!store) throw new Error("usePurse must be used inside <PurseProvider>.");
  return store;
}
