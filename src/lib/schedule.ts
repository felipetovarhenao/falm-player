const MS_PER_DAY = 86_400_000;

const dayNumber = (y: number, m: number, d: number) => Math.round(Date.UTC(y, m, d) / MS_PER_DAY);

export function getVersionIndex(count: number, anchor: string, date: Date = new Date()): number {
  const [ay, am, ad] = anchor.split("-").map(Number);
  const diff = dayNumber(date.getFullYear(), date.getMonth(), date.getDate()) - dayNumber(ay, am - 1, ad);
  const index = ((diff % count) + count) % count;
  return index;
}
