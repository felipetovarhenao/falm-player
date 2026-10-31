// usePlayer.ts
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { loadState, saveState } from "./storage";
import { cssVar } from "./utils";
import type { PlayerTrack } from "./types";

const SEEK_MARGIN = 1;
const SAVE_INTERVAL_MS = 5000;

export function usePlayer(tracks: PlayerTrack[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);

  const shouldPlayRef = useRef(false);
  const goToRef = useRef<(i: number) => void>(() => {});

  const [saved] = useState(() => loadState(tracks.length));
  const indexRef = useRef(saved?.index ?? 0);
  const pendingSeekRef = useRef<number | null>(saved?.time ?? null);
  const timeRef = useRef(saved?.time ?? 0);
  const lastSaveRef = useRef(0);

  const [index, setIndex] = useState(saved?.index ?? 0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const goTo = (i: number) => {
    if (i < 0 || i >= tracks.length || i === indexRef.current) return;
    shouldPlayRef.current = true;
    pendingSeekRef.current = null;
    timeRef.current = 0;
    indexRef.current = i;
    setIndex(i);
  };
  goToRef.current = goTo;

  const togglePlay = () => wsRef.current?.playPause();

  // WaveSurfer instance lifecycle (created once)
  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: parseInt(cssVar("--wave-height"), 10),
      waveColor: cssVar("--color-white"),
      progressColor: cssVar("--color-green"),
      cursorColor: cssVar("--color-wave-cursor"),
      barWidth: parseInt(cssVar("--wave-bar-width"), 10),
      barGap: parseInt(cssVar("--wave-bar-gap"), 10),
      barRadius: parseInt(cssVar("--wave-bar-radius"), 10),
    });

    ws.on("loading", (percent) => setLoadPercent(percent));
    ws.on("play", () => setIsPlaying(true));

    ws.on("ready", (d) => {
      setDuration(d);
      setIsReady(true);

      const t = pendingSeekRef.current;
      pendingSeekRef.current = null;
      if (t !== null && t > 0 && t < d - SEEK_MARGIN) {
        ws.setTime(t);
        setCurrentTime(t);
      } else {
        timeRef.current = 0;
      }

      if (shouldPlayRef.current) {
        shouldPlayRef.current = false;
        ws.play();
      }
    });

    ws.on("timeupdate", (t) => {
      setCurrentTime(t);
      if (pendingSeekRef.current !== null) return;
      timeRef.current = t;
      if (Date.now() - lastSaveRef.current > SAVE_INTERVAL_MS) {
        lastSaveRef.current = Date.now();
        saveState(indexRef.current, t);
      }
    });

    ws.on("pause", () => {
      setIsPlaying(false);
      saveState(indexRef.current, timeRef.current);
    });

    ws.on("finish", () => {
      setIsPlaying(false);
      goToRef.current(indexRef.current + 1);
    });

    ws.on("error", (err) => {
      shouldPlayRef.current = false;
      if (!disposed && err.name !== "AbortError") setError(err.message);
    });

    wsRef.current = ws;
    const flush = () => saveState(indexRef.current, timeRef.current);
    window.addEventListener("pagehide", flush);

    return () => {
      disposed = true;
      window.removeEventListener("pagehide", flush);
      ws.destroy();
      wsRef.current = null;
    };
  }, []);

  const src = tracks[index].src;
  useEffect(() => {
    setIsReady(false);
    setLoadPercent(0);
    setCurrentTime(0);
    setError(null);
    saveState(indexRef.current, timeRef.current);
    wsRef.current?.load(src).catch(() => {});
  }, [src, index]);

  return { containerRef, index, isReady, isPlaying, loadPercent, currentTime, duration, error, goTo, togglePlay };
}
