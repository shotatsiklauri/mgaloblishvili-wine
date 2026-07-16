import Link from "next/link";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus-ring";
import { NavWord } from "@/components/ui/NavWord";

type NavLinkProps = {
  href: string;
  active?: boolean;
  className?: string;
  wordClassName?: string;
  edgeUnderline?: boolean;
  underlineClassName?: string;
  children: React.ReactNode;
};

export function NavLink({
  href,
  active = false,
  className,
  wordClassName,
  edgeUnderline = false,
  underlineClassName,
  children,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center px-1 py-2",
        focusRing("dark"),
        edgeUnderline && "h-full",
        className,
      )}
    >
      <NavWord
        active={active}
        edgeUnderline={edgeUnderline}
        className={wordClassName}
        underlineClassName={underlineClassName}
      >
        {children}
      </NavWord>
    </Link>
  );
}
