export type TileCategory =
  | "dots"
  | "bamboo"
  | "chars"
  | "winds"
  | "dragons"
  | "flowers"
  | "seasons";

export type TileFace = {
  id: string;
  category: TileCategory;
  label: string;
  accent: string;
};

export const TILE_FACES: TileFace[] = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
    id: `dot-${n}`,
    category: "dots" as const,
    label: String(n),
    accent: "#c0392b",
  })),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
    id: `bam-${n}`,
    category: "bamboo" as const,
    label: String(n),
    accent: "#1e7a3a",
  })),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
    id: `chr-${n}`,
    category: "chars" as const,
    label: String(n),
    accent: "#1a3d7c",
  })),
  { id: "wind-e", category: "winds", label: "E", accent: "#2c3e50" },
  { id: "wind-s", category: "winds", label: "S", accent: "#2c3e50" },
  { id: "wind-w", category: "winds", label: "W", accent: "#2c3e50" },
  { id: "wind-n", category: "winds", label: "N", accent: "#2c3e50" },
  { id: "drag-r", category: "dragons", label: "中", accent: "#c0392b" },
  { id: "drag-g", category: "dragons", label: "發", accent: "#1e7a3a" },
  { id: "drag-w", category: "dragons", label: "白", accent: "#4a5568" },
  { id: "fl-plum", category: "flowers", label: "梅", accent: "#b84d7a" },
  { id: "fl-orch", category: "flowers", label: "兰", accent: "#6b4c9a" },
  { id: "fl-bam", category: "flowers", label: "竹", accent: "#1e7a3a" },
  { id: "fl-mum", category: "flowers", label: "菊", accent: "#c47b14" },
  { id: "sea-spr", category: "seasons", label: "春", accent: "#2d8a4e" },
  { id: "sea-sum", category: "seasons", label: "夏", accent: "#c0392b" },
  { id: "sea-aut", category: "seasons", label: "秋", accent: "#c47b14" },
  { id: "sea-win", category: "seasons", label: "冬", accent: "#2b6cb0" },
];

export const TILE_BY_ID = Object.fromEntries(TILE_FACES.map((t) => [t.id, t]));
