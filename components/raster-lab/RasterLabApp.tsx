"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ControlPanel } from "@/components/raster-lab/ControlPanel";
import { FormulaPanel } from "@/components/raster-lab/FormulaPanel";
import { PixelCanvas } from "@/components/raster-lab/PixelCanvas";
import { Sidebar } from "@/components/raster-lab/Sidebar";
import { StepPlayer } from "@/components/raster-lab/StepPlayer";
import { StepTable } from "@/components/raster-lab/StepTable";
import { defaultRasterParams, rasterLessons } from "@/data/raster-lab/lessons";
import { generateSteps } from "@/lib/raster-lab/algorithms";
import type { AlgorithmId, RasterParams } from "@/types/rasterLab";

export function RasterLabApp() {
  const [activeId, setActiveId] = useState<AlgorithmId>("line-dda");
  const [params, setParams] = useState<RasterParams>(defaultRasterParams);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(520);

  const lesson = useMemo(
    () => rasterLessons.find((item) => item.id === activeId) ?? rasterLessons[0],
    [activeId]
  );

  const steps = useMemo(() => generateSteps(activeId, params), [activeId, params]);
  const currentStep = steps[Math.min(stepIndex, Math.max(0, steps.length - 1))] ?? {
    id: 0,
    title: "等待算法步骤",
    explanation: "当前算法还没有生成步骤。",
    pixels: [],
  };

  useEffect(() => {
    if (!playing || steps.length <= 1) return;
    const timer = window.setInterval(() => {
      setStepIndex((index) => {
        if (index >= steps.length - 1) {
          setPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, steps.length]);

  function selectAlgorithm(id: AlgorithmId) {
    setActiveId(id);
    setStepIndex(0);
    setPlaying(false);
  }

  function updateParams(nextParams: RasterParams) {
    setParams(nextParams);
    setStepIndex(0);
    setPlaying(false);
  }

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-slate-950 text-slate-950">
      <div className="grid min-h-[calc(100vh-5rem)] grid-cols-[300px_minmax(0,1fr)_420px]">
        <Sidebar activeId={activeId} onSelect={selectAlgorithm} />

        <main className="min-w-0 bg-slate-100">
          <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-violet-600 text-white">Featured Tutorial</Badge>
                  <Badge variant="outline">Canvas 动画实验室</Badge>
                </div>
                <h1 className="mt-2 text-4xl font-semibold tracking-normal text-slate-950">
                  RasterLab 光栅化算法可视化教程
                </h1>
                <p className="mt-1 text-lg text-slate-500">
                  从连续几何到离散像素：亲手观察每一个像素如何被算法选中
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                <p className="text-sm font-semibold text-slate-500">当前模块</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">{lesson.title}</p>
              </div>
            </div>
          </header>

          <section className="grid h-[calc(100vh-14rem)] min-h-[680px] grid-rows-[minmax(0,1fr)_auto] gap-4 p-4">
            <PixelCanvas
              algorithmId={activeId}
              step={currentStep}
              params={params}
              onParamsChange={updateParams}
            />
            {params.showTable ? <StepTable steps={steps} activeIndex={stepIndex} /> : null}
          </section>
        </main>

        <aside className="h-[calc(100vh-5rem)] overflow-auto border-l border-slate-200 bg-slate-50 p-4">
          <div className="space-y-4">
            <StepPlayer
              stepIndex={stepIndex}
              stepCount={steps.length}
              playing={playing}
              speed={speed}
              onPlayingChange={setPlaying}
              onStepChange={setStepIndex}
              onSpeedChange={setSpeed}
            />
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">当前步骤</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{currentStep.title}</h2>
              <p className="mt-2 text-base leading-7 text-slate-700">{currentStep.explanation}</p>
            </div>
            <ControlPanel algorithmId={activeId} params={params} onParamsChange={updateParams} />
            <FormulaPanel lesson={lesson} />
          </div>
        </aside>
      </div>
    </div>
  );
}
