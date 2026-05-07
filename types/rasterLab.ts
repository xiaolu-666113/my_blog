export type Pixel = {
  x: number;
  y: number;
  color?: string;
};

export type Point = {
  x: number;
  y: number;
};

export type AlgorithmStep = {
  id: number;
  title: string;
  explanation: string;
  pixels: Pixel[];
  highlightPixels?: Pixel[];
  candidatePixels?: Pixel[];
  idealGeometry?: {
    line?: { from: Point; to: Point };
    circle?: { center: Point; radius: number };
    polygon?: Point[];
    scanlineY?: number;
    point?: Point;
    points?: Point[];
    labels?: Array<{ point: Point; text: string }>;
  };
  tableRow?: Record<string, string | number | boolean>;
  debug?: Record<string, unknown>;
};

export type RasterCategory =
  | "基础扫描转换"
  | "直线扫描转换"
  | "圆扫描转换"
  | "多边形扫描转换"
  | "区域填充"
  | "字符与图元";

export type AlgorithmId =
  | "point"
  | "line-dda"
  | "line-midpoint"
  | "line-improved"
  | "circle-symmetry"
  | "circle-equation"
  | "circle-midpoint"
  | "polygon-representation"
  | "polygon-scanline"
  | "active-edge-table"
  | "edge-flag"
  | "connectivity"
  | "boundary-fill-4"
  | "boundary-fill-8"
  | "flood-fill-4"
  | "flood-fill-8"
  | "scanline-seed-fill"
  | "bitmap-font"
  | "vector-font"
  | "opengl-modes";

export type Lesson = {
  id: AlgorithmId;
  category: RasterCategory;
  title: string;
  subtitle: string;
  intro: string;
  coreIdeas: string[];
  formula: string[];
  features: string[];
};

export type RasterParams = {
  p0: Point;
  p1: Point;
  point: Point;
  center: Point;
  radius: number;
  thetaStep: number;
  polygon: Point[];
  seed: Point;
  connectivity: 4 | 8;
  showIdeal: boolean;
  showAxes: boolean;
  showTable: boolean;
  openglMode:
    | "GL_POINTS"
    | "GL_LINES"
    | "GL_LINE_STRIP"
    | "GL_LINE_LOOP"
    | "GL_TRIANGLES"
    | "GL_TRIANGLE_STRIP"
    | "GL_TRIANGLE_FAN"
    | "GL_QUADS"
    | "GL_QUADS_STRIP"
    | "GL_POLYGON";
};
