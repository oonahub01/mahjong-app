"use client";

import { useMemo } from "react";
import type { TileInstance } from "@/lib/types";
import { isTileFree } from "@/lib/free";
import { TileCube } from "./TileCube";

type Props = {
  tiles: TileInstance[];
  selectedId: string | null;
  hintIds: string[];
  sparkleIds: string[];
  wiggleId: string | null;
  shake: boolean;
  tileTheme: string;
  onSelect: (id: string) => void;
};

export function MahjongBoard({
  tiles,
  selectedId,
  hintIds,
  sparkleIds,
  wiggleId,
  shake,
  tileTheme,
  onSelect,
}: Props) {
  const live = tiles.filter((tile) => !tile.removed);
  const bounds = useMemo(() => {
    if (!live.length) return { minX: 0, minY: 0, maxX: 2, maxY: 2, maxZ: 0 };
    return live.reduce(
      (acc, tile) => ({
        minX: Math.min(acc.minX, tile.x),
        minY: Math.min(acc.minY, tile.y),
        maxX: Math.max(acc.maxX, tile.x + 2),
        maxY: Math.max(acc.maxY, tile.y + 2),
        maxZ: Math.max(acc.maxZ, tile.z),
      }),
      { minX: 99, minY: 99, maxX: -99, maxY: -99, maxZ: 0 },
    );
  }, [live]);

  const spanX = Math.max(2, bounds.maxX - bounds.minX);
  const spanY = Math.max(2, bounds.maxY - bounds.minY);

  return (
    <div className={`board-frame ${shake ? "board-shake" : ""}`}>
      <div
        className="board-stage"
        style={{
          aspectRatio: `${spanX} / ${spanY + bounds.maxZ * 0.35}`,
        }}
      >
        {live.map((tile) => {
          const widthPct = (2 / spanX) * 100;
          const heightPct = (2 / (spanY + bounds.maxZ * 0.18)) * 100;
          const leftPct = ((tile.x - bounds.minX) / spanX) * 100;
          const topPct = ((tile.y - bounds.minY) / (spanY + bounds.maxZ * 0.18)) * 100;
          return (
            <TileCube
              key={tile.id}
              tile={tile}
              left={leftPct}
              top={topPct}
              width={widthPct}
              height={heightPct}
              free={isTileFree(tile, tiles)}
              selected={selectedId === tile.id}
              hinted={hintIds.includes(tile.id)}
              sparkle={sparkleIds.includes(tile.id)}
              wiggle={wiggleId === tile.id}
              theme={tileTheme}
              onClick={() => onSelect(tile.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
