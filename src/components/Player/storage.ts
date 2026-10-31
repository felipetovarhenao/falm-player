const STORAGE_KEY = "player-state";

export interface PersistedState {
  index: number;
  time: number;
}

export const loadState = (trackCount: number): PersistedState | null => {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (Number.isInteger(s?.index) && s.index >= 0 && s.index < trackCount && Number.isFinite(s.time) && s.time >= 0) return s;
  } catch {}
  return null;
};

export const saveState = (index: number, time: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, time }));
  } catch {}
};
