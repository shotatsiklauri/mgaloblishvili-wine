import { cn, toMtavruliIfGeorgian } from "@/lib/utils";

type NavWordProps = {
  active?: boolean;
  edgeUnderline?: boolean;
  className?: string;
  underlineClassName?: string;
  children: React.ReactNode;
};

export function NavWord({
  active = false,
  edgeUnderline = false,
  className,
  underlineClassName,
  children,
}: NavWordProps) {
  const isTextLabel = typeof children === "string";
  const isGeorgianLabel = isTextLabel && /[ა-ჺ]/.test(children);
  const label = isTextLabel ? toMtavruliIfGeorgian(children) : children;

  return (
    <>
      <span className={cn("relative inline-block", className)}>
        <span
          className={cn(
            "type-menu nav-word block tracking-[0.3em] transition-colors duration-300 ease-out motion-reduce:transition-none",
            isGeorgianLabel && "nav-word--mtavruli",
            active
              ? "text-accent"
              : "group-hover:text-accent group-focus-visible:text-accent text-white",
          )}
        >
          {label}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute h-[3px] origin-left bg-white desktop:h-[calc(var(--desktop-fluid-unit)*2.55)]",
          !underlineClassName &&
            "-right-10 -left-10 desktop:-right-[calc(var(--desktop-fluid-unit)*34)] desktop:-left-[calc(var(--desktop-fluid-unit)*34)]",
          "transition-transform duration-[1420ms] ease-out motion-reduce:transition-none",
          active
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100",
          edgeUnderline ? "bottom-0 md:-right-14 md:-left-14" : "-bottom-3",
          underlineClassName,
        )}
      />
    </>
  );
}
