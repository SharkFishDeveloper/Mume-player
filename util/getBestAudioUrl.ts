import Result from "../src/types/saavn";

export function getBestAudioUrl(song: Result): string | null {
  if (!song.downloadUrl || song.downloadUrl.length === 0) return null;

  // Prefer highest quality
  const sorted = [...song.downloadUrl].sort(
    (a, b) => parseInt(b.quality) - parseInt(a.quality)
  );

  return sorted[0].url;
}
