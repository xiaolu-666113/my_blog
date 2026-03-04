import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatDate";
import type { Research } from "@/lib/content/research";
import type { Locale } from "@/lib/i18n/locales";

export function ResearchCard({
  item,
  locale,
}: {
  item: Research;
  locale: Locale;
}) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDate(item.date, locale)}</span>
          <Badge variant="secondary">{item.status}</Badge>
        </div>
        <Link
          href={`/${locale}/research/${item.slug}`}
          className="text-lg font-semibold leading-snug hover:underline"
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
