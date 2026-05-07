"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type WheelEvent } from "react";
import { Crosshair, Eye, EyeOff, Minus, Move, Plus, RotateCcw } from "lucide-react";
import type { AlgorithmId, AlgorithmStep, Point, RasterParams } from "@/types/rasterLab";
import { Button } from "@/components/ui/button";

const GRID_WIDTH = 30;
const GRID_HEIGHT = 24;

type DragTarget =
  | { type: "pan"; x: number; y: number }
  | { type: "p0" | "p1" | "point" | "center" | "seed"; x: number; y: number }
  | { type: "polygon"; index: number; x: number; y: number }
  | null;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function PixelCanvas({
  algorithmId,
  step,
  params,
  onParamsChange,
}: {
  algorithmId: AlgorithmId;
  step: AlgorithmStep;
  params: RasterParams;
  onParamsChange: (params: RasterParams) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 960, height: 680 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 88, y: 72 });
  const [hover, setHover] = useState<Point | null>(null);
  const [dragTarget, setDragTarget] = useState<DragTarget>(null);

  const controlPoints = useMemo(() => {
    const points: Array<{ type: DragTarget extends infer T ? T : never; point: Point; label: string }> = [];
    if (algorithmId === "point") points.push({ type: { type: "point", x: 0, y: 0 }, point: params.point, label: "P" });
    if (algorithmId.startsWith("line")) {
      points.push({ type: { type: "p0", x: 0, y: 0 }, point: params.p0, label: "P0" });
      points.push({ type: { type: "p1", x: 0, y: 0 }, point: params.p1, label: "P1" });
    }
    if (algorithmId.startsWith("circle")) points.push({ type: { type: "center", x: 0, y: 0 }, point: params.center, label: "C" });
    if (algorithmId.includes("fill")) points.push({ type: { type: "seed", x: 0, y: 0 }, point: params.seed, label: "Seed" });
    if (algorithmId.includes("polygon") || algorithmId.includes("edge") || algorithmId === "active-edge-table" || algorithmId === "opengl-modes") {
      params.polygon.forEach((point, index) => {
        points.push({ type: { type: "polygon", index, x: 0, y: 0 }, point, label: `P${index + 1}` });
      });
    }
    return points;
  }, [algorithmId, params]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.max(720, Math.floor(entry.contentRect.width)),
        height: Math.max(560, Math.floor(entry.contentRect.height)),
      });
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const cell = 22 * zoom;
  const toScreen = useCallback((point: Point) => ({
    x: offset.x + point.x * cell,
    y: size.height - offset.y - point.y * cell,
  }), [cell, offset.x, offset.y, size.height]);
  const toGrid = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = clientX - (rect?.left ?? 0);
    const y = clientY - (rect?.top ?? 0);
    return {
      x: clamp((x - offset.x) / cell, 0, GRID_WIDTH - 1),
      y: clamp((size.height - offset.y - y) / cell, 0, GRID_HEIGHT - 1),
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, size.width, size.height);
    context.fillStyle = "#f8fafc";
    context.fillRect(0, 0, size.width, size.height);

    context.save();
    for (let x = 0; x <= GRID_WIDTH; x += 1) {
      const sx = offset.x + x * cell;
      context.strokeStyle = x === 0 ? "#334155" : "#dbe3ef";
      context.lineWidth = x === 0 ? 2 : 1;
      context.beginPath();
      context.moveTo(sx, size.height - offset.y);
      context.lineTo(sx, size.height - offset.y - GRID_HEIGHT * cell);
      context.stroke();
    }
    for (let y = 0; y <= GRID_HEIGHT; y += 1) {
      const sy = size.height - offset.y - y * cell;
      context.strokeStyle = y === 0 ? "#334155" : "#dbe3ef";
      context.lineWidth = y === 0 ? 2 : 1;
      context.beginPath();
      context.moveTo(offset.x, sy);
      context.lineTo(offset.x + GRID_WIDTH * cell, sy);
      context.stroke();
    }

    if (params.showAxes) {
      context.fillStyle = "#475569";
      context.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
      for (let x = 0; x < GRID_WIDTH; x += 5) {
        const p = toScreen({ x, y: 0 });
        context.fillText(String(x), p.x - 4, p.y + 20);
      }
      for (let y = 0; y < GRID_HEIGHT; y += 5) {
        const p = toScreen({ x: 0, y });
        context.fillText(String(y), p.x - 28, p.y + 4);
      }
    }

    function drawLine(a: Point, b: Point, color: string, width = 2) {
      const sa = toScreen(a);
      const sb = toScreen(b);
      context.strokeStyle = color;
      context.lineWidth = width;
      context.beginPath();
      context.moveTo(sa.x, sa.y);
      context.lineTo(sb.x, sb.y);
      context.stroke();
    }

    if (params.showIdeal && step.idealGeometry?.line) {
      drawLine(step.idealGeometry.line.from, step.idealGeometry.line.to, "#64748b", 2);
    }
    if (params.showIdeal && step.idealGeometry?.circle) {
      const center = toScreen(step.idealGeometry.circle.center);
      context.strokeStyle = "#64748b";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(center.x, center.y, step.idealGeometry.circle.radius * cell, 0, Math.PI * 2);
      context.stroke();
    }
    if (params.showIdeal && step.idealGeometry?.polygon) {
      const polygon = step.idealGeometry.polygon;
      context.strokeStyle = "#64748b";
      context.lineWidth = 2;
      context.beginPath();
      polygon.forEach((point, index) => {
        const p = toScreen(point);
        if (index === 0) context.moveTo(p.x, p.y);
        else context.lineTo(p.x, p.y);
      });
      context.closePath();
      context.stroke();
    }
    if (step.idealGeometry?.scanlineY !== undefined) {
      drawLine({ x: 0, y: step.idealGeometry.scanlineY }, { x: GRID_WIDTH, y: step.idealGeometry.scanlineY }, "#f97316", 3);
    }
    if (step.idealGeometry?.point) {
      const p = toScreen(step.idealGeometry.point);
      context.strokeStyle = "#ef4444";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(p.x - 8, p.y);
      context.lineTo(p.x + 8, p.y);
      context.moveTo(p.x, p.y - 8);
      context.lineTo(p.x, p.y + 8);
      context.stroke();
    }

    function drawPixel(pixel: Point & { color?: string }, alpha = 1) {
      const p = toScreen(pixel);
      context.globalAlpha = alpha;
      context.fillStyle = pixel.color ?? "#06b6d4";
      context.fillRect(p.x, p.y - cell, cell, cell);
      context.strokeStyle = "rgba(15,23,42,0.45)";
      context.lineWidth = 1;
      context.strokeRect(p.x, p.y - cell, cell, cell);
      context.globalAlpha = 1;
    }

    step.pixels.forEach((pixel) => drawPixel(pixel, 0.88));
    step.candidatePixels?.forEach((pixel) => drawPixel(pixel, 0.55));
    step.highlightPixels?.forEach((pixel) => drawPixel(pixel, 0.96));

    step.idealGeometry?.labels?.forEach((label) => {
      const p = toScreen(label.point);
      context.fillStyle = "#111827";
      context.font = "600 13px system-ui";
      context.fillText(label.text, p.x + 8, p.y - 8);
    });

    controlPoints.forEach(({ point, label }) => {
      const p = toScreen(point);
      context.fillStyle = "#ffffff";
      context.strokeStyle = "#4f46e5";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(p.x, p.y, 7, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = "#312e81";
      context.font = "600 13px system-ui";
      context.fillText(label, p.x + 10, p.y - 10);
    });

    if (hover) {
      const p = toScreen({ x: Math.round(hover.x), y: Math.round(hover.y) });
      context.fillStyle = "rgba(15,23,42,0.88)";
      context.fillRect(p.x + 10, p.y - 34, 88, 26);
      context.fillStyle = "#ffffff";
      context.font = "13px ui-monospace, SFMono-Regular, Menlo";
      context.fillText(`(${Math.round(hover.x)}, ${Math.round(hover.y)})`, p.x + 18, p.y - 16);
    }
    context.restore();
  }, [cell, controlPoints, hover, offset.x, offset.y, params.showAxes, params.showIdeal, size.height, size.width, step, toScreen]);

  function updatePoint(type: Exclude<DragTarget, { type: "pan" }>, point: Point) {
    const rounded = { x: Math.round(point.x), y: Math.round(point.y) };
    if (!type) return;
    if (type.type === "p0") onParamsChange({ ...params, p0: rounded });
    if (type.type === "p1") onParamsChange({ ...params, p1: rounded });
    if (type.type === "point") onParamsChange({ ...params, point });
    if (type.type === "center") onParamsChange({ ...params, center: rounded });
    if (type.type === "seed") onParamsChange({ ...params, seed: rounded });
    if (type.type === "polygon") {
      const polygon = params.polygon.map((item, index) => index === type.index ? rounded : item);
      onParamsChange({ ...params, polygon });
    }
  }

  function handleMouseDown(event: MouseEvent<HTMLCanvasElement>) {
    const gridPoint = toGrid(event.clientX, event.clientY);
    const hit = controlPoints.find(({ point }) => distance(point, gridPoint) < 0.8);
    if (hit) {
      setDragTarget({ ...(hit.type as Exclude<DragTarget, null>), x: event.clientX, y: event.clientY });
      return;
    }
    setDragTarget({ type: "pan", x: event.clientX, y: event.clientY });
  }

  function handleMouseMove(event: MouseEvent<HTMLCanvasElement>) {
    const gridPoint = toGrid(event.clientX, event.clientY);
    setHover(gridPoint);
    if (!dragTarget) return;
    if (dragTarget.type === "pan") {
      const dx = event.clientX - dragTarget.x;
      const dy = event.clientY - dragTarget.y;
      setOffset((current) => ({ x: current.x + dx, y: current.y - dy }));
      setDragTarget({ type: "pan", x: event.clientX, y: event.clientY });
      return;
    }
    updatePoint(dragTarget, gridPoint);
  }

  function handleWheel(event: WheelEvent<HTMLCanvasElement>) {
    event.preventDefault();
    setZoom((current) => clamp(current * (event.deltaY < 0 ? 1.1 : 0.9), 0.48, 2.1));
  }

  return (
    <div ref={wrapperRef} className="relative h-full min-h-[620px] overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/80 p-2 shadow-xl backdrop-blur">
        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setZoom((value) => clamp(value * 1.12, 0.48, 2.1))}>
          <Plus className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setZoom((value) => clamp(value * 0.88, 0.48, 2.1))}>
          <Minus className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10" onClick={() => {
          setZoom(1);
          setOffset({ x: 88, y: 72 });
        }}>
          <RotateCcw className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setOffset({ x: 88, y: 72 })}>
          <Crosshair className="size-4" />
        </Button>
        <span className="flex items-center gap-1 px-2 text-xs text-white/62">
          <Move className="size-3.5" />
          拖动画布
        </span>
      </div>
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/80 p-2 text-xs text-white/70 shadow-xl backdrop-blur">
        {params.showIdeal ? <Eye className="size-4 text-cyan-200" /> : <EyeOff className="size-4" />}
        缩放 {Math.round(zoom * 100)}%
      </div>
      <canvas
        ref={canvasRef}
        className={`h-full w-full ${dragTarget?.type === "pan" ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragTarget(null)}
        onMouseLeave={() => {
          setDragTarget(null);
          setHover(null);
        }}
        onWheel={handleWheel}
      />
    </div>
  );
}
