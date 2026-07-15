import { cn } from "@/lib/utils";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export function Container({ className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:max-w-[1020px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
