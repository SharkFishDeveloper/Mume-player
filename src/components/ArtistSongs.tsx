import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { searchSongs } from "../api/saavn";
import getImage from "../../util/getImage";
import CircleLoader from "./Loading";
import { usePlayerStore } from "../store/usePlayerStore";
import { useQueueStore } from "../store/useQueueStore";
import { addRecentSong } from "../storage/recent";
import PlaylistSongActionSheet from "../components/PlaylistSongActionSheet";

const ArtistSongs = ({ route }: any) => {
  const { artistId, artistName } = route.params;

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showSheet, setShowSheet] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);

  const { play, togglePlay, currentSong, isPlaying } =
    usePlayerStore();
  const { setQueue } = useQueueStore();

  useEffect(() => {
    async function loadSongs() {
      setLoading(true);
      const res = await searchSongs(artistId);
      setSongs(res);
      setLoading(false);
    }

    loadSongs();
  }, [artistId]);

  const renderItem = ({ item }: { item: any }) => {
  const durationMin = Math.floor(item.duration / 60);
  const durationSec = item.duration % 60;

  return (
    <View className="flex-row items-center mb-4">
      {/* Image */}
      <Image
        source={{ uri: getImage(item) }}
        className="w-20 h-20 rounded-xl"
      />

      {/* Info (NOT touchable) */}
      <View className="flex-1 ml-4">
        <Text
          numberOfLines={1}
          className="text-black font-semibold"
        >
          {item.name}
        </Text>

        <Text className="text-gray-500 text-xs mt-1">
          {artistName} • {durationMin}:
          {durationSec.toString().padStart(2, "0")}
        </Text>
      </View>

      {/* Play Button */}
      <TouchableOpacity
        className="w-9 h-9 rounded-full bg-orange-500 items-center justify-center mr-3"
        onPress={async () => {
          setQueue(songs, songs.findIndex(s => s.id === item.id));
          await addRecentSong(item);

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

      {/* More (ONLY this opens sheet) */}
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

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <Text className="text-xl font-bold text-black mb-4">
        {artistName}
      </Text>

      {loading ? (
        <CircleLoader />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Action Sheet */}
      <PlaylistSongActionSheet
        visible={showSheet}
        song={selectedSong}
        onClose={() => setShowSheet(false)}
        text="artist songs"
      />
    </View>
  );
};

export default ArtistSongs;