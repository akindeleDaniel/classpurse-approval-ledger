import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, Wallet2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

const NAV = [
  { to: "/purse", label: "Purse" },
  { to: "/create", label: "Start a purse" },
  { to: "/how-it-works", label: "How it works" },
];

function linkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
    isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-muted text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <NavLink to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Class Purse home">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
              <Wallet2 className="size-5" aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-base font-semibold tracking-tight">Class Purse</span>
              <span className="mt-1 hidden text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
                G$ class fund
              </span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            <Badge tone="warning" className="ml-2">
              Demo
            </Badge>
          </nav>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen(true)}
            className="grid size-11 place-items-center rounded-lg border border-border text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 md:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="bg-background">
          <SheetHeader>
            <SheetTitle className="font-display">Class Purse</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1" aria-label="Menu">
            {NAV.map((item) => (
              <SheetClose asChild key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                      isActive ? "bg-accent/10 font-medium text-accent" : "text-foreground hover:bg-muted",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </SheetClose>
            ))}
          </nav>
          <p className="mt-auto rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-muted-foreground">
            Demo milestone: sample data in this browser tab. No G$ moves yet.
          </p>
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display font-semibold tracking-tight">Class Purse</p>
            <p className="mt-1 text-muted-foreground">Class Purse preview: sample data only.</p>
          </div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            G$ class fund on Celo · demo milestone
          </p>
        </div>
      </footer>
    </div>
  );
}
