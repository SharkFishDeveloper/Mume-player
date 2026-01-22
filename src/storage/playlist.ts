import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Result } from "../types/saavn";

const PLAYLIST_KEY = "PLAYLIST_SONGS";

export async function getPlaylist(): Promise<Result[]> {
  const raw = await AsyncStorage.getItem(PLAYLIST_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addToPlaylist(song: Result) {
  const list = await getPlaylist();
  const exists = list.some((s) => s.id === song.id);
  if (exists) return;

  await AsyncStorage.setItem(
    PLAYLIST_KEY,
    JSON.stringify([...list, song])
  );
}

export async function removeFromPlaylist(songId: string) {
  const list = await getPlaylist();
  const updated = list.filter((s) => s.id !== songId);
  await AsyncStorage.setItem(
    PLAYLIST_KEY,
    JSON.stringify(updated)
  );
}
