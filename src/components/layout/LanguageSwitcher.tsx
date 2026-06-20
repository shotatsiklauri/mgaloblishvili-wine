"use client";

import { useTransition } from "react";
import { setLocale } from "@/lib/locale-actions";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import type { Locale } from "@/data/content";

type LanguageSwitcherProps = {
  current: Locale;
  className?: string;
  tone?: "dark" | "light";
};

export function LanguageSwitcher({
  current,
  className,
  tone = "dark",
}: LanguageSwitcherProps) {
  const [pending, startTransition] = useTransition();

  const choose = (next: Locale) => {
    if (next === current || pending) return;
    startTransition(async () => {
      await setLocale(next);
    });
  };

  const baseColor = tone === "dark" ? "text-ink-inverse/70" : "text-ink/70";
  const activeColor = tone === "dark" ? "text-ink-inverse" : "text-ink";
  const ring = focusRing(tone);

  return (
    <div
      className={cn(
        "flex flex-col items-end gap-0.5",
        "type-language",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        aria-pressed={current === "en"}
        onClick={() => choose("en")}
        disabled={pending}
        className={cn(
          "cursor-pointer leading-none transition-colors duration-150",
          ring,
          "disabled:cursor-default",
          current === "en" ? activeColor : baseColor,
        )}
      >
        ENG
      </button>
      <button
        type="button"
        aria-pressed={current === "ka"}
        onClick={() => choose("ka")}
        disabled={pending}
        className={cn(
          "cursor-pointer leading-none transition-colors duration-150",
          ring,
          "disabled:cursor-default",
          current === "ka" ? activeColor : baseColor,
        )}
      >
        GEO
      </button>
    </div>
  );
}
