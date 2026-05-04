"use client";

import { Search } from "lucide-react";

export function SearchBox({
  value,
  resultCount,
  onChange,
}: {
  value: string;
  resultCount: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block min-w-[280px] flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="搜索 SUID / rsp / execve / DEP"
        className="h-12 w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 text-base text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
      {value.trim() ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
          {resultCount} 个
        </span>
      ) : null}
    </label>
  );
}
