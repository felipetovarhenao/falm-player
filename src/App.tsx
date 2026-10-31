import { useEffect, useState } from "react";
import { album, seeds, tracks, platforms, type Platform } from "./config/album";
import Player from "./components/Player";
import "./App.css";
import { ReloadIcon } from "./components/ReloadIcon";

function LinkGroup({ heading, items }: { heading: string; items: Platform[] }) {
  if (items.length === 0) return null;
  return (
    <div className="link-group">
      <h3 className="section-title">{heading}</h3>
      <ul className="link-list">
        {items.map((p) => (
          <li key={p.label}>
            <a className="chip" href={p.url} target="_blank" rel="noreferrer">
              {p.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function newSeed() {
  return seeds[Math.round(Math.random() * (seeds.length - 1))];
}

export default function App() {
  const [trackTitle, setTrackTitle] = useState("");
  const [seed, setSeed] = useState<Number | null>(null);

  useEffect(() => {
    setSeed(newSeed());
  }, []);

  const playerTracks = tracks.map((t) => ({
    title: t.title,
    src: `${album.audioBaseUrl}/v${seed}/${t.file}`,
  }));
  return (
    <main className="app">
      <div className="container">
        <div className="artwork">
          {album.artworkUrl ? (
            <a target="_blank" referrerPolicy="no-referrer" href="https://deadlandrecords.bandcamp.com/album/fully-automated-luxury-music">
              <img src={album.artworkUrl} alt={`${album.title} artwork`} />
            </a>
          ) : (
            <span>Album artwork</span>
          )}
        </div>

        <header>
          <h1 className="title">{album.title}</h1>
          <p className="artist">{album.artist}</p>
          <p className="description">{album.description}</p>
          <p className="description">To listen to a different variant of the album, refresh this website.</p>
          {album.repoUrl && (
            <a className="repo-link" href={album.repoUrl} target="_blank" rel="noreferrer">
              Github repository
            </a>
          )}
        </header>

        {seed && (
          <section className="card player-card">
            <div className="seed-header">
              <h2 className="section-title">
                Generative seed: <b>{`${seed}`}</b>
              </h2>
              <ReloadIcon className="reload-btn" onClick={() => setSeed(newSeed())} />
            </div>
            <p className="version-name">{trackTitle}</p>
            <Player key={`${seed}`} tracks={playerTracks} setTrackTitle={setTrackTitle} />
          </section>
        )}

        <section className="card">
          <LinkGroup heading="Purchase the album" items={platforms.filter((p) => p.kind === "buy")} />
          <LinkGroup heading="Listen to the album" items={platforms.filter((p) => p.kind === "stream")} />
        </section>
      </div>
    </main>
  );
}
