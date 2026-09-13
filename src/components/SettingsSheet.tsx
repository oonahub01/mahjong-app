"use client";

import { AMBIENTS, THEMES } from "@/lib/themes";
import { LOCALES, t } from "@/lib/i18n";
import type { AmbientId, ThemeId } from "@/lib/types";
import { useGame } from "@/store/GameProvider";

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { persist, updateSettings } = useGame();
  const s = persist.settings;
  const copy = (key: Parameters<typeof t>[1]) => t(s.locale, key);

  if (!open) return null;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2>{copy("settings")}</h2>
        <p className="sheet-label">{copy("theme")}</p>
        <div className="swatch-row">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => (
            <button
              key={id}
              className={`swatch ${s.theme === id ? "is-on" : ""}`}
              style={{ background: THEMES[id].bg }}
              onClick={() => updateSettings({ theme: id })}
              aria-label={THEMES[id].label}
            />
          ))}
        </div>
        <p className="sheet-label">{copy("ambient")}</p>
        <div className="chip-row">
          {AMBIENTS.map((item) => (
            <button
              key={item.id}
              className={`chip ${s.ambient === item.id ? "is-on" : ""}`}
              onClick={() => updateSettings({ ambient: item.id as AmbientId })}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <VolumeRow
          label={copy("music")}
          value={s.musicVol}
          muted={s.musicMute}
          onMute={() => updateSettings({ musicMute: !s.musicMute })}
          onChange={(musicVol) => updateSettings({ musicVol })}
        />
        <VolumeRow
          label={copy("sfx")}
          value={s.sfxVol}
          muted={s.sfxMute}
          onMute={() => updateSettings({ sfxMute: !s.sfxMute })}
          onChange={(sfxVol) => updateSettings({ sfxVol })}
        />
        <label className="toggle-row">
          <span>{copy("timer")}</span>
          <input
            type="checkbox"
            checked={s.showTimer}
            onChange={(e) => updateSettings({ showTimer: e.target.checked })}
          />
        </label>
        <label className="toggle-row">
          <span>{copy("notify")}</span>
          <input
            type="checkbox"
            checked={s.notifications}
            onChange={(e) => updateSettings({ notifications: e.target.checked })}
          />
        </label>
        <label className="toggle-row">
          <span>Language</span>
          <select
            value={s.locale}
            onChange={(e) => updateSettings({ locale: e.target.value })}
          >
            {LOCALES.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.label}
              </option>
            ))}
          </select>
        </label>
        <a className="privacy" href="https://vercel.com/legal/privacy-policy" target="_blank">
          {copy("privacy")}
        </a>
      </div>
    </div>
  );
}

function VolumeRow({
  label,
  value,
  muted,
  onMute,
  onChange,
}: {
  label: string;
  value: number;
  muted: boolean;
  onMute: () => void;
  onChange: (value: number) => void;
}) {
  return (
    <div className="volume-row">
      <span>{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button type="button" className={`mute ${muted ? "is-on" : ""}`} onClick={onMute}>
        {muted ? "Muted" : "On"}
      </button>
    </div>
  );
}
