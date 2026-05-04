"use client";

import { useMemo, useState } from "react";
import { BookMarked, CheckCircle2, CircleDashed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DetailPanel } from "@/components/security-map/DetailPanel";
import { MindMapCanvas } from "@/components/security-map/MindMapCanvas";
import { SearchBox } from "@/components/security-map/SearchBox";
import {
  bottomSummary,
  categoryMeta,
  chapterList,
  securityMindmapNodeMap,
  securityMindmapNodes,
} from "@/data/security-course/mindmapData";

function searchNodes(keyword: string) {
  const query = keyword.trim().toLowerCase();
  if (!query) return [];

  return securityMindmapNodes.filter((node) => {
    const haystack = [
      node.title,
      node.englishTitle,
      node.summary,
      ...(node.bullets ?? []),
      node.importantSentence?.zh,
      node.importantSentence?.en,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

export function SecurityCourseMapApp() {
  const [selectedChapterId, setSelectedChapterId] = useState("chapter-18");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("center");
  const [searchKeyword, setSearchKeyword] = useState("");

  const matchedNodes = useMemo(() => searchNodes(searchKeyword), [searchKeyword]);
  const matchedNodeIds = useMemo(() => new Set(matchedNodes.map((node) => node.id)), [matchedNodes]);
  const selectedNode = selectedNodeId ? securityMindmapNodeMap.get(selectedNodeId) ?? null : null;
  const relatedNodes = selectedNodeId
    ? securityMindmapNodes.filter((node) => node.parentId === selectedNodeId)
    : [];

  function handleSearchChange(value: string) {
    setSearchKeyword(value);
    const [firstMatch] = searchNodes(value);
    if (firstMatch) setSelectedNodeId(firstMatch.id);
  }

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-violet-600 text-white">Featured Tutorial</Badge>
              <Badge variant="outline">计算机安全课程知识图谱</Badge>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
              第18章：权限提升与 Shellcode
            </h1>
            <p className="mt-1 text-xl font-medium text-slate-500">
              Chapter 18: Privilege Escalation and Shellcode
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-3 xl:w-[760px]">
            <SearchBox value={searchKeyword} resultCount={matchedNodes.length} onChange={handleSearchChange} />
            <div className="flex flex-wrap gap-2">
              {Object.values(categoryMeta).map((item) => (
                <span key={item.label} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-600">
                  <span className="size-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1800px] grid-cols-[260px_minmax(0,1fr)_420px] border-x border-slate-200 bg-white">
        <aside className="border-r border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <BookMarked className="size-5 text-violet-600" />
            课程目录
          </div>
          <div className="mt-4 space-y-2">
            {chapterList.map((chapter) => {
              const active = selectedChapterId === chapter.id;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => setSelectedChapterId(chapter.id)}
                  className={`w-full rounded-md border px-3 py-3 text-left transition ${
                    active
                      ? "border-violet-300 bg-violet-50 text-violet-950"
                      : "border-slate-200 bg-white text-slate-700 hover:border-violet-200"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {chapter.status === "已上线" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <CircleDashed className="size-4 text-slate-400" />}
                    {chapter.status}
                  </span>
                  <span className="mt-2 block text-base font-semibold">{chapter.title}</span>
                  <span className="mt-1 block text-sm text-slate-500">{chapter.englishTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-md border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-600">
            后续章节会继续接入这里，当前第18章已经支持拖拽、缩放、搜索、节点详情和小地图。
          </div>
        </aside>

        <section className="relative">
          <MindMapCanvas
            selectedNodeId={selectedNodeId}
            matchedNodeIds={matchedNodeIds}
            onSelectNode={setSelectedNodeId}
          />
          <div className="absolute bottom-5 left-1/2 z-20 w-[min(920px,calc(100%-2rem))] -translate-x-1/2 rounded-md border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-semibold text-slate-500">{bottomSummary.title}</p>
            <p className="mt-1 text-lg leading-8 text-slate-800">{bottomSummary.content}</p>
          </div>
        </section>

        <DetailPanel node={selectedNode} relatedNodes={relatedNodes} onSelectNode={setSelectedNodeId} />
      </main>
    </div>
  );
}
