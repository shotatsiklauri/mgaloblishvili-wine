import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MTAVRULI_OFFSET = 0x1c90 - 0x10d0;

export function toMtavruliIfGeorgian(text: string): string {
  return text.replace(/[ა-ჺ]/g, (ch) => {
    const cp = ch.codePointAt(0);
    if (cp === undefined) return ch;
    return String.fromCodePoint(cp + MTAVRULI_OFFSET);
  });
}
