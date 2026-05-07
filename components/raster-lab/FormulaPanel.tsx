"use client";

import type { Lesson } from "@/types/rasterLab";

export function FormulaPanel({ lesson }: { lesson: Lesson }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">算法简介</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{lesson.intro}</p>

      <p className="mt-4 text-sm font-semibold text-slate-950">核心思想</p>
      <ul className="mt-2 space-y-2">
        {lesson.coreIdeas.map((item) => (
          <li key={item} className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm font-semibold text-slate-950">公式 / 判别式</p>
      <div className="mt-2 space-y-2">
        {lesson.formula.map((item) => (
          <code key={item} className="block rounded-md bg-slate-950 px-3 py-2 text-sm leading-6 text-cyan-100">
            {item}
          </code>
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-950">复杂度与特点</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {lesson.features.map((item) => (
          <span key={item} className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
