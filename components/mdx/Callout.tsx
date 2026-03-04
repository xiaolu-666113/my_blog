import { cn } from "@/lib/utils";

const variants = {
  info: "border-blue-200/60 bg-blue-50/50 text-blue-900 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-100",
  warning:
    "border-amber-200/70 bg-amber-50/60 text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100",
  success:
    "border-emerald-200/70 bg-emerald-50/60 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100",
};

export function Callout({
  title,
  children,
  type = "info",
}: {
  title?: string;
  children: React.ReactNode;
  type?: keyof typeof variants;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-5 py-4 text-sm leading-relaxed",
        variants[type],
      )}
    >
      {title && <p className="mb-2 text-sm font-semibold">{title}</p>}
      {children}
    </div>
  );
}
