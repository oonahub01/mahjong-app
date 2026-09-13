import { LAYOUTS } from "./layouts";
import type { LevelDef } from "./types";

const PAR_BY_DIFFICULTY = [0, 240, 300, 360, 420, 480];

export const LEVELS: LevelDef[] = Array.from({ length: 50 }, (_, index) => {
  const layout = LAYOUTS[index % LAYOUTS.length];
  let difficulty = (1 + Math.min(4, Math.floor(index / 10))) as 1 | 2 | 3 | 4 | 5;
  if ((index + 1) % 6 === 0) {
    difficulty = Math.max(1, difficulty - 2) as 1 | 2 | 3 | 4 | 5;
  }
  return {
    id: index + 1,
    layoutId: layout.id,
    difficulty,
    parSec: PAR_BY_DIFFICULTY[difficulty],
  };
});

export const WORLD_NODES = Array.from({ length: 12 }, (_, world) => ({
  id: world + 1,
  name: [
    "Jade Garden",
    "Lotus Lake",
    "Silk Bridge",
    "Moon Pavilion",
    "Amber Dunes",
    "Cedar Peak",
    "Iron Fortress",
    "Twin Temples",
    "Ivory Palace",
    "Turtle Isle",
    "Cloud Terrace",
    "Emperor Court",
  ][world],
  levels: 80 + world * 20,
  unlocked: world < 2,
}));
