import Link from "next/link";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import { Wordmark } from "@/components/ui/Wordmark";

export default function NotFound() {
  return (
    <main className="bg-surface-dark text-ink-inverse flex min-h-[calc(100svh/0.85)] flex-col items-center justify-center gap-10 px-6 text-center">
      <Wordmark size="sm" />
      <div className="space-y-3">
        <p className="type-headline">
          Page not found
        </p>
        <p className="type-meta text-ink-inverse/55">
          The page you are looking for does not exist.
        </p>
      </div>
      <Link
        href="/"
        className={cn(
          "type-menu text-ink-inverse/70 hover:text-accent",
          "transition-colors duration-200 motion-reduce:transition-none",
          focusRing("dark"),
        )}
      >
        Return home
      </Link>
    </main>
  );
}
