"use client";

import { ArrowUpRight, BookOpen, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categoryMeta, type MindMapNodeData } from "@/data/security-course/mindmapData";

export function DetailPanel({
  node,
  onSelectNode,
  relatedNodes,
}: {
  node: MindMapNodeData | null;
  relatedNodes: MindMapNodeData[];
  onSelectNode: (nodeId: string) => void;
}) {
  if (!node) {
    return (
      <aside className="h-full overflow-auto border-l border-slate-200 bg-white p-5">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
          <BookOpen className="size-7 text-slate-500" />
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">选择一个节点开始复习</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            点击中心节点、一级模块或知识点后，这里会显示详细解释、英文术语和复习要点。
          </p>
        </div>
      </aside>
    );
  }

  const meta = categoryMeta[node.category];

  return (
    <aside className="h-full overflow-auto border-l border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Badge style={{ backgroundColor: meta.soft, color: meta.color }}>{meta.label}</Badge>
        <Badge variant="outline">Level {node.level}</Badge>
      </div>

      <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-950">{node.title}</h2>
      {node.englishTitle ? <p className="mt-1 text-lg font-medium text-slate-500">{node.englishTitle}</p> : null}
      {node.summary ? <p className="mt-4 text-base leading-7 text-slate-700">{node.summary}</p> : null}

      {node.importantSentence ? (
        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4 text-base leading-7">
          <p className="font-medium text-slate-900">{node.importantSentence.zh}</p>
          <p className="mt-1 text-slate-500">{node.importantSentence.en}</p>
        </div>
      ) : null}

      {node.bullets?.length ? (
        <section className="mt-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <ListChecks className="size-5" />
            复习要点
          </h3>
          <ul className="mt-3 space-y-3">
            {node.bullets.map((item) => (
              <li key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-base leading-7 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {relatedNodes.length ? (
        <section className="mt-6">
          <h3 className="text-lg font-semibold text-slate-950">关联子节点</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedNodes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNode(item.id)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                {item.title}
                <ArrowUpRight className="size-3.5" />
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  );
}
