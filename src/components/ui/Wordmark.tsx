import { cn } from "@/lib/utils";
import { BrandLogoImg } from "@/components/ui/BrandLogoImg";

type WordmarkProps = {
  size?: "lg" | "sm" | "header" | "home";
  className?: string;
  asHeading?: boolean;
};

const SIZE_CLASSES = {
  lg: "w-[clamp(260px,46vw,460px)] lg:w-[clamp(221px,39.1vw,391px)]",
  sm: "w-[150px] md:w-[180px] lg:w-[153px]",
  header: "w-[150px] sm:w-[180px] md:w-[270px] lg:w-[238px]",
  home: "w-[188px] sm:w-[225px] md:w-[338px] lg:w-[340px]",
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
