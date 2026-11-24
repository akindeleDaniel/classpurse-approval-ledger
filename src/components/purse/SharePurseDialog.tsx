import { useState } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Notice } from "../ui/notice";
import { toast } from "../ui/toast";
import { gd, type Purse } from "../../lib/demoPurse";

/** The purse's own page in this app, with the hash router (no server routes). */
function purseLink(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}#/purse`;
}

/** The message the rep pastes into the class group: what the purse is, and the link. */
export function inviteText(purse: Purse, link: string): string {
  return [
    `${purse.name} · Class Purse`,
    `Target ${gd(purse.target)}, ${gd(purse.share)} per member.`,
    `See who has paid and approve spending requests here: ${link}`,
    `(Class Purse preview: sample data only, no G$ moves yet.)`,
  ].join("\n");
}

/** Copy without the clipboard API, for browsers that block it: a hidden textarea and the old command. */
function legacyCopy(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}

/**
 * The rep's share sheet: the purse link, a copy button and a WhatsApp button that opens the class
 * group with the invite already written. Demo only: the link opens the sample purse.
 */
export function SharePurseDialog({ purse }: { purse: Purse }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const link = purseLink();

  function reset() {
    setCopied(false);
    setCopyError(null);
  }

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else if (!legacyCopy(link)) {
        throw new Error("copy blocked");
      }
      setCopied(true);
      setCopyError(null);
      toast.success("Purse link copied");
    } catch {
      setCopied(false);
      setCopyError("This browser blocked the clipboard. The link is below: select it and copy it by hand.");
      const field = document.getElementById("purse-link") as HTMLInputElement | null;
      field?.focus();
      field?.select();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="accent" className="h-10">
          <Share2 className="size-4" aria-hidden="true" />
          Share purse
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Share the purse with your class</DialogTitle>
          <DialogDescription>
            Paste this link into the class WhatsApp group so everyone can see who has paid and approve spending.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="purse-link">Purse link</Label>
          <Input
            id="purse-link"
            readOnly
            value={link}
            onFocus={(event) => event.currentTarget.select()}
            className="h-11 text-xs sm:text-sm"
            aria-describedby="purse-link-hint"
          />
          <p id="purse-link-hint" className="text-xs text-muted-foreground">
            It opens the {purse.name} page. In this milestone it shows the sample purse.
          </p>
        </div>

        {copyError ? <Notice tone="danger">{copyError}</Notice> : null}

        {copied ? (
          <Notice tone="success" title="Link copied">
            Now paste it into the class group.
          </Notice>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={copy} className="h-11 w-full">
            {copied ? (
              <Check className="size-4 text-success" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy link"}
          </Button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(inviteText(purse, link))}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Share on WhatsApp
          </a>
        </div>

        <p className="rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
          The invite reads: “{purse.name} · Class Purse. Target {gd(purse.target)}, {gd(purse.share)} per member.”
          followed by the link.
        </p>
      </DialogContent>
    </Dialog>
  );
}
