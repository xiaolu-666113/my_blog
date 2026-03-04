import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n/routing";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";

export default async function NotFoundPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const dict = getDictionary(locale);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{dict.misc.notFound}</h1>
      <p className="text-muted-foreground">404</p>
      <Link
        href={`/${locale}`}
        className="text-sm font-medium underline-offset-4 hover:underline"
      >
        {dict.actions.back}
      </Link>
    </div>
  );
}
