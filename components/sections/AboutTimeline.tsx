import { Badge } from "@/components/ui/badge";
import type { TimelineItem } from "@/lib/content/people";

export function AboutTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={`${item.date}-${item.title}`} className="rounded-2xl border p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{item.date}</Badge>
          </div>
          <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {item.description}
          </p>
          {item.links && item.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {item.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
