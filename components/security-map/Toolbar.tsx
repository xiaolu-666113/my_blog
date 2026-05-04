"use client";

import { Crosshair, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Toolbar({
  onZoomIn,
  onZoomOut,
  onReset,
  onCenter,
  onFullscreen,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onCenter: () => void;
  onFullscreen: () => void;
}) {
  return (
    <div className="absolute left-5 top-5 z-20 flex rounded-md border border-slate-200 bg-white shadow-lg">
      <Button type="button" variant="ghost" size="icon" className="rounded-none" onClick={onZoomIn} title="放大">
        <Plus className="size-5" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="rounded-none" onClick={onZoomOut} title="缩小">
        <Minus className="size-5" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="rounded-none" onClick={onReset} title="重置视图">
        <RotateCcw className="size-5" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="rounded-none" onClick={onCenter} title="居中当前节点">
        <Crosshair className="size-5" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="rounded-none" onClick={onFullscreen} title="全屏学习">
        <Maximize2 className="size-5" />
      </Button>
    </div>
  );
}
