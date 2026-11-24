import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] w-full max-w-6xl place-items-center px-4 py-16 text-center sm:px-6">
      <div>
        <p className="font-display text-5xl font-semibold tracking-tight text-accent">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          This page is not part of the purse.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The purse is still where you left it. Head back and keep going.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="accent" className="h-11 px-6">
            Back to Class Purse
          </Button>
        </Link>
      </div>
    </div>
  );
}
