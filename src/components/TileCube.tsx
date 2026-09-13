import type { TileInstance } from "@/lib/types";
import { TileGlyph } from "./TileGlyph";

type Props = {
  tile: TileInstance;
  left: number;
  top: number;
  width: number;
  height: number;
  free: boolean;
  selected: boolean;
  hinted: boolean;
  sparkle: boolean;
  wiggle: boolean;
  theme: string;
  onClick: () => void;
};

export function TileCube({
  tile,
  left,
  top,
  width,
  height,
  free,
  selected,
  hinted,
  sparkle,
  wiggle,
  theme,
  onClick,
}: Props) {
  const face =
    theme === "jade" ? "#e7f4ea" : theme === "night" ? "#1f2430" : "#f6efe2";
  const ink = theme === "night" ? "#f3e6c4" : "#2a241c";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!free}
      className={`tile-cube ${wiggle ? "tile-wiggle" : ""} ${selected ? "tile-selected" : ""} ${hinted ? "tile-hint" : ""}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        zIndex: tile.z * 400 + Math.round(tile.y * 20) + Math.round(tile.x),
        ["--stack" as string]: String(tile.z),
      }}
    >
      <span className="tile-shadow" />
      <span className="tile-base" />
      <span className="tile-bevel" />
      <span className="tile-face" style={{ background: face, color: ink, opacity: free ? 1 : 0.55 }}>
        <span className="tile-bezel" />
        <span className="tile-gloss" />
        <span className="tile-symbol">
          <TileGlyph typeId={tile.typeId} />
        </span>
        <span className={`tile-overlay ${selected ? "is-on" : ""}`} />
      </span>
      {sparkle ? <span className="tile-sparkle" /> : null}
    </button>
  );
}
