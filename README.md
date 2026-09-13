# Jade Solitaire

Playable mahjong solitaire demo for the Flutter/Flame mahjong job. Web build so it can ship on Vercel for a client walkthrough.

## What this demo covers

- Reverse-solved boards so every table is beatable
- Free-tile rules with 2x2 overlap, dimmed blocked tiles
- Adaptive tile size as the board clears
- Hint, solvability-preserving shuffle, 10-move undo
- Home, levels, game HUD, settings sheet, goals, gallery, shop, daily, world map, weekly challenge
- Solid colour backgrounds only, large readable tiles, no floating combo text
- First session ad-free; ads only between levels or as optional rewarded video
- Settings persist, including timer and notification toggles

## Local

```bash
npm install
npm run dev
```

## Deploy

```bash
npx vercel
```
