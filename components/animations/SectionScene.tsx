"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type SceneDecorItem = {
  src: string;
  className: string;
  width: number;
  height: number;
  delayMs?: number;
};

type SectionSceneProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  decor?: SceneDecorItem[];
  once?: boolean;
  threshold?: number;
};

export function SectionScene({
  children,
  className,
  contentClassName,
  decor = [],
  once = true,
  threshold = 0.24,
}: SectionSceneProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
          return;
        }
        if (!once) {
          setVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={rootRef}
      className={cn("scroll-scene relative", visible && "is-visible", className)}
    >
      {decor.length > 0 && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
          {decor.map((item, index) => (
            <Image
              key={`${item.src}-${index}`}
              src={item.src}
              alt=""
              width={item.width}
              height={item.height}
              className={cn("scene-decor absolute", item.className)}
              style={{ "--d": `${item.delayMs ?? 0}ms` } as CSSProperties}
            />
          ))}
        </div>
      )}
      <div className={cn("scroll-card", contentClassName)}>{children}</div>
    </div>
  );
}
