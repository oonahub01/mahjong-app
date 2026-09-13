import { TILE_FACES } from "./tiles";
import { findMatchPair, isTileFree } from "./free";
import { mulberry32, shuffle } from "./rng";
import type { Slot, TileInstance } from "./types";

function pairTypes(pairCount: number, rng: () => number) {
  const bag = shuffle(
    TILE_FACES.flatMap((face) => [face.id, face.id, face.id, face.id]),
    rng,
  );
  const types: string[] = [];
  let i = 0;
  while (types.length < pairCount) {
    types.push(bag[i % bag.length]);
    i++;
  }
  return types;
}

export function generateSolvableBoard(slots: Slot[], seed: number): TileInstance[] {
  const rng = mulberry32(seed);

  for (let attempt = 0; attempt < 80; attempt++) {
    const types = pairTypes(slots.length / 2, rng);
    const assigned = new Set<number>();
    const assignment: string[] = Array(slots.length).fill("");
    let pairIndex = 0;
    let stuck = false;

    while (assigned.size < slots.length) {
      const tiles: TileInstance[] = slots.map((slot, index) => ({
        id: String(index),
        typeId: "",
        x: slot.x,
        y: slot.y,
        z: slot.z,
        removed: assigned.has(index),
      }));
      const open = tiles.filter((tile) => isTileFree(tile, tiles));
      if (open.length < 2) {
        stuck = true;
        break;
      }
      const first = open[Math.floor(rng() * open.length)];
      const rest = open.filter((tile) => tile.id !== first.id);
      const second = rest[Math.floor(rng() * rest.length)];
      const type = types[pairIndex++];
      assignment[Number(first.id)] = type;
      assignment[Number(second.id)] = type;
      assigned.add(Number(first.id));
      assigned.add(Number(second.id));
    }

    if (!stuck) {
      return slots.map((slot, index) => ({
        id: `t-${index}`,
        typeId: assignment[index],
        x: slot.x,
        y: slot.y,
        z: slot.z,
        removed: false,
      }));
    }
  }

  return fallbackFill(slots, seed);
}

function fallbackFill(slots: Slot[], seed: number): TileInstance[] {
  const rng = mulberry32(seed + 99);
  const types = pairTypes(slots.length / 2, rng);
  const expanded = types.flatMap((type) => [type, type]);
  return slots.map((slot, index) => ({
    id: `t-${index}`,
    typeId: expanded[index],
    x: slot.x,
    y: slot.y,
    z: slot.z,
    removed: false,
  }));
}

export function shuffleRemaining(tiles: TileInstance[], seed: number): TileInstance[] {
  const remaining = tiles.filter((tile) => !tile.removed);
  if (remaining.length < 2) return tiles;
  const slots = remaining.map((tile) => ({ x: tile.x, y: tile.y, z: tile.z }));
  const next = generateSolvableBoard(slots, seed);
  const byId = new Map(tiles.map((tile) => [tile.id, { ...tile }]));
  remaining.forEach((tile, index) => {
    const updated = byId.get(tile.id);
    if (updated) updated.typeId = next[index].typeId;
  });
  return tiles.map((tile) => byId.get(tile.id) ?? tile);
}

export function hasMove(tiles: TileInstance[]) {
  return findMatchPair(tiles) !== null;
}
