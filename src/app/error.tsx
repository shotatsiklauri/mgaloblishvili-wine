"use client";

import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import { Wordmark } from "@/components/ui/Wordmark";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="bg-surface-dark text-ink-inverse flex min-h-[calc(100svh)] flex-col items-center justify-center gap-10 px-6 text-center">
      <Wordmark size="sm" />
      <div className="space-y-3">
        <p className="type-headline">
          Something went wrong
        </p>
        <p className="type-meta text-ink-inverse/55">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className={cn(
          "type-menu text-ink-inverse/70 hover:text-accent cursor-pointer",
          "transition-colors duration-200 motion-reduce:transition-none",
          focusRing("dark"),
        )}
      >
        Try again
      </button>
    </main>
  );
}
