import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { removeFromPlaylist } from "../storage/playlist";
import { usePlayerStore } from "../store/usePlayerStore";
import { useQueueStore } from "../store/useQueueStore";

const PlaylistSongActionSheet = ({
  visible,
  song,
  onClose,
  text
}: {
  visible: boolean;
  song: any;
  onClose: () => void;
  text:string
}) => {
  const { play, togglePlay, currentSong, isPlaying } =
    usePlayerStore();
  const { addToQueue } = useQueueStore();

  if (!song) return null;

  const artist =
    song.primaryArtists && song.primaryArtists.trim()
      ? song.primaryArtists.split(",")[0].trim()
      : song.artists?.primary?.[0]?.name ?? "Unknown Artist";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/40"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="absolute bottom-0 w-full bg-white dark:bg-black rounded-t-2xl px-5 pb-6">
          {/* Grab handle */}
          <View className="items-center py-2">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </View>

          {/* Song info */}
          <View className="mb-4">
            <Text
              numberOfLines={1}
              className="text-lg font-semibold text-black dark:text-white"
            >
              {song.name}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              {artist}
            </Text>
          </View>

          {/* Actions */}
          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() => {
              if (currentSong?.id === song.id) {
                togglePlay();
              } else {
                play(song);
              }
              onClose();
            }}
          >
            <Ionicons
              name={
                currentSong?.id === song.id && isPlaying
                  ? "pause"
                  : "play"
              }
              size={20}
              color="#F97316"
            />
            <Text className="ml-4 text-black dark:text-white">
              {currentSong?.id === song.id && isPlaying
                ? "Pause"
                : "Play"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() => {
              addToQueue(song);
              onClose();
            }}
          >
            <Ionicons
              name="play-skip-forward-outline"
              size={20}
              color="#6B7280"
            />
            <Text className="ml-4 text-black dark:text-white">
              Play Next
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={async () => {
              await removeFromPlaylist(song.id);
              onClose();
            }}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#EF4444"
            />
            <Text className="ml-4 text-red-500">
              Remove from {text}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={onClose}
          >
            <Ionicons
              name="close"
              size={20}
              color="#9CA3AF"
            />
            <Text className="ml-4 text-gray-500">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default PlaylistSongActionSheet;
