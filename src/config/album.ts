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
  audioBaseUrl: "https://YOUR-BUCKET.s3.YOUR-REGION.amazonaws.com/album",
  // Day on which versions[0] plays (YYYY-MM-DD, local time). With 7 versions,
  // choosing a Monday makes versions[0] play on Mondays, versions[1] on Tuesdays, etc.
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
  { title: "prelude (in memoriam malugo)", file: "01.mp3" },
  { title: "serenade", file: "02.mp3" },
  { title: "caprice", file: "03.mp3" },
  { title: "toccata", file: "04.mp3" },
  { title: "chaconne", file: "05.mp3" },
  { title: "waltz", file: "06.mp3" },
  { title: "reverie", file: "07.mp3" },
  { title: "nocturne", file: "08.mp3" },
  { title: "rondo", file: "09.mp3" },
  { title: "postlude (to my mother)", file: "10.mp3" },
];

export const versions: AlbumVersion[] = [
  { id: "v1", title: "Version 1", folder: "version-1" },
  { id: "v2", title: "Version 2", folder: "version-2" },
  { id: "v3", title: "Version 3", folder: "version-3" },
  { id: "v4", title: "Version 4", folder: "version-4" },
  { id: "v5", title: "Version 5", folder: "version-5" },
  { id: "v6", title: "Version 6", folder: "version-6" },
  { id: "v7", title: "Version 7", folder: "version-7" },
];
