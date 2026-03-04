import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatDate";
import type { Project } from "@/lib/content/projects";
import type { Locale } from "@/lib/i18n/locales";

export function ProjectCard({
  item,
  locale,
}: {
  item: Project;
  locale: Locale;
}) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDate(item.date, locale)}</span>
        </div>
        <Link
          href={`/${locale}/projects/${item.slug}`}
          className="text-lg font-semibold leading-snug hover:underline"
        >
          {item.title}
        </Link>
        <p className="text-sm text-muted-foreground">{item.summary}</p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {item.stack.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}
