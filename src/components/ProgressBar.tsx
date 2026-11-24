import { cn } from "../lib/utils";

/** The gold bar that carries the purse: how much of the target has been collected. */
export function ProgressBar({
  percent,
  label,
  className,
}: {
  percent: number;
  label: string;
  className?: string;
}) {
  const safe = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safe}
      aria-valuetext={label}
      className={cn("h-3 w-full overflow-hidden rounded-full bg-muted ring-1 ring-inset ring-border", className)}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
