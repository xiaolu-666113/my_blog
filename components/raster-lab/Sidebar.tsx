"use client";

import { rasterLessonGroups } from "@/data/raster-lab/lessons";
import type { AlgorithmId } from "@/types/rasterLab";

export function Sidebar({
  activeId,
  onSelect,
}: {
  activeId: AlgorithmId;
  onSelect: (id: AlgorithmId) => void;
}) {
  return (
    <aside className="h-full overflow-auto border-r border-white/10 bg-slate-950/92 p-4 text-white">
      <div className="mb-5">
        <p className="text-sm font-semibold text-cyan-200">RasterLab</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-normal">光栅化算法实验室</h2>
      </div>
      <div className="space-y-5">
        {Array.from(rasterLessonGroups.entries()).map(([category, lessons]) => (
          <section key={category}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/38">{category}</p>
            <div className="space-y-1">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onSelect(lesson.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    activeId === lesson.id
                      ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                      : "text-white/72 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="block font-semibold">{lesson.title}</span>
                  <span className="mt-0.5 block text-xs opacity-70">{lesson.subtitle}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
