"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StepPlayer({
  stepIndex,
  stepCount,
  playing,
  speed,
  onPlayingChange,
  onStepChange,
  onSpeedChange,
}: {
  stepIndex: number;
  stepCount: number;
  playing: boolean;
  speed: number;
  onPlayingChange: (value: boolean) => void;
  onStepChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">动画播放</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">
            {stepCount ? stepIndex + 1 : 0} / {stepCount}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => onStepChange(Math.max(0, stepIndex - 1))}>
            <SkipBack className="size-4" />
          </Button>
          <Button size="icon" onClick={() => onPlayingChange(!playing)}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button size="icon" variant="outline" onClick={() => onStepChange(Math.min(stepCount - 1, stepIndex + 1))}>
            <SkipForward className="size-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => onStepChange(0)}>
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>
      <label className="mt-4 block text-sm font-medium text-slate-600">
        速度：{speed}ms
        <input
          type="range"
          min={120}
          max={1400}
          step={80}
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="mt-2 w-full accent-cyan-500"
        />
      </label>
    </div>
  );
}
