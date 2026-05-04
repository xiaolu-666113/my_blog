"use client";

import {
  Activity,
  Archive,
  Binary,
  Blocks,
  BookOpenCheck,
  Braces,
  Bug,
  Code2,
  Cpu,
  FileCode2,
  Fingerprint,
  FunctionSquare,
  Hammer,
  KeyRound,
  Layers3,
  LayoutTemplate,
  LockKeyhole,
  Microchip,
  Network,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  TerminalSquare,
  TrendingUp,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { categoryMeta, type MindMapNodeData } from "@/data/security-course/mindmapData";
import { cn } from "@/lib/utils/cn";

const iconMap: Record<string, LucideIcon> = {
  Activity,
  Archive,
  Binary,
  Blocks,
  BookOpenCheck,
  Braces,
  Bug,
  Code2,
  Cpu,
  FileCode2,
  Fingerprint,
  FunctionSquare,
  Hammer,
  KeyRound,
  Layers3,
  LayoutTemplate,
  LockKeyhole,
  Microchip,
  Network,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  TerminalSquare,
  TrendingUp,
  Waypoints,
};

export type SecurityFlowNodeData = {
  node: MindMapNodeData;
  selected: boolean;
  matched: boolean;
};

export function MindMapNode({ data }: NodeProps) {
  const { node, selected, matched } = data as SecurityFlowNodeData;
  const meta = categoryMeta[node.category];
  const Icon = node.icon ? iconMap[node.icon] : null;

  return (
    <button
      type="button"
      title={`${node.title}${node.englishTitle ? ` / ${node.englishTitle}` : ""}`}
      className={cn(
        "group relative block cursor-pointer rounded-lg border bg-white text-left shadow-sm transition-all duration-200",
        node.level === 0 && "w-[430px] border-slate-900 px-7 py-6 shadow-[0_18px_55px_rgba(15,23,42,0.18)]",
        node.level === 1 && "w-[310px] px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)]",
        node.level >= 2 && "w-[360px] px-4 py-3",
        selected && "scale-[1.03] ring-4 ring-slate-900/15",
        matched && "ring-4 ring-amber-300/70",
        !selected && "hover:-translate-y-0.5 hover:shadow-md"
      )}
      style={{
        borderColor: selected || matched ? node.color : "rgba(148, 163, 184, 0.42)",
        background: node.level === 0 ? "linear-gradient(135deg, #ffffff, #eef2ff)" : "#ffffff",
      }}
    >
      <Handle type="target" position={node.side === "left" ? Position.Right : Position.Left} className="opacity-0" />
      <Handle type="source" position={node.side === "left" ? Position.Left : Position.Right} className="opacity-0" />

      <div className="flex items-start gap-3">
        {Icon ? (
          <span
            className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: meta.soft, color: node.color }}
          >
            <Icon className="size-5" />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-semibold leading-tight text-slate-950",
              node.level === 0 && "text-[34px]",
              node.level === 1 && "text-[24px]",
              node.level >= 2 && "text-[19px]"
            )}
          >
            {node.title}
          </p>
          {node.englishTitle ? (
            <p className={cn("mt-1 font-medium text-slate-500", node.level === 0 ? "text-xl" : "text-sm")}>
              {node.englishTitle}
            </p>
          ) : null}
          {node.summary ? (
            <p className={cn("mt-2 leading-6 text-slate-600", node.level === 0 ? "text-base" : "text-sm")}>
              {node.summary}
            </p>
          ) : null}
          {node.importantSentence ? (
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
              <p>{node.importantSentence.zh}</p>
              <p className="text-slate-500">{node.importantSentence.en}</p>
            </div>
          ) : null}
          {node.level >= 2 && node.bullets?.length ? (
            <p className="mt-2 text-xs font-medium text-slate-400">
              {node.bullets.length} 条复习要点
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}
