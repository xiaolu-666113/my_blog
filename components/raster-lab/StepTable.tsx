"use client";

import type { AlgorithmStep } from "@/types/rasterLab";

export function StepTable({
  steps,
  activeIndex,
}: {
  steps: AlgorithmStep[];
  activeIndex: number;
}) {
  const keys = Array.from(
    steps.reduce((set, step) => {
      Object.keys(step.tableRow ?? {}).forEach((key) => set.add(key));
      return set;
    }, new Set<string>())
  ).slice(0, 8);

  if (!keys.length) return null;

  return (
    <div className="max-h-[240px] overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="sticky top-0 bg-slate-100 text-slate-600">
          <tr>
            <th className="px-3 py-2 font-semibold">step</th>
            {keys.map((key) => (
              <th key={key} className="px-3 py-2 font-semibold">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {steps.map((step, index) => (
            <tr key={step.id} className={index === activeIndex ? "bg-cyan-50" : "odd:bg-slate-50/60"}>
              <td className="px-3 py-2 font-medium text-slate-900">{index}</td>
              {keys.map((key) => (
                <td key={key} className="max-w-[260px] truncate px-3 py-2 text-slate-600" title={String(step.tableRow?.[key] ?? "")}>
                  {String(step.tableRow?.[key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
