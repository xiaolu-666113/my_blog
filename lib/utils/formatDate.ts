import type { Locale } from "@/lib/i18n/locales";

export function formatDate(dateString: string, locale: Locale) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  const hasDay = parts.length >= 3;
  const normalized = parts.length === 2 ? `${dateString}-01` : dateString;
  const date = new Date(normalized);

  const options: Intl.DateTimeFormatOptions = hasDay
    ? { year: "numeric", month: "short", day: "numeric" }
    : { year: "numeric", month: "short" };

  const resolvedLocale = locale === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(resolvedLocale, options).format(date);
}
