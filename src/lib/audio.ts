import type { AmbientId } from "./types";

let ctx: AudioContext | null = null;
let unlocked = false;
let musicNode: { stop: () => void } | null = null;
let ambientNode: { stop: () => void } | null = null;

function context() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export async function unlockAudio() {
  const audio = context();
  if (audio.state === "suspended") await audio.resume();
  unlocked = true;
}

export function isAudioUnlocked() {
  return unlocked;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  when = 0,
) {
  if (!unlocked || volume <= 0) return;
  const audio = context();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audio.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(volume, audio.currentTime + when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + when + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(audio.currentTime + when);
  osc.stop(audio.currentTime + when + duration + 0.02);
}

export function playSfx(
  name:
    | "tap"
    | "ui"
    | "match"
    | "mismatch"
    | "combo1"
    | "combo2"
    | "combo3"
    | "win"
    | "lose"
    | "shuffle"
    | "hint",
  volume: number,
) {
  const v = Math.max(0.0001, volume * 0.22);
  if (name === "tap" || name === "ui") tone(680 + Math.random() * 40, 0.06, "triangle", v);
  if (name === "match") {
    tone(523, 0.12, "sine", v);
    tone(784, 0.16, "sine", v * 0.8, 0.05);
  }
  if (name === "mismatch") tone(110, 0.18, "sawtooth", v * 0.7);
  if (name === "combo1") tone(659, 0.14, "sine", v);
  if (name === "combo2") {
    tone(698, 0.1, "sine", v);
    tone(880, 0.14, "sine", v, 0.06);
  }
  if (name === "combo3") {
    tone(784, 0.08, "sine", v);
    tone(988, 0.1, "sine", v, 0.05);
    tone(1174, 0.16, "sine", v, 0.1);
  }
  if (name === "win") {
    tone(523, 0.12, "sine", v);
    tone(659, 0.12, "sine", v, 0.1);
    tone(784, 0.2, "sine", v, 0.2);
  }
  if (name === "lose") tone(196, 0.35, "triangle", v);
  if (name === "shuffle") {
    tone(440, 0.08, "triangle", v);
    tone(349, 0.1, "triangle", v, 0.07);
  }
  if (name === "hint") tone(988, 0.2, "sine", v * 0.7);
}

function noiseBuffer(audio: AudioContext, seconds: number) {
  const buffer = audio.createBuffer(1, audio.sampleRate * seconds, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function startMusic(volume: number) {
  stopMusic();
  if (!unlocked || volume <= 0) return;
  const audio = context();
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0];
  let stopped = false;
  const playLoop = () => {
    if (stopped) return;
    notes.forEach((note, index) => {
      tone(note, 0.55, "sine", volume * 0.08, index * 0.7);
    });
    window.setTimeout(playLoop, 3800);
  };
  playLoop();
  musicNode = {
    stop: () => {
      stopped = true;
    },
  };
  void audio;
}

export function stopMusic() {
  musicNode?.stop();
  musicNode = null;
}

export function startAmbient(kind: AmbientId, volume: number) {
  stopAmbient();
  if (!unlocked || kind === "silence" || volume <= 0) return;
  const audio = context();
  const source = audio.createBufferSource();
  source.buffer = noiseBuffer(audio, 2);
  source.loop = true;
  const filter = audio.createBiquadFilter();
  filter.type = kind === "fire" || kind === "forest" ? "lowpass" : "bandpass";
  filter.frequency.value =
    kind === "rain" ? 1800 : kind === "ocean" ? 400 : kind === "river" ? 900 : 600;
  const gain = audio.createGain();
  gain.gain.value = volume * (kind === "zen" ? 0.03 : 0.045);
  if (kind === "zen") {
    const osc = audio.createOscillator();
    osc.frequency.value = 196;
    osc.type = "sine";
    osc.connect(gain);
    osc.start();
    ambientNode = {
      stop: () => {
        osc.stop();
        gain.disconnect();
      },
    };
    gain.connect(audio.destination);
    return;
  }
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  source.start();
  ambientNode = {
    stop: () => {
      source.stop();
      gain.disconnect();
    },
  };
}

export function stopAmbient() {
  ambientNode?.stop();
  ambientNode = null;
}
