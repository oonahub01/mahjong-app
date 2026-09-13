import type { TileInstance } from "./types";

const TILE = 2;

export function overlapsXY(a: TileInstance, b: TileInstance) {
  return Math.abs(a.x - b.x) < TILE && Math.abs(a.y - b.y) < TILE;
}

export function isBlockedAbove(tile: TileInstance, tiles: TileInstance[]) {
  return tiles.some(
    (other) =>
      !other.removed &&
      other.id !== tile.id &&
      other.z === tile.z + 1 &&
      overlapsXY(tile, other),
  );
}

export function isBlockedLeft(tile: TileInstance, tiles: TileInstance[]) {
  return tiles.some(
    (other) =>
      !other.removed &&
      other.id !== tile.id &&
      other.z === tile.z &&
      Math.abs(other.y - tile.y) < TILE &&
      other.x < tile.x &&
      other.x + TILE > tile.x - 0.01,
  );
}

export function isBlockedRight(tile: TileInstance, tiles: TileInstance[]) {
  return tiles.some(
    (other) =>
      !other.removed &&
      other.id !== tile.id &&
      other.z === tile.z &&
      Math.abs(other.y - tile.y) < TILE &&
      other.x > tile.x &&
      tile.x + TILE > other.x - 0.01,
  );
}

export function isTileFree(tile: TileInstance, tiles: TileInstance[]) {
  if (tile.removed) return false;
  if (isBlockedAbove(tile, tiles)) return false;
  return !isBlockedLeft(tile, tiles) || !isBlockedRight(tile, tiles);
}

export function freeTiles(tiles: TileInstance[]) {
  return tiles.filter((tile) => isTileFree(tile, tiles));
}

export function remainingPairs(tiles: TileInstance[]) {
  return tiles.filter((tile) => !tile.removed).length / 2;
}

export function findMatchPair(tiles: TileInstance[]) {
  const open = freeTiles(tiles);
  const byType = new Map<string, TileInstance[]>();
  for (const tile of open) {
    const list = byType.get(tile.typeId) ?? [];
    list.push(tile);
    byType.set(tile.typeId, list);
  }
  for (const list of byType.values()) {
    if (list.length >= 2) return [list[0], list[1]] as const;
  }
  return null;
}
