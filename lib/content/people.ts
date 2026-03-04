import fs from "node:fs";
import type { Locale } from "@/lib/i18n/locales";
import { getPeoplePath } from "@/lib/content/paths";

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  links?: { label: string; url: string }[];
};

export type PersonProfile = {
  name: string;
  headline: string;
  bio: string;
  photos: string[];
  timeline: TimelineItem[];
  skills: { category: string; items: string[] }[];
  contacts: { label: string; value: string; url?: string }[];
};

export function getPerson(locale: Locale): PersonProfile {
  const filePath = getPeoplePath(locale);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as PersonProfile;
}
