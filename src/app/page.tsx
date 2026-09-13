"use client";

import { AppShell } from "@/components/AppShell";
import { GameProvider } from "@/store/GameProvider";

export default function Page() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  );
}
