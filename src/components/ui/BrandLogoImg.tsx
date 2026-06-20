import { cn } from "@/lib/utils";

type BrandLogoImgProps = {
  className?: string;
};

export function BrandLogoImg({ className }: BrandLogoImgProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/images/Mgaloblishvili-Logo.svg"
      alt=""
      aria-hidden="true"
      width={245}
      height={50}
      decoding="async"
      className={cn("h-auto", className)}
    />
  );
}
