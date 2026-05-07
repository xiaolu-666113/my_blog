"use client";

import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AlgorithmId, RasterParams } from "@/types/rasterLab";

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none focus:border-cyan-500"
      />
    </label>
  );
}

export function ControlPanel({
  algorithmId,
  params,
  onParamsChange,
}: {
  algorithmId: AlgorithmId;
  params: RasterParams;
  onParamsChange: (params: RasterParams) => void;
}) {
  function randomize() {
    const p0 = { x: 2 + Math.floor(Math.random() * 8), y: 3 + Math.floor(Math.random() * 10) };
    const p1 = { x: 16 + Math.floor(Math.random() * 10), y: 8 + Math.floor(Math.random() * 12) };
    onParamsChange({
      ...params,
      p0,
      p1,
      point: { x: 2 + Math.random() * 18, y: 3 + Math.random() * 14 },
      center: { x: 12 + Math.floor(Math.random() * 7), y: 10 + Math.floor(Math.random() * 7) },
      radius: 5 + Math.floor(Math.random() * 6),
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">参数控制</p>
        <Button type="button" variant="outline" size="sm" onClick={randomize}>
          <Shuffle className="size-4" />
          随机示例
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {algorithmId === "point" ? (
          <>
            <NumberInput label="P.x" value={Number(params.point.x.toFixed(2))} onChange={(x) => onParamsChange({ ...params, point: { ...params.point, x } })} />
            <NumberInput label="P.y" value={Number(params.point.y.toFixed(2))} onChange={(y) => onParamsChange({ ...params, point: { ...params.point, y } })} />
          </>
        ) : null}

        {algorithmId.startsWith("line") ? (
          <>
            <NumberInput label="x0" value={params.p0.x} onChange={(x) => onParamsChange({ ...params, p0: { ...params.p0, x } })} />
            <NumberInput label="y0" value={params.p0.y} onChange={(y) => onParamsChange({ ...params, p0: { ...params.p0, y } })} />
            <NumberInput label="x1" value={params.p1.x} onChange={(x) => onParamsChange({ ...params, p1: { ...params.p1, x } })} />
            <NumberInput label="y1" value={params.p1.y} onChange={(y) => onParamsChange({ ...params, p1: { ...params.p1, y } })} />
          </>
        ) : null}

        {algorithmId.startsWith("circle") ? (
          <>
            <NumberInput label="圆心 x" value={params.center.x} onChange={(x) => onParamsChange({ ...params, center: { ...params.center, x } })} />
            <NumberInput label="圆心 y" value={params.center.y} onChange={(y) => onParamsChange({ ...params, center: { ...params.center, y } })} />
            <NumberInput label="半径 R" value={params.radius} onChange={(radius) => onParamsChange({ ...params, radius })} />
            <NumberInput label="θ 步长" value={params.thetaStep} onChange={(thetaStep) => onParamsChange({ ...params, thetaStep })} />
          </>
        ) : null}
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        <label className="flex items-center justify-between gap-3 text-sm text-slate-700">
          显示理想几何线
          <input type="checkbox" checked={params.showIdeal} onChange={(event) => onParamsChange({ ...params, showIdeal: event.target.checked })} className="size-4 accent-cyan-500" />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm text-slate-700">
          显示坐标轴
          <input type="checkbox" checked={params.showAxes} onChange={(event) => onParamsChange({ ...params, showAxes: event.target.checked })} className="size-4 accent-cyan-500" />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm text-slate-700">
          显示步骤表格
          <input type="checkbox" checked={params.showTable} onChange={(event) => onParamsChange({ ...params, showTable: event.target.checked })} className="size-4 accent-cyan-500" />
        </label>
      </div>

      {algorithmId === "opengl-modes" ? (
        <label className="mt-4 block text-sm font-medium text-slate-700">
          OpenGL 模式
          <select
            value={params.openglMode}
            onChange={(event) => onParamsChange({ ...params, openglMode: event.target.value as RasterParams["openglMode"] })}
            className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-slate-900"
          >
            {["GL_POINTS", "GL_LINES", "GL_LINE_STRIP", "GL_LINE_LOOP", "GL_TRIANGLES", "GL_TRIANGLE_STRIP", "GL_TRIANGLE_FAN", "GL_QUADS", "GL_QUADS_STRIP", "GL_POLYGON"].map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
