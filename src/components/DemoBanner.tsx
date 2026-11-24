import { Info } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * The honest label for every page in this milestone: sample numbers in this browser tab,
 * no G$ movement and nothing saved yet.
 */
export function DemoBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm sm:p-4",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
      <p className="text-foreground">
        <span className="font-semibold">Demo milestone:</span> this preview runs on sample data in this browser
        tab. No G$ moves and nothing is saved yet.
      </p>
    </div>
  );
}
