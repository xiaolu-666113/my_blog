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
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="space-y-2">
        <div className="text-xs text-muted-foreground">
          {formatDate(item.date, locale)}
        </div>
        <Link
          href={`/${locale}/articles/${item.slug}`}
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
