import { cn } from "@/lib/utils";
import { SubtleVideoBackground } from "@/components/layout/SubtleVideoBackground";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("bg-surface text-ink relative isolate flex min-h-[calc(100svh)] flex-col")}
    >
      <SubtleVideoBackground />
      <div className="relative z-10 flex min-h-[calc(100svh)] flex-col">{children}</div>
    </div>
  );
}
