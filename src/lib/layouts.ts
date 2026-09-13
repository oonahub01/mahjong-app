import type { LayoutDef, Slot } from "./types";

function grid(z: number, x0: number, y0: number, cols: number, rows: number): Slot[] {
  const slots: Slot[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      slots.push({ x: x0 + c * 2, y: y0 + r * 2, z });
    }
  }
  return slots;
}

function centeredGrid(
  z: number,
  cols: number,
  rows: number,
  maxCols: number,
  maxRows: number,
): Slot[] {
  const x0 = maxCols - cols;
  const y0 = maxRows - rows;
  return grid(z, x0, y0, cols, rows);
}

export const LAYOUTS: LayoutDef[] = [
  {
    id: "garden",
    name: "Garden",
    difficulty: 1,
    tileCount: 72,
    slots: grid(0, 0, 0, 12, 6),
  },
  {
    id: "lotus",
    name: "Lotus",
    difficulty: 1,
    tileCount: 80,
    slots: [
      ...grid(0, 0, 0, 10, 6),
      ...centeredGrid(1, 4, 5, 10, 6),
    ],
  },
  {
    id: "bridge",
    name: "Bridge",
    difficulty: 2,
    tileCount: 96,
    slots: [
      ...grid(0, 0, 0, 6, 6),
      ...grid(0, 16, 0, 6, 6),
      ...grid(0, 10, 4, 4, 2),
      ...grid(1, 10, 2, 4, 4),
    ],
  },
  {
    id: "pavilion",
    name: "Pavilion",
    difficulty: 2,
    tileCount: 88,
    slots: [
      ...grid(0, 0, 2, 12, 5),
      ...centeredGrid(1, 6, 4, 12, 6),
      ...centeredGrid(2, 4, 1, 12, 6),
    ],
  },
  {
    id: "spider",
    name: "Spider",
    difficulty: 3,
    tileCount: 108,
    slots: [
      ...grid(0, 4, 2, 8, 6),
      ...grid(0, 0, 0, 2, 8),
      ...grid(0, 20, 0, 2, 8),
      ...centeredGrid(1, 6, 4, 12, 8),
      ...centeredGrid(2, 2, 2, 12, 8),
    ],
  },
  {
    id: "pyramid",
    name: "Pyramid",
    difficulty: 3,
    tileCount: 120,
    slots: [
      ...centeredGrid(0, 8, 8, 8, 8),
      ...centeredGrid(1, 6, 6, 8, 8),
      ...centeredGrid(2, 4, 4, 8, 8),
      ...centeredGrid(3, 2, 2, 8, 8),
    ],
  },
  {
    id: "fortress",
    name: "Fortress",
    difficulty: 4,
    tileCount: 120,
    slots: [
      ...grid(0, 0, 0, 10, 8),
      ...grid(1, 0, 0, 2, 2),
      ...grid(1, 16, 0, 2, 2),
      ...grid(1, 0, 12, 2, 2),
      ...grid(1, 16, 12, 2, 2),
      ...centeredGrid(1, 6, 4, 10, 8),
    ],
  },
  {
    id: "twins",
    name: "Twin Peaks",
    difficulty: 4,
    tileCount: 108,
    slots: [
      ...grid(0, 0, 2, 6, 6),
      ...grid(0, 14, 2, 6, 6),
      ...grid(1, 2, 4, 4, 4),
      ...grid(1, 16, 4, 4, 4),
      ...grid(2, 4, 6, 2, 1),
      ...grid(2, 18, 6, 2, 1),
    ],
  },
  {
    id: "palace",
    name: "Palace",
    difficulty: 5,
    tileCount: 136,
    slots: [
      ...grid(0, 0, 0, 12, 8),
      ...centeredGrid(1, 8, 4, 12, 8),
      ...centeredGrid(2, 4, 2, 12, 8),
    ],
  },
  {
    id: "turtle",
    name: "Turtle",
    difficulty: 5,
    tileCount: 144,
    slots: [
      ...grid(0, 0, 2, 12, 8),
      ...centeredGrid(1, 8, 4, 12, 10),
      ...centeredGrid(2, 6, 2, 12, 10),
      ...grid(3, 10, 8, 2, 2),
    ],
  },
];

export const LAYOUT_BY_ID = Object.fromEntries(LAYOUTS.map((l) => [l.id, l]));

function countSlots() {
  for (const layout of LAYOUTS) {
    if (layout.slots.length !== layout.tileCount) {
      throw new Error(
        `${layout.id} expected ${layout.tileCount} got ${layout.slots.length}`,
      );
    }
    if (layout.slots.length % 2 !== 0) {
      throw new Error(`${layout.id} odd slot count`);
    }
  }
}

countSlots();
