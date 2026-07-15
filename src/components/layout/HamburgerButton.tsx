import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";

type HamburgerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "light" | "dark";
};

export const HamburgerButton = forwardRef<
  HTMLButtonElement,
  HamburgerButtonProps
>(function HamburgerButton({ className, tone = "light", ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Open menu"
      className={cn(
        "inline-flex h-9 w-9 cursor-pointer items-center justify-center lg:h-8 lg:w-8",
        "transition-colors duration-150",
        focusRing(tone === "light" ? "dark" : "light"),
        tone === "light"
          ? "text-ink-inverse hover:text-accent"
          : "text-ink hover:text-accent",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="block h-[58px] w-[58px] shrink-0 bg-current lg:h-[39.1px] lg:w-[39.1px]"
        style={{
          WebkitMask:
            "url('/svgs/line-pattern.svg') center / contain no-repeat",
          mask: "url('/svgs/line-pattern.svg') center / contain no-repeat",
        }}
      />
    </button>
  );
});
