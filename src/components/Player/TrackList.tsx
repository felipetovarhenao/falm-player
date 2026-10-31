import type { PlayerTrack } from "./types";

interface TrackListProps {
  tracks: PlayerTrack[];
  activeIndex: number;
  onSelect: (i: number) => void;
}

export default function TrackList({ tracks, activeIndex, onSelect }: TrackListProps) {
  return (
    <ol className="track-list">
      {tracks.map((t, i) => (
        <li key={t.src}>
          <button className={`track${i === activeIndex ? " is-active" : ""}`} aria-current={i === activeIndex} onClick={() => onSelect(i)}>
            <span className={`track-number c${((i + 1) % 4) + 1}`}>{`${i + 1}`.padStart(2, "0")}</span>
            <span>{t.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
