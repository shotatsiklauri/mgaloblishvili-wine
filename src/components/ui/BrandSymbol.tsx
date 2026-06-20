import { cn } from "@/lib/utils";

type BrandSymbolProps = {
  className?: string;
  size?: number;
  title?: string;
};

export function BrandSymbol({ className, size, title }: BrandSymbolProps) {
  const center = 50;
  const arm = 28;
  const outerR = 11;
  const centerR = 9;
  const barW = 9;

  const labelled = Boolean(title);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role={labelled ? "img" : "presentation"}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? title : undefined}
      className={cn("fill-current", size ? "inline-block" : "block", className)}
    >
      {title ? <title>{title}</title> : null}
      <rect
        x={center - barW / 2}
        y={center - arm}
        width={barW}
        height={arm * 2}
        rx={barW / 2}
      />
      <rect
        x={center - arm}
        y={center - barW / 2}
        width={arm * 2}
        height={barW}
        rx={barW / 2}
      />
      <circle cx={center} cy={center - arm} r={outerR} />
      <circle cx={center} cy={center + arm} r={outerR} />
      <circle cx={center - arm} cy={center} r={outerR} />
      <circle cx={center + arm} cy={center} r={outerR} />
      <circle cx={center} cy={center} r={centerR} />
    </svg>
  );
}
