import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export interface PlayerTrack {
  title: string;
  src: string;
}

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${Math.floor(s % 60)
    .toString()
    .padStart(2, "0")}`;

export default function Player({ tracks, setTrackTitle }: { tracks: PlayerTrack[]; setTrackTitle: React.Dispatch<React.SetStateAction<string>> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const indexRef = useRef(0);
  const shouldPlayRef = useRef(false); // true: start playing as soon as the next track is ready
  const goToRef = useRef<(i: number) => void>(() => {});

  const [index, setIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const goTo = (i: number) => {
    if (i < 0 || i >= tracks.length || i === indexRef.current) return;
    shouldPlayRef.current = true;
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
      waveColor: cssVar("--color-wave"),
      progressColor: cssVar("--color-wave-progress"),
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
    ws.on("timeupdate", (t) => setCurrentTime(t));
    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => {
      setIsPlaying(false);
      goToRef.current(indexRef.current + 1);
    });
    ws.on("error", (err) => {
      shouldPlayRef.current = false;

      if (!disposed && err.name !== "AbortError") setError(err.message);
    });

    wsRef.current = ws;
    return () => {
      disposed = true;
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
              <span className="track-number">{`${i + 1}`.padStart(2, "0")}</span>
              <span>{t.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
