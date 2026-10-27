import { useMemo, useState } from "react";
import { album, versions, tracks, platforms, type Platform } from "./config/album";
import { getVersionIndex } from "./lib/schedule";
import Player from "./components/Player";
import "./App.css";

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

export default function App() {
  const today = useMemo(() => new Date(), []);
  const version = versions[getVersionIndex(versions.length, album.rotationAnchor, today)];
  const [trackTitle, setTrackTitle] = useState("");

  const playerTracks = tracks.map((t) => ({
    title: t.title,
    src: `${album.audioBaseUrl}/${version.folder}/${t.file}`,
  }));
  return (
    <main className="app">
      <div className="container">
        <div className="artwork">{album.artworkUrl ? <img src={album.artworkUrl} alt={`${album.title} artwork`} /> : <span>Album artwork</span>}</div>

        <header>
          <h1 className="title">{album.title}</h1>
          <p className="artist">{album.artist}</p>
          <p className="description">{album.description}</p>
          {album.repoUrl && (
            <a className="repo-link" href={album.repoUrl} target="_blank" rel="noreferrer">
              View the source repository
            </a>
          )}
        </header>

        <section className="card">
          <h2 className="section-title">{version.title}</h2>
          <p className="version-name">{trackTitle}</p>
          {version.description && <p className="version-description">{version.description}</p>}
          <Player key={version.id} tracks={playerTracks} setTrackTitle={setTrackTitle} />
        </section>

        <section className="card">
          <LinkGroup heading="Buy the mastered album" items={platforms.filter((p) => p.kind === "buy")} />
          <LinkGroup heading="Stream the mastered album" items={platforms.filter((p) => p.kind === "stream")} />
        </section>
      </div>
    </main>
  );
}
