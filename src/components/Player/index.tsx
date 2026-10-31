import { useEffect } from "react";
import Controls from "./Controls";
import TrackList from "./TrackList";
import { usePlayer } from "./usePlayer";
import type { PlayerTrack } from "./types";

export type { PlayerTrack } from "./types"; // keeps existing imports working

export default function Player({ tracks, setTrackTitle }: { tracks: PlayerTrack[]; setTrackTitle: (title: string) => void }) {
  const { containerRef, index, isReady, isPlaying, loadPercent, currentTime, duration, error, goTo, togglePlay } = usePlayer(tracks);

  useEffect(() => {
    setTrackTitle(tracks[index].title);
  }, [index]);

  return (
    <div className="player">
      <div ref={containerRef} className="player-wave" />
      <div className={`player-status${error ? " is-error" : ""}`} role="status">
        {error ? `The audio could not be loaded: ${error}` : !isReady ? `Loading ${Math.round(loadPercent)}%` : ""}
      </div>

      <Controls
        canPrev={index > 0}
        canNext={index < tracks.length - 1}
        isReady={isReady}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPrev={() => goTo(index - 1)}
        onNext={() => goTo(index + 1)}
        onTogglePlay={togglePlay}
      />

      <TrackList tracks={tracks} activeIndex={index} onSelect={(i) => (i === index ? togglePlay() : goTo(i))} />
    </div>
  );
}
