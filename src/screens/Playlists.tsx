import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import getImage from "../../util/getImage";
import { getPlaylist } from "../storage/playlist";
import { usePlayerStore } from "../store/usePlayerStore";
import { useQueueStore } from "../store/useQueueStore";
import { useIsFocused } from "@react-navigation/native";
import PlaylistSongActionSheet from "../components/PlaylistSongActionSheet";
import CircleLoader from "../components/Loading";

const Playlists = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);

  const isFocused = useIsFocused();

  const { play, togglePlay, currentSong, isPlaying } =
    usePlayerStore();
  const { setQueue } = useQueueStore();

  /* ---------- Load playlist ---------- */
  useEffect(() => {
    if (!isFocused) return;

    async function load() {
      setLoading(true);
      const list = await getPlaylist();
      setSongs(list);
      setLoading(false);
    }

    load();
  }, [isFocused]);

  /* ---------- Derived data ---------- */
  const totalDuration = useMemo(() => {
    const totalSec = songs.reduce(
      (sum, s) => sum + Number(s.duration || 0),
      0
    );
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")} mins`;
  }, [songs]);

  const coverImage = songs[0] ? getImage(songs[0]) : null;

  /* ---------- Song row (UNCHANGED) ---------- */
  const renderItem = ({ item }: { item: any }) => {
    const durationMin = Math.floor(Number(item.duration) / 60);
    const durationSec = Number(item.duration) % 60;

    const artistName =
      item.primaryArtists && item.primaryArtists.trim()
        ? item.primaryArtists.split(",")[0].trim()
        : item.artists?.primary?.[0]?.name ?? "Unknown Artist";

    return (
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: getImage(item) }}
          className="w-16 h-16 rounded-xl"
        />

        <TouchableOpacity
          className="flex-1 ml-4"
          onPress={() => {
            setSelectedSong(item);
            setShowSheet(true);
          }}
        >
          <Text
            numberOfLines={1}
            className="text-black dark:text-white font-semibold"
          >
            {item.name}
          </Text>

          <Text className="text-gray-500 text-xs mt-1">
            {artistName}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-orange-500 items-center justify-center mr-3"
          onPress={() => {
            setQueue(songs, songs.findIndex(s => s.id === item.id));
            if (currentSong?.id === item.id) {
              togglePlay();
            } else {
              play(item);
            }
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
          <Ionicons
            name="ellipsis-vertical"
            size={18}
            color="#A3A3A3"
          />
        </TouchableOpacity>
      </View>
    );
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <CircleLoader />
      </View>
    );
  }

  /* ---------- UI ---------- */
  return (
    <View className="flex-1 bg-white dark:bg-black pt-10">
      {/* Album Header */}
      <View className="items-center px-6">
        {coverImage && (
          <Image
            source={{ uri: coverImage }}
            className="w-56 h-56 rounded-3xl mb-5"
          />
        )}

        <Text className="text-2xl font-bold text-black dark:text-white">
          Playlist
        </Text>

        <Text className="text-gray-500 text-sm mt-1">
          {songs.length} Songs • {totalDuration}
        </Text>

        {/* Actions */}
        <View className="flex-row gap-4 mt-6">
          <TouchableOpacity
            className="flex-row items-center px-6 py-3 rounded-full bg-orange-500"
            onPress={() => {
              if (!songs.length) return;
              const shuffled = [...songs].sort(() => 0.5 - Math.random());
              setQueue(shuffled, 0);
              play(shuffled[0]);
            }}
          >
            <Ionicons name="shuffle" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">
              Shuffle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center px-6 py-3 rounded-full bg-orange-100"
            onPress={() => {
              if (!songs.length) return;
              setQueue(songs, 0);
              play(songs[0]);
            }}
          >
            <Ionicons name="play" size={18} color="#F97316" />
            <Text className="text-orange-500 font-semibold ml-2">
              Play
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Songs */}
      <View className="mt-8 px-4 flex-1">
        <Text className="text-lg font-semibold text-black dark:text-white mb-3">
          Songs
        </Text>

        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      {/* Action Sheet */}
      <PlaylistSongActionSheet
        visible={showSheet}
        song={selectedSong}
        onClose={() => setShowSheet(false)}
        text="playlist"
      />
    </View>
  );
};

export default Playlists;
