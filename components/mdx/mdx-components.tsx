/* eslint-disable @next/next/no-img-element */
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { Callout } from "@/components/mdx/Callout";

export const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-8 text-3xl font-semibold tracking-tight" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 text-2xl font-semibold tracking-tight" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-6 text-xl font-semibold tracking-tight" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 text-base leading-relaxed text-muted-foreground" {...props} />
  ),
  a: ({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          className="font-medium text-foreground underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        />
      );
    }
    return (
      <Link
        href={href}
        className="font-medium text-foreground underline-offset-4 hover:underline"
        {...props}
      />
    );
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-6 border-l-2 border-border pl-4 text-base text-muted-foreground"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mt-6 overflow-x-auto rounded-xl border border-border/70 bg-muted/40 p-4 text-sm"
      {...props}
    />
  ),
  img: ({
    alt = "",
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      alt={alt}
      className="mt-6 rounded-2xl border border-border/60"
      {...props}
    />
  ),
  Image: ({ alt, ...props }: ImageProps) => (
    <Image alt={alt} className="rounded-2xl border border-border/60" {...props} />
  ),
  Callout,
};
