import { cn } from "@/lib/utils";
import { BrandLogoImg } from "@/components/ui/BrandLogoImg";

type WordmarkProps = {
  size?: "lg" | "sm" | "header" | "home";
  className?: string;
  asHeading?: boolean;
};

const SIZE_CLASSES = {
  lg: "w-[clamp(260px,46vw,460px)] desktop:w-[max(221px,calc(var(--desktop-fluid-unit)*391))]",
  sm: "w-[150px] md:w-[180px] desktop:w-[calc(var(--desktop-fluid-unit)*153)]",
  header:
    "w-[150px] sm:w-[180px] md:w-[270px] desktop:w-[max(180px,calc(var(--desktop-fluid-unit)*238))]",
  home: "w-[188px] sm:w-[225px] md:w-[338px] desktop:w-[max(289px,calc(var(--desktop-fluid-unit)*340))]",
} as const;

export function Wordmark({
  size = "lg",
  className,
  asHeading = false,
}: WordmarkProps) {
  const Tag = asHeading ? "h1" : "span";

  return (
    <Tag className={cn("inline-block leading-none select-none", className)}>
      <span className="sr-only">Mgaloblishvili</span>
      <BrandLogoImg className={SIZE_CLASSES[size]} />
    </Tag>
  );
}
