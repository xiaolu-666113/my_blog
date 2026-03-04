import { en } from "@/lib/i18n/dict/en";
import { zh } from "@/lib/i18n/dict/zh";
import { defaultLocale, isLocale, type Locale, locales } from "@/lib/i18n/locales";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  zh,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? segment : null;
}

export function ensureLocale(pathname: string, locale: Locale) {
  if (!pathname.startsWith("/")) return `/${locale}`;
  const parts = pathname.split("/");
  if (parts.length > 1 && isLocale(parts[1])) {
    parts[1] = locale;
    return parts.join("/");
  }
  return `/${locale}${pathname}`;
}

export function getLocaleFromAcceptLanguage(header?: string | null): Locale {
  if (!header) return defaultLocale;
  const lowered = header.toLowerCase();
  if (lowered.includes("zh")) return "zh";
  if (lowered.includes("en")) return "en";
  return defaultLocale;
}

export const localeLabels: Record<Locale, string> = {
  en: en.localeName,
  zh: zh.localeName,
};

export const allLocales = locales;
