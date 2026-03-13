import Link from "next/link";

export function HomeFeatured({
  title,
  viewAllHref,
  viewAllLabel,
  children,
}: {
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {viewAllLabel}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
}
