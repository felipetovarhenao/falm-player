import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export interface PlayerTrack {
  title: string;
  src: string;
}

const STORAGE_KEY = "player-state";
const SEEK_MARGIN = 1;

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${Math.floor(s % 60)
    .toString()
    .padStart(2, "0")}`;

const loadState = (trackCount: number): { index: number; time: number } | null => {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (Number.isInteger(s?.index) && s.index >= 0 && s.index < trackCount && Number.isFinite(s.time) && s.time >= 0) return s;
  } catch {}
  return null;
};

const saveState = (index: number, time: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, time }));
  } catch {}
};

export default function Player({ tracks, setTrackTitle }: { tracks: PlayerTrack[]; setTrackTitle: React.Dispatch<React.SetStateAction<string>> }) {
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
    ws.on("ready", (d) => {
      setDuration(d);
      setIsReady(true);
      if (shouldPlayRef.current) {
        shouldPlayRef.current = false;
        ws.play();
      }
    });
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
      if (Date.now() - lastSaveRef.current > 5000) {
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
    setTrackTitle(`${tracks[index].title}`);
  }, [src, index]);

  return (
    <div className="player">
      <div ref={containerRef} className="player-wave" />
      <div className={`player-status${error ? " is-error" : ""}`} role="status">
        {error ? `The audio could not be loaded: ${error}` : !isReady ? `Loading ${Math.round(loadPercent)}%` : ""}
      </div>

      <div className="player-controls">
        <button className="icon-btn" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous track">
          <svg viewBox="0 0 24 24">
            <path d="M6 5h2v14H6zM20 5v14L9 12z" />
          </svg>
        </button>
        <button className="play-btn" onClick={() => wsRef.current?.playPause()} disabled={!isReady} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M7 4l13 8-13 8z" />
            </svg>
          )}
        </button>
        <button className="icon-btn" onClick={() => goTo(index + 1)} disabled={index === tracks.length - 1} aria-label="Next track">
          <svg viewBox="0 0 24 24">
            <path d="M16 5h2v14h-2zM4 5l11 7L4 19z" />
          </svg>
        </button>
        <span className="player-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <ol className="track-list">
        {tracks.map((t, i) => (
          <li key={t.src}>
            <button
              className={`track${i === index ? " is-active" : ""}`}
              aria-current={i === index}
              onClick={() => (i === index ? wsRef.current?.playPause() : goTo(i))}
            >
              <span className={`track-number c${((i + 1) % 4) + 1}`}>{`${i + 1}`.padStart(2, "0")}</span>
              <span>{t.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
