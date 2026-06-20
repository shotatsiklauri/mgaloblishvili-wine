import { cookies } from "next/headers";
import type { Locale } from "@/data/content";

export const LOCALE_COOKIE = "mga-locale";
export const SUPPORTED_LOCALES = ["en", "ka"] as const;
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(v: unknown): v is Locale {
  return (
    typeof v === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(v)
  );
}

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
