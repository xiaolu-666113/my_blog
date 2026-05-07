import type { AlgorithmId, AlgorithmStep, Pixel, Point, RasterParams } from "@/types/rasterLab";

const DRAW = "#06b6d4";
const CURRENT = "#f97316";
const CANDIDATE = "#f59e0b";
const FILL = "#22c55e";
const EDGE = "#ef4444";
const AUX = "#8b5cf6";

function key(pixel: Point) {
  return `${Math.round(pixel.x)},${Math.round(pixel.y)}`;
}

function uniquePixels(pixels: Pixel[]) {
  const seen = new Set<string>();
  return pixels.filter((pixel) => {
    const id = key(pixel);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function pushPixel(target: Pixel[], pixel: Pixel) {
  if (!target.some((item) => item.x === pixel.x && item.y === pixel.y)) {
    target.push(pixel);
  }
}

function roundPoint(point: Point): Pixel {
  return { x: Math.round(point.x), y: Math.round(point.y), color: DRAW };
}

function linePixelsBresenham(p0: Point, p1: Point, color = EDGE): Pixel[] {
  const pixels: Pixel[] = [];
  let x0 = Math.round(p0.x);
  let y0 = Math.round(p0.y);
  const x1 = Math.round(p1.x);
  const y1 = Math.round(p1.y);
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;

  while (true) {
    pixels.push({ x: x0, y: y0, color });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }

  return uniquePixels(pixels);
}

function eightCirclePoints(center: Point, x: number, y: number, color = DRAW): Pixel[] {
  const cx = Math.round(center.x);
  const cy = Math.round(center.y);
  return uniquePixels([
    { x: cx + x, y: cy + y, color },
    { x: cx + y, y: cy + x, color },
    { x: cx - x, y: cy + y, color },
    { x: cx - y, y: cy + x, color },
    { x: cx - x, y: cy - y, color },
    { x: cx - y, y: cy - x, color },
    { x: cx + x, y: cy - y, color },
    { x: cx + y, y: cy - x, color },
  ]);
}

function polygonBoundaryPixels(polygon: Point[], color = EDGE) {
  return polygon.flatMap((point, index) => linePixelsBresenham(point, polygon[(index + 1) % polygon.length], color));
}

function scanlineIntervals(polygon: Point[]) {
  const minY = Math.ceil(Math.min(...polygon.map((p) => p.y)));
  const maxY = Math.floor(Math.max(...polygon.map((p) => p.y)));
  const rows: Array<{ y: number; intersections: number[]; intervals: Array<[number, number]> }> = [];

  for (let y = minY; y <= maxY; y += 1) {
    const intersections: number[] = [];
    polygon.forEach((a, index) => {
      const b = polygon[(index + 1) % polygon.length];
      if (a.y === b.y) return;
      const ymin = Math.min(a.y, b.y);
      const ymax = Math.max(a.y, b.y);
      if (y < ymin || y >= ymax) return;
      const x = a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y);
      intersections.push(x);
    });
    intersections.sort((a, b) => a - b);
    const intervals: Array<[number, number]> = [];
    for (let i = 0; i + 1 < intersections.length; i += 2) {
      const left = Math.ceil(intersections[i]);
      const right = Math.floor(intersections[i + 1]);
      if (left <= right) intervals.push([left, right]);
    }
    rows.push({ y, intersections, intervals });
  }

  return rows;
}

function fillIntervals(rows: ReturnType<typeof scanlineIntervals>, color = FILL) {
  const pixels: Pixel[] = [];
  rows.forEach((row) => {
    row.intervals.forEach(([left, right]) => {
      for (let x = left; x <= right; x += 1) {
        pixels.push({ x, y: row.y, color });
      }
    });
  });
  return uniquePixels(pixels);
}

function makeRegionBoundary() {
  const polygon = [
    { x: 6, y: 5 },
    { x: 22, y: 5 },
    { x: 22, y: 18 },
    { x: 6, y: 18 },
  ];
  return polygonBoundaryPixels(polygon, EDGE);
}

function isInsideDemoBoundary(point: Point) {
  return point.x > 6 && point.x < 22 && point.y > 5 && point.y < 18;
}

function neighbors(point: Point, connectivity: 4 | 8) {
  const base = [
    { x: point.x + 1, y: point.y },
    { x: point.x - 1, y: point.y },
    { x: point.x, y: point.y + 1 },
    { x: point.x, y: point.y - 1 },
  ];
  if (connectivity === 4) return base;
  return [
    ...base,
    { x: point.x + 1, y: point.y + 1 },
    { x: point.x - 1, y: point.y + 1 },
    { x: point.x + 1, y: point.y - 1 },
    { x: point.x - 1, y: point.y - 1 },
  ];
}

export function generatePointSteps(params: RasterParams): AlgorithmStep[] {
  const pixel = roundPoint(params.point);
  return [
    {
      id: 0,
      title: "定位连续点",
      explanation: `连续点 P(${params.point.x.toFixed(2)}, ${params.point.y.toFixed(2)}) 位于像素网格之间。`,
      pixels: [],
      highlightPixels: [{ ...pixel, color: CURRENT }],
      idealGeometry: { point: params.point },
      tableRow: { x: params.point.x.toFixed(2), y: params.point.y.toFixed(2), roundX: pixel.x, roundY: pixel.y },
    },
    {
      id: 1,
      title: "取最近整数像素",
      explanation: `round(${params.point.x.toFixed(2)})=${pixel.x}，round(${params.point.y.toFixed(2)})=${pixel.y}，最终点亮该像素。`,
      pixels: [pixel],
      highlightPixels: [{ ...pixel, color: CURRENT }],
      idealGeometry: { point: params.point },
      tableRow: { output: `(${pixel.x}, ${pixel.y})`, rule: "round(x), round(y)" },
    },
  ];
}

export function generateDdaSteps(params: RasterParams): AlgorithmStep[] {
  const { p0, p1 } = params;
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xInc = dx / steps;
  const yInc = dy / steps;
  const pixels: Pixel[] = [];
  const result: AlgorithmStep[] = [];
  let x = p0.x;
  let y = p0.y;

  for (let i = 0; i <= steps; i += 1) {
    const pixel = { x: Math.round(x), y: Math.round(y), color: DRAW };
    pushPixel(pixels, pixel);
    result.push({
      id: i,
      title: `第 ${i} 步：取整选像素`,
      explanation: `当前浮点位置 (${x.toFixed(2)}, ${y.toFixed(2)})，点亮 (${pixel.x}, ${pixel.y})。${Math.abs(dx) >= Math.abs(dy) ? "x 方向是最大位移方向。" : "y 方向是最大位移方向。"}`,
      pixels: [...pixels],
      highlightPixels: [{ ...pixel, color: CURRENT }],
      idealGeometry: { line: { from: p0, to: p1 }, point: { x, y } },
      tableRow: { i, xFloat: x.toFixed(2), yFloat: y.toFixed(2), "round(x)": pixel.x, "round(y)": pixel.y, pixel: `(${pixel.x},${pixel.y})` },
    });
    x += xInc;
    y += yInc;
  }

  return result;
}

export function generateMidpointLineSteps(params: RasterParams): AlgorithmStep[] {
  const start = { x: Math.round(Math.min(params.p0.x, params.p1.x)), y: Math.round(params.p0.y) };
  const end = { x: Math.round(Math.max(params.p0.x, params.p1.x)), y: Math.round(params.p1.y) };
  const dx = Math.max(1, Math.abs(end.x - start.x));
  const dy = Math.abs(end.y - start.y);
  let x = start.x;
  let y = start.y;
  let d = dx - 2 * dy;
  const pixels: Pixel[] = [];
  const steps: AlgorithmStep[] = [];

  for (let i = 0; i <= dx; i += 1) {
    const dBefore = d;
    const chooseUp = d < 0;
    const current = { x, y, color: DRAW };
    pushPixel(pixels, current);
    const pd = { x: x + 1, y, color: CANDIDATE };
    const pu = { x: x + 1, y: y + 1, color: CANDIDATE };
    d = chooseUp ? d + 2 * (dx - dy) : d - 2 * dy;
    steps.push({
      id: i,
      title: `第 ${i} 步：判断中点`,
      explanation: dBefore < 0 ? "d<0，中点在直线下方，选择右上方像素 Pu。" : "d≥0，中点在直线上方或线上，选择右方像素 Pd。",
      pixels: [...pixels],
      highlightPixels: [{ ...current, color: CURRENT }],
      candidatePixels: [pd, pu, { x: x + 1, y: y + 0.5, color: AUX }],
      idealGeometry: { line: { from: start, to: end }, labels: [{ point: pd, text: "Pd" }, { point: pu, text: "Pu" }] },
      tableRow: { step: i, x, y, dBefore, selectedCandidate: chooseUp ? "Pu" : "Pd", dAfter: d },
    });
    x += 1;
    if (chooseUp) y += 1;
  }

  return steps;
}

export function generateImprovedLineSteps(params: RasterParams): AlgorithmStep[] {
  const start = { x: Math.round(Math.min(params.p0.x, params.p1.x)), y: Math.round(params.p0.y) };
  const end = { x: Math.round(Math.max(params.p0.x, params.p1.x)), y: Math.round(params.p1.y) };
  const dx = Math.max(1, Math.abs(end.x - start.x));
  const dy = Math.abs(end.y - start.y);
  let x = start.x;
  let y = start.y;
  let e = -dx;
  const pixels: Pixel[] = [];
  const steps: AlgorithmStep[] = [];

  for (let i = 0; i <= dx; i += 1) {
    const eBefore = e;
    pushPixel(pixels, { x, y, color: DRAW });
    x += 1;
    e += 2 * dy;
    const afterAdd = e;
    const yIncreased = e >= 0;
    if (yIncreased) {
      y += 1;
      e -= 2 * dx;
    }
    steps.push({
      id: i,
      title: `第 ${i} 步：更新误差 e`,
      explanation: yIncreased ? "e 加上 2dy 后越过 0，因此 y++，再减去 2dx。" : "e 仍小于 0，本步只沿 x 方向前进。",
      pixels: [...pixels],
      highlightPixels: [{ x: x - 1, y: yIncreased ? y - 1 : y, color: CURRENT }],
      idealGeometry: { line: { from: start, to: end } },
      tableRow: { step: i, x: x - 1, y: yIncreased ? y - 1 : y, eBefore, "e+2dy": afterAdd, "是否y++": yIncreased ? "是" : "否", eAfter: e },
    });
  }

  return steps;
}

export function generateCircleSymmetrySteps(params: RasterParams): AlgorithmStep[] {
  const x = Math.max(1, Math.round(params.radius / 2));
  const y = Math.max(x, Math.round(Math.sqrt(params.radius * params.radius - x * x)));
  const base = { x: Math.round(params.center.x + x), y: Math.round(params.center.y + y), color: CURRENT };
  const all = eightCirclePoints(params.center, x, y, DRAW);
  return all.map((_, index) => ({
    id: index,
    title: `复制第 ${index + 1} 个对称点`,
    explanation: "由第一八分圆上的一个点，通过 x/y 交换和正负号变化复制到其他象限。",
    pixels: all.slice(0, index + 1),
    highlightPixels: [base],
    idealGeometry: { circle: { center: params.center, radius: params.radius } },
    tableRow: { source: `(${x},${y})`, symmetricPixels: all.slice(0, index + 1).map((p) => `(${p.x},${p.y})`).join(" ") },
  }));
}

export function generateCircleEquationSteps(params: RasterParams): AlgorithmStep[] {
  const pixels: Pixel[] = [];
  const steps: AlgorithmStep[] = [];
  const limit = Math.round(params.radius / Math.sqrt(2));
  for (let x = 0; x <= limit; x += 1) {
    const y = Math.round(Math.sqrt(params.radius * params.radius - x * x));
    eightCirclePoints(params.center, x, y, DRAW).forEach((pixel) => pushPixel(pixels, pixel));
    steps.push({
      id: x,
      title: `直角坐标法：x=${x}`,
      explanation: `计算 y=round(sqrt(R²-x²))=${y}，再用八分对称生成圆周像素。`,
      pixels: [...pixels],
      highlightPixels: eightCirclePoints(params.center, x, y, CURRENT),
      idealGeometry: { circle: { center: params.center, radius: params.radius } },
      tableRow: { x, y, formula: `round(sqrt(${params.radius}²-${x}²))`, cost: "sqrt + round" },
    });
  }
  return steps;
}

export function generateMidpointCircleSteps(params: RasterParams): AlgorithmStep[] {
  let x = 0;
  let y = Math.round(params.radius);
  let d = 1 - y;
  const pixels: Pixel[] = [];
  const steps: AlgorithmStep[] = [];
  let id = 0;
  while (x <= y) {
    const dBefore = d;
    const selected = d < 0 ? "Pu=(x+1,y)" : "Pd=(x+1,y-1)";
    const current = eightCirclePoints(params.center, x, y, DRAW);
    current.forEach((pixel) => pushPixel(pixels, pixel));
    const candidates = [
      { x: Math.round(params.center.x + x + 1), y: Math.round(params.center.y + y), color: CANDIDATE },
      { x: Math.round(params.center.x + x + 1), y: Math.round(params.center.y + y - 1), color: CANDIDATE },
    ];
    if (d < 0) {
      d = d + 2 * x + 3;
      x += 1;
    } else {
      d = d + 2 * (x - y) + 5;
      x += 1;
      y -= 1;
    }
    steps.push({
      id,
      title: `第 ${id} 步：选择圆弧点`,
      explanation: dBefore < 0 ? "d<0，中点在圆内，选择 Pu。" : "d≥0，中点在圆外，选择 Pd。",
      pixels: [...pixels],
      highlightPixels: current.map((pixel) => ({ ...pixel, color: CURRENT })),
      candidatePixels: candidates,
      idealGeometry: { circle: { center: params.center, radius: params.radius } },
      tableRow: { step: id, x: x - 1, y: dBefore < 0 ? y : y + 1, dBefore, selectedCandidate: selected, dAfter: d, symmetricPixels: current.map((p) => `(${p.x},${p.y})`).join(" ") },
    });
    id += 1;
  }
  return steps;
}

export function generatePolygonSteps(params: RasterParams): AlgorithmStep[] {
  const edgePixels = polygonBoundaryPixels(params.polygon);
  const rows = scanlineIntervals(params.polygon);
  const filled = fillIntervals(rows);
  return [
    {
      id: 0,
      title: "顶点表示",
      explanation: "多边形先由顶点序列表示，节省存储并方便几何变换。",
      pixels: edgePixels,
      idealGeometry: { polygon: params.polygon, labels: params.polygon.map((point, index) => ({ point, text: `P${index + 1}` })) },
      tableRow: { representation: "顶点序列", vertices: params.polygon.map((p) => `(${p.x},${p.y})`).join(" → ") },
    },
    {
      id: 1,
      title: "点阵表示",
      explanation: "扫描转换后得到内部像素集合，可以直接显示和填色，但几何信息会减少。",
      pixels: [...filled, ...edgePixels],
      idealGeometry: { polygon: params.polygon },
      tableRow: { representation: "内部像素集合", filledPixels: filled.length },
    },
  ];
}

export function generateScanlinePolygonSteps(params: RasterParams): AlgorithmStep[] {
  const edgePixels = polygonBoundaryPixels(params.polygon);
  const rows = scanlineIntervals(params.polygon);
  const filled: Pixel[] = [];
  return rows.map((row, index) => {
    const rowPixels: Pixel[] = [];
    row.intervals.forEach(([left, right]) => {
      for (let x = left; x <= right; x += 1) rowPixels.push({ x, y: row.y, color: FILL });
    });
    rowPixels.forEach((pixel) => pushPixel(filled, pixel));
    return {
      id: index,
      title: `扫描线 y=${row.y}`,
      explanation: "求交、排序、两两配对，然后填充每一对交点之间的区间。",
      pixels: [...filled, ...edgePixels],
      highlightPixels: row.intersections.map((x) => ({ x: Math.round(x), y: row.y, color: CURRENT })),
      idealGeometry: { polygon: params.polygon, scanlineY: row.y },
      tableRow: { y: row.y, intersections: row.intersections.map((x) => x.toFixed(2)).join(", "), sortedIntersections: row.intersections.map((x) => x.toFixed(2)).join(", "), fillIntervals: row.intervals.map(([l, r]) => `[${l},${r}]`).join(" ") },
    };
  });
}

export function generateAetSteps(params: RasterParams): AlgorithmStep[] {
  const edgePixels = polygonBoundaryPixels(params.polygon);
  const rows = scanlineIntervals(params.polygon);
  const filled: Pixel[] = [];
  return rows.map((row, index) => {
    const inserted = row.intersections.length ? "按 ymin 加入新边" : "无新边";
    row.intervals.forEach(([left, right]) => {
      for (let x = left; x <= right; x += 1) pushPixel(filled, { x, y: row.y, color: FILL });
    });
    return {
      id: index,
      title: `AET 处理 y=${row.y}`,
      explanation: "删除到达 yMax 的边，插入 NET[y] 的新边，按当前 x 排序后填充，并用 inverseSlope 更新交点。",
      pixels: [...filled, ...edgePixels],
      highlightPixels: row.intersections.map((x) => ({ x: Math.round(x), y: row.y, color: CURRENT })),
      idealGeometry: { polygon: params.polygon, scanlineY: row.y },
      tableRow: { y: row.y, insertedEdges: inserted, removedEdges: "y==yMax 的边", sortedAET: row.intersections.map((x) => x.toFixed(2)).join(", "), fillIntervals: row.intervals.map(([l, r]) => `[${l},${r}]`).join(" "), update: "x=x+inverseSlope" },
    };
  });
}

export function generateEdgeFlagSteps(params: RasterParams): AlgorithmStep[] {
  const edgePixels = polygonBoundaryPixels(params.polygon);
  const boundary = new Set(edgePixels.map(key));
  const rows = scanlineIntervals(params.polygon);
  const filled: Pixel[] = [];
  const steps: AlgorithmStep[] = [];
  rows.forEach((row) => {
    let inside = false;
    const minX = Math.floor(Math.min(...params.polygon.map((p) => p.x))) - 1;
    const maxX = Math.ceil(Math.max(...params.polygon.map((p) => p.x))) + 1;
    for (let x = minX; x <= maxX; x += 1) {
      const isBoundary = boundary.has(`${x},${row.y}`);
      const before = inside;
      if (isBoundary) inside = !inside;
      if (inside && !isBoundary) pushPixel(filled, { x, y: row.y, color: FILL });
      steps.push({
        id: steps.length,
        title: `边界标志扫描 (${x},${row.y})`,
        explanation: isBoundary ? "遇到边界标记，inside 状态翻转。" : inside ? "inside=true，填充当前像素。" : "inside=false，跳过当前像素。",
        pixels: [...filled, ...edgePixels],
        highlightPixels: [{ x, y: row.y, color: CURRENT }],
        idealGeometry: { polygon: params.polygon, scanlineY: row.y },
        tableRow: { y: row.y, x, isBoundaryMark: isBoundary, insideBefore: before, insideAfter: inside, action: isBoundary ? "toggle" : inside ? "fill" : "skip" },
      });
    }
  });
  return steps.slice(0, 90);
}

export function generateConnectivitySteps(params: RasterParams): AlgorithmStep[] {
  const center = { x: 15, y: 12 };
  const four = neighbors(center, 4).map((p) => ({ ...p, color: DRAW }));
  const eight = neighbors(center, 8).map((p) => ({ ...p, color: DRAW }));
  const chosen = params.connectivity === 4 ? four : eight;
  return [
    {
      id: 0,
      title: `${params.connectivity} 连通邻接`,
      explanation: params.connectivity === 4 ? "4 连通只访问上、下、左、右四个邻接像素。" : "8 连通还会访问四个对角邻接像素。",
      pixels: [{ ...center, color: CURRENT }, ...chosen],
      highlightPixels: [{ ...center, color: CURRENT }],
      tableRow: { mode: `${params.connectivity} 连通`, neighbors: chosen.map((p) => `(${p.x},${p.y})`).join(" ") },
    },
  ];
}

function generateStackFillSteps(connectivity: 4 | 8, flood = false): AlgorithmStep[] {
  const boundary = makeRegionBoundary();
  const boundarySet = new Set(boundary.map(key));
  const stack: Point[] = [{ x: 14, y: 12 }];
  const filled = new Set<string>();
  const steps: AlgorithmStep[] = [];

  while (stack.length && steps.length < 120) {
    const point = stack.pop() as Point;
    const id = key(point);
    const canFill = point.x >= 0 && point.x <= 29 && point.y >= 0 && point.y <= 23 && !filled.has(id) && (flood ? isInsideDemoBoundary(point) : !boundarySet.has(id) && isInsideDemoBoundary(point));
    const pushed: Point[] = [];
    if (canFill) {
      filled.add(id);
      neighbors(point, connectivity).forEach((neighbor) => {
        const nid = key(neighbor);
        if (!filled.has(nid) && !boundarySet.has(nid) && isInsideDemoBoundary(neighbor)) {
          stack.push(neighbor);
          pushed.push(neighbor);
        }
      });
    }
    steps.push({
      id: steps.length,
      title: `出栈像素 (${point.x},${point.y})`,
      explanation: canFill ? `当前像素可填充，压入 ${pushed.length} 个 ${connectivity} 邻接点。` : "当前像素不可填充，跳过。",
      pixels: [...boundary, ...Array.from(filled).map((item) => {
        const [x, y] = item.split(",").map(Number);
        return { x, y, color: FILL };
      })],
      highlightPixels: [{ ...point, color: CURRENT }],
      candidatePixels: pushed.map((p) => ({ ...p, color: CANDIDATE })),
      tableRow: { step: steps.length, poppedPixel: `(${point.x},${point.y})`, filled: canFill ? "是" : "否", pushedNeighbors: pushed.map((p) => `(${p.x},${p.y})`).join(" "), stackSize: stack.length },
    });
  }

  return steps;
}

export function generateScanlineSeedFillSteps(): AlgorithmStep[] {
  const boundary = makeRegionBoundary();
  const filled: Pixel[] = [];
  const stack: Point[] = [{ x: 14, y: 12 }];
  const visited = new Set<string>();
  const steps: AlgorithmStep[] = [];

  while (stack.length && steps.length < 40) {
    const seed = stack.pop() as Point;
    if (visited.has(key(seed)) || !isInsideDemoBoundary(seed)) continue;
    let left = seed.x;
    let right = seed.x;
    while (isInsideDemoBoundary({ x: left - 1, y: seed.y })) left -= 1;
    while (isInsideDemoBoundary({ x: right + 1, y: seed.y })) right += 1;
    for (let x = left; x <= right; x += 1) {
      visited.add(`${x},${seed.y}`);
      pushPixel(filled, { x, y: seed.y, color: FILL });
    }
    const pushed: Point[] = [];
    [seed.y + 1, seed.y - 1].forEach((y) => {
      let inSpan = false;
      for (let x = left; x <= right; x += 1) {
        const candidate = { x, y };
        if (isInsideDemoBoundary(candidate) && !visited.has(key(candidate)) && !inSpan) {
          stack.push(candidate);
          pushed.push(candidate);
          inSpan = true;
        }
        if (!isInsideDemoBoundary(candidate)) inSpan = false;
      }
    });
    steps.push({
      id: steps.length,
      title: `处理水平区段 y=${seed.y}`,
      explanation: `找到连续可填充区段 [${left}, ${right}]，并从上下扫描线压入区段代表种子。`,
      pixels: [...boundary, ...filled],
      highlightPixels: Array.from({ length: right - left + 1 }, (_, i) => ({ x: left + i, y: seed.y, color: CURRENT })),
      candidatePixels: pushed.map((p) => ({ ...p, color: CANDIDATE })),
      tableRow: { step: steps.length, seed: `(${seed.x},${seed.y})`, spanLeft: left, spanRight: right, pushedSeeds: pushed.map((p) => `(${p.x},${p.y})`).join(" "), stackSize: stack.length },
    });
  }
  return steps;
}

export function generateBitmapFontSteps(): AlgorithmStep[] {
  const pattern = [
    "00111100",
    "01100110",
    "11000011",
    "11000011",
    "11111111",
    "11000011",
    "11000011",
    "11000011",
  ];
  const pixels = pattern.flatMap((row, yIndex) =>
    row.split("").flatMap((bit, x) => bit === "1" ? [{ x: x + 11, y: 18 - yIndex, color: DRAW }] : [])
  );
  return pattern.map((row, index) => ({
    id: index,
    title: `点亮第 ${index + 1} 行`,
    explanation: "点阵字符由 0/1 矩阵表示，1 表示点亮像素，0 表示空白。",
    pixels: pixels.filter((pixel) => pixel.y >= 18 - index),
    tableRow: { row: index, binary: row, storage: "8×8×字符数量" },
  }));
}

export function generateVectorFontSteps(): AlgorithmStep[] {
  const strokes = [
    [{ x: 12, y: 6 }, { x: 15, y: 19 }],
    [{ x: 15, y: 19 }, { x: 20, y: 6 }],
    [{ x: 13, y: 12 }, { x: 18, y: 12 }],
  ];
  const pixels = strokes.flatMap(([a, b]) => linePixelsBresenham(a, b, DRAW));
  return strokes.map((stroke, index) => ({
    id: index,
    title: `解释第 ${index + 1} 条矢量笔画`,
    explanation: "矢量字符保存笔画或轮廓，显示时再把路径栅格化成像素。",
    pixels: strokes.slice(0, index + 1).flatMap(([a, b]) => linePixelsBresenham(a, b, DRAW)),
    idealGeometry: { line: { from: stroke[0], to: stroke[1] } },
    tableRow: { stroke: index + 1, path: `(${stroke[0].x},${stroke[0].y})→(${stroke[1].x},${stroke[1].y})`, rasterPixels: pixels.length },
  }));
}

export function generateOpenGlModeSteps(params: RasterParams): AlgorithmStep[] {
  const vertices = params.polygon;
  const steps: AlgorithmStep[] = [];
  const pixels: Pixel[] = [];
  const addLine = (a: Point, b: Point) => linePixelsBresenham(a, b, DRAW).forEach((pixel) => pushPixel(pixels, pixel));
  const addTriangle = (a: Point, b: Point, c: Point) => {
    addLine(a, b); addLine(b, c); addLine(c, a);
  };

  if (params.openglMode === "GL_POINTS") {
    vertices.forEach((point, index) => {
      pushPixel(pixels, { ...point, color: DRAW });
      steps.push({ id: index, title: `绘制点 P${index + 1}`, explanation: "GL_POINTS 将每个顶点解释为独立点。", pixels: [...pixels], idealGeometry: { labels: [{ point, text: `P${index + 1}` }] }, tableRow: { mode: params.openglMode, consumed: `P${index + 1}` } });
    });
  } else if (params.openglMode.includes("TRIANGLE")) {
    for (let i = 0; i + 2 < vertices.length; i += params.openglMode === "GL_TRIANGLES" ? 3 : 1) {
      const a = params.openglMode === "GL_TRIANGLE_FAN" ? vertices[0] : vertices[i];
      const b = vertices[i + 1];
      const c = vertices[i + 2];
      addTriangle(a, b, c);
      steps.push({ id: steps.length, title: `生成三角形 ${steps.length + 1}`, explanation: `${params.openglMode} 按当前模式消费顶点形成三角形。`, pixels: [...pixels], idealGeometry: { polygon: [a, b, c] }, tableRow: { mode: params.openglMode, primitive: [a, b, c].map((p) => `(${p.x},${p.y})`).join(" ") } });
    }
  } else {
    const pairs: Array<[Point, Point]> = [];
    if (params.openglMode === "GL_LINES") {
      for (let i = 0; i + 1 < vertices.length; i += 2) pairs.push([vertices[i], vertices[i + 1]]);
    } else {
      for (let i = 0; i + 1 < vertices.length; i += 1) pairs.push([vertices[i], vertices[i + 1]]);
      if (params.openglMode === "GL_LINE_LOOP" || params.openglMode === "GL_POLYGON") pairs.push([vertices[vertices.length - 1], vertices[0]]);
    }
    pairs.forEach(([a, b], index) => {
      addLine(a, b);
      steps.push({ id: index, title: `生成线段 ${index + 1}`, explanation: `${params.openglMode} 根据顶点序列连接当前图元。`, pixels: [...pixels], idealGeometry: { line: { from: a, to: b } }, tableRow: { mode: params.openglMode, primitive: `(${a.x},${a.y})→(${b.x},${b.y})` } });
    });
  }

  return steps.length ? steps : [{ id: 0, title: "等待更多顶点", explanation: "当前顶点数量不足以形成该图元。", pixels: [], tableRow: { mode: params.openglMode } }];
}

export function generateSteps(algorithmId: AlgorithmId, params: RasterParams): AlgorithmStep[] {
  switch (algorithmId) {
    case "point":
      return generatePointSteps(params);
    case "line-dda":
      return generateDdaSteps(params);
    case "line-midpoint":
      return generateMidpointLineSteps(params);
    case "line-improved":
      return generateImprovedLineSteps(params);
    case "circle-symmetry":
      return generateCircleSymmetrySteps(params);
    case "circle-equation":
      return generateCircleEquationSteps(params);
    case "circle-midpoint":
      return generateMidpointCircleSteps(params);
    case "polygon-representation":
      return generatePolygonSteps(params);
    case "polygon-scanline":
      return generateScanlinePolygonSteps(params);
    case "active-edge-table":
      return generateAetSteps(params);
    case "edge-flag":
      return generateEdgeFlagSteps(params);
    case "connectivity":
      return generateConnectivitySteps(params);
    case "boundary-fill-4":
      return generateStackFillSteps(4);
    case "boundary-fill-8":
      return generateStackFillSteps(8);
    case "flood-fill-4":
      return generateStackFillSteps(4, true);
    case "flood-fill-8":
      return generateStackFillSteps(8, true);
    case "scanline-seed-fill":
      return generateScanlineSeedFillSteps();
    case "bitmap-font":
      return generateBitmapFontSteps();
    case "vector-font":
      return generateVectorFontSteps();
    case "opengl-modes":
      return generateOpenGlModeSteps(params);
    default:
      return [];
  }
}
