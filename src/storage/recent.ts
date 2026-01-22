import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_ITEMS = 20;

/* ---------- Common Base Type ---------- */
interface BaseItem {
  id: string;
}

/* ---------- Helpers ---------- */
async function getList<T extends BaseItem>(key: string): Promise<T[]> {
  const data = await AsyncStorage.getItem(key);
  return data ? (JSON.parse(data) as T[]) : [];
}

async function saveList<T extends BaseItem>(
  key: string,
  list: T[]
): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

/* ---------- SONGS ---------- */
export async function addRecentSong<T extends BaseItem>(
  song: T
): Promise<T[]> {
  const key = "RECENT_SONGS";
  const list = await getList<T>(key);

  const filtered = list.filter((s) => s.id !== song.id);
  const updated = [song, ...filtered].slice(0, MAX_ITEMS);

  await saveList<T>(key, updated);
  return updated;
}

export async function getRecentSongs<T extends BaseItem>(): Promise<T[]> {
  return await getList<T>("RECENT_SONGS");
}

/* ---------- ARTISTS ---------- */
export async function addRecentArtist<T extends BaseItem>(
  artist: T
): Promise<T[]> {
  const key = "RECENT_ARTISTS";
  const list = await getList<T>(key);

  const filtered = list.filter((a) => a.id !== artist.id);
  const updated = [artist, ...filtered].slice(0, MAX_ITEMS);

  await saveList<T>(key, updated);
  return updated;
}

export async function getRecentArtists<T extends BaseItem>(): Promise<T[]> {
  return await getList<T>("RECENT_ARTISTS");
}
