import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import getImage from "../../util/getImage";
import FILTER_OPTIONS from "../../util/ApplyFilters";
import { usePlayerStore } from "../store/usePlayerStore";
import { saveRecentSong } from "../storage/recent";
import CircleLoader from "../components/Loading";
import PlaylistSongActionSheet from "../components/PlaylistSongActionSheet";

/* ---------------- constants ---------------- */

const FAV_KEY = "FAVOURITE_SONGS";

/* ---------------- helpers ---------------- */

async function getFavouritesAgain() {
  const raw = await AsyncStorage.getItem(FAV_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function removeFromFavourites(songId: string) {
  const raw = await AsyncStorage.getItem(FAV_KEY);
  const list = raw ? JSON.parse(raw) : [];

  const updated = list.filter((s: any) => s.id !== songId);
  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(updated));

  return updated;
}

function getPrimaryArtist(song: any): string {
  if (song.primaryArtists && song.primaryArtists.trim()) {
    return song.primaryArtists.split(",")[0].trim();
  }
  return song.artists?.primary?.[0]?.name ?? "Unknown Artist";
}

function applySongFilter(songs: any[], filter: string) {
  const list = [...songs];

  switch (filter) {
    case "Ascending":
      return list.sort((a, b) =>
        (a?.name ?? "").localeCompare(b?.name ?? "")
      );

    case "Descending":
      return list.sort((a, b) =>
        (b?.name ?? "").localeCompare(a?.name ?? "")
      );

    case "Artist":
      return list.sort((a, b) =>
        getPrimaryArtist(a).localeCompare(getPrimaryArtist(b))
      );

    case "Album":
      return list.sort((a, b) =>
        (a.album?.name ?? "").localeCompare(b.album?.name ?? "")
      );

    case "Year":
      return list.sort(
        (a, b) => Number(b.year ?? 0) - Number(a.year ?? 0)
      );

    default:
      return list;
  }
}

/* ---------------- component ---------------- */

const Favourites = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [filter, setFilter] = useState("Ascending");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showSheet, setShowSheet] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);

  // 🔑 THIS triggers refetch
  const [refreshKey, setRefreshKey] = useState(0);

  const { play, togglePlay, currentSong, isPlaying } = usePlayerStore();

  /* ---------------- refetch favourites ---------------- */

  useEffect(() => {
    async function loadFavourites() {
      setLoading(true);
      const favs = await getFavouritesAgain();
      setSongs(favs ?? []);
      setLoading(false);
    }

    loadFavourites();
  }, [refreshKey]); // 🔥 refetch when refreshKey changes

  const filteredSongs = useMemo(
    () => applySongFilter(songs, filter),
    [songs, filter]
  );

  /* ---------------- render item ---------------- */

  const renderItem = ({ item }: { item: any }) => {
    const durationMin = Math.floor(Number(item.duration) / 60);
    const durationSec = Number(item.duration) % 60;
    const artistName = getPrimaryArtist(item);

    return (
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: getImage(item) }}
          className="w-20 h-20 rounded-xl"
        />

        <TouchableOpacity
          className="flex-1 ml-4"
          onPress={() => {
            setSelectedSong(item);
            setShowSheet(true);
          }}
        >
          <Text numberOfLines={1} className="font-semibold">
            {item.name}
          </Text>
          <Text numberOfLines={1} className="text-gray-500 text-xs mt-1">
            {artistName} | {durationMin}:
            {durationSec.toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-orange-500 items-center justify-center mr-3"
          onPress={async () => {
            await saveRecentSong(item);
            if (currentSong?.id === item.id) togglePlay();
            else play(item);
          }}
        >
          <Ionicons
            name={
              currentSong?.id === item.id && isPlaying
                ? "pause"
                : "play"
            }
            size={16}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setSelectedSong(item);
            setShowSheet(true);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#A3A3A3" />
        </TouchableOpacity>
      </View>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <View className="flex-1 bg-white px-4 pt-4 mt-12">
      <View className="flex-row justify-between mb-4">
        <Text className="text-gray-500">{songs.length} songs</Text>
      </View>

      {loading ? (
        <CircleLoader />
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Action Sheet */}
      <PlaylistSongActionSheet
        visible={showSheet}
        song={selectedSong}
        text="favourites"
        onClose={() => setShowSheet(false)}
      />
    </View>
  );
};

export default Favourites;
