import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatDate";
import type { Article } from "@/lib/content/articles";
import type { Locale } from "@/lib/i18n/locales";

export function ArticleCard({
  item,
  locale,
}: {
  item: Article;
  locale: Locale;
}) {
  return (
    <Card className="group relative overflow-hidden border-white/50 bg-gradient-to-b from-card to-cyan-50/55 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:border-white/10 dark:from-card dark:to-cyan-950/15">
      <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-cyan-400/25 blur-2xl transition-opacity duration-300 group-hover:opacity-90 dark:bg-cyan-500/20" />
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit rounded-full border border-border/70 bg-white/70 px-2.5 py-1 text-xs text-muted-foreground dark:bg-white/10">
          {formatDate(item.date, locale)}
        </div>
        <Link
          href={`/${locale}/articles/${item.slug}`}
          className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary"
        >
          {item.title}
        </Link>
        <p className="text-sm text-muted-foreground">{item.summary}</p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}
