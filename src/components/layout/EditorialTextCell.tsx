import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EditorialTextCellProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
};

export function EditorialTextCell({
  children,
  className,
  contentClassName,
}: EditorialTextCellProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center px-6 py-10 md:px-14 lg:min-h-[476px] lg:px-20 lg:py-14 xl:px-24",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[520px] text-left",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
