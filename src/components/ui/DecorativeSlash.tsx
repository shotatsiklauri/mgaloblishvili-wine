import { cn } from "@/lib/utils";

type DecorativeSlashProps = {
  className?: string;
};

export function DecorativeSlash({ className }: DecorativeSlashProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "decorative-slash pointer-events-none absolute top-1/2 left-1/2 z-10",
        "desktop:h-[0.425px] desktop:min-h-0 desktop:w-[max(63.75px,calc(var(--desktop-fluid-unit)*85))] h-[0.5px] min-h-px w-[100px] -translate-x-1/2 -translate-y-1/2 rotate-[-45deg]",
        "bg-white/30",
        "transition-opacity duration-300 ease-out motion-reduce:transition-none",
        "group-hover:opacity-0 group-focus-visible:opacity-0",
        className,
      )}
    />
  );
}
