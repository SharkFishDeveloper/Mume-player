import AsyncStorage from "@react-native-async-storage/async-storage";

const FAV_KEY = "FAVOURITE_SONG_IDS";

/** Get all favourite song IDs */
export const getFavourites = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(FAV_KEY);
  return raw ? JSON.parse(raw) : [];
};

/** Check if a song is favourite */
export const isFavourite = async (songId: string): Promise<boolean> => {
  const favs = await getFavourites();
  return favs.includes(songId);
};

/** Toggle favourite */
export const toggleFavourite = async (songId: string): Promise<boolean> => {
  const favs = await getFavourites();

  let updated: string[];
  let isFav: boolean;

  if (favs.includes(songId)) {
    updated = favs.filter((id) => id !== songId);
    isFav = false;
  } else {
    updated = [...favs, songId];
    isFav = true;
  }

  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(updated));
  return isFav;
};


