// All content that is likely to change lives here.

export type PlatformKind = "buy" | "stream";

export interface Platform {
  label: string;
  url: string;
  kind: PlatformKind;
}

export const album = {
  title: "Fully Automated Luxury Music",
  artist: "Felipe Tovar-Henao",
  description:
    "Fully Automated Luxury Music is an open-source, generative music album. Its ten tracks are entirely written as, and generated through, stochastic algorithms, capable of producing virtually infinite variations of the work. This album engages with questions around computational representations and formalizations of human expression and artistic intent. Alongside the audio, the album's generative code is available as open-source software, inviting others to examine, adapt, and generate their own versions of the music. Fully Automated Luxury Music is available digitally and as a limited-edition CD through Deadland Records.",
  artworkUrl: "https://d2cq0goacowtde.cloudfront.net/falm/artwork.jpg",
  repoUrl: "https://github.com/felipetovarhenao/falm",
  audioBaseUrl: "https://d2cq0goacowtde.cloudfront.net/falm/audio",
  rotationAnchor: "2026-01-05",
};

// Add or remove entries freely. `kind` decides the group the link appears in.
export const platforms: Platform[] = [
  { label: "Bandcamp", url: "https://deadlandrecords.bandcamp.com/album/fully-automated-luxury-music", kind: "buy" },
  { label: "Apple Music", url: "#", kind: "stream" },
  { label: "Spotify", url: "#", kind: "stream" },
];

export interface AlbumVersion {
  id: string;
  title: string;
  description?: string;
  folder: string;
}

export interface Track {
  title: string;
  file: string;
}

export const tracks: Track[] = [
  { title: "prelude (in memoriam malugo)", file: "1.mp3" },
  { title: "serenade", file: "2.mp3" },
  { title: "caprice", file: "3.mp3" },
  { title: "toccata", file: "4.mp3" },
  { title: "chaconne", file: "5.mp3" },
  { title: "waltz", file: "6.mp3" },
  { title: "reverie", file: "7.mp3" },
  { title: "nocturne", file: "8.mp3" },
  { title: "rondo", file: "9.mp3" },
  { title: "postlude (to my mother)", file: "10.mp3" },
];

export const versions: AlbumVersion[] = [
  { id: "v1", title: "Seed 3501", folder: "v3501" },
  { id: "v2", title: "Seed 4284", folder: "v4284" },
  { id: "v3", title: "Seed 4292", folder: "v4292" },
  { id: "v4", title: "Seed 6043", folder: "v6043" },
  { id: "v5", title: "Seed 9521", folder: "v9521" },
  { id: "v6", title: "Seed 13035", folder: "v13035" },
  { id: "v7", title: "Seed 21089", folder: "v21089" },
  { id: "v8", title: "Seed 6135", folder: "v6135" },
  { id: "v9", title: "Seed 16685", folder: "v16685" },
  { id: "v10", title: "Seed 22879", folder: "v22879" },
  { id: "v11", title: "Seed 24655", folder: "v24655" },
];
