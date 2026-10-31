// Controls.tsx
import { formatTime } from "./utils";

interface ControlsProps {
  canPrev: boolean;
  canNext: boolean;
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
}

export default function Controls({ canPrev, canNext, isReady, isPlaying, currentTime, duration, onPrev, onNext, onTogglePlay }: ControlsProps) {
  return (
    <div className="player-controls">
      <button className="icon-btn" onClick={onPrev} disabled={!canPrev} aria-label="Previous track">
        <svg viewBox="0 0 24 24">
          <path d="M6 5h2v14H6zM20 5v14L9 12z" />
        </svg>
      </button>
      <button className="play-btn" onClick={onTogglePlay} disabled={!isReady} aria-label={isPlaying ? "Pause" : "Play"}>
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
      <button className="icon-btn" onClick={onNext} disabled={!canNext} aria-label="Next track">
        <svg viewBox="0 0 24 24">
          <path d="M16 5h2v14h-2zM4 5l11 7L4 19z" />
        </svg>
      </button>
      <span className="player-time">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
