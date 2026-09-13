import { TILE_BY_ID } from "@/lib/tiles";

function Dots({ count, color }: { count: number; color: string }) {
  const cells = Array.from({ length: count }, (_, i) => i);
  return (
    <div
      className="grid h-full w-full place-items-center gap-[7%] p-[10%]"
      style={{
        gridTemplateColumns: `repeat(${count <= 3 ? 1 : 3}, 1fr)`,
      }}
    >
      {cells.map((i) => (
        <span
          key={i}
          className="block aspect-square w-[72%] rounded-full"
          style={{ background: color, boxShadow: "inset 0 -2px 0 rgba(0,0,0,.18)" }}
        />
      ))}
    </div>
  );
}

function Bamboo({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex h-full items-center justify-center gap-[6%] px-[12%]">
      {Array.from({ length: Math.min(count, 4) }, (_, i) => (
        <span
          key={i}
          className="h-[78%] w-[14%] rounded-full"
          style={{ background: color, boxShadow: "inset 0 0 0 2px rgba(255,255,255,.25)" }}
        />
      ))}
      {count > 4 ? (
        <span className="absolute text-[0.85em] font-black" style={{ color }}>
          {count}
        </span>
      ) : null}
    </div>
  );
}

export function TileGlyph({ typeId }: { typeId: string }) {
  const face = TILE_BY_ID[typeId];
  if (!face) return null;
  if (face.category === "dots") return <Dots count={Number(face.label)} color={face.accent} />;
  if (face.category === "bamboo") return <Bamboo count={Number(face.label)} color={face.accent} />;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {face.category === "chars" ? (
        <>
          <span className="text-[1.35em] font-black leading-none" style={{ color: face.accent }}>
            {face.label}
          </span>
          <span className="mt-[4%] text-[0.42em] font-bold tracking-wide" style={{ color: face.accent }}>
            WAN
          </span>
        </>
      ) : (
        <span className="text-[1.45em] font-black leading-none" style={{ color: face.accent }}>
          {face.label}
        </span>
      )}
    </div>
  );
}
