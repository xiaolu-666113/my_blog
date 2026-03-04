"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { type Locale } from "@/lib/i18n/locales";
import { ensureLocale, localeLabels } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (nextLocale: Locale) => {
    const target = ensureLocale(pathname, nextLocale);
    router.push(target);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-3">
          {localeLabels[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(localeLabels) as Locale[]).map((item) => (
          <DropdownMenuItem key={item} onClick={() => handleSwitch(item)}>
            {localeLabels[item]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
