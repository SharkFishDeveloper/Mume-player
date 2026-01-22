import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQueueStore } from "../store/useQueueStore";
import { usePlayerStore } from "../store/usePlayerStore";
import type { Result } from "../types/saavn";
import { useEffect, useState, type ComponentProps } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addToPlaylist, removeFromPlaylist } from "../storage/playlist";

/* ---------------- favourites storage ---------------- */

const FAV_KEY = "FAVOURITE_SONGS";

async function getFavourites(): Promise<Result[]> {
  const raw = await AsyncStorage.getItem(FAV_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function isFavouriteSong(id: string) {
  const list = await getFavourites();
  return list.some((s) => s.id === id);
}

async function toggleFavouriteSong(song: Result) {
  const list = await getFavourites();
  const exists = list.some((s) => s.id === song.id);

  const updated = exists
    ? list.filter((s) => s.id !== song.id)
    : [...list, song];

  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(updated));
  return !exists;
}

/* ---------------- types ---------------- */

type ActionKey =
  | "playNext"
  | "addQueue"
  | "addPlaylist"
  | "details"
  | "delete";

interface Action {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  key: ActionKey;
  danger?: boolean;
}

const actions: Action[] = [
  { label: "Play Next", icon: "play-skip-forward-outline", key: "playNext" },
  { label: "Add to Playing Queue", icon: "list-outline", key: "addQueue" },
  { label: "Add to Playlist", icon: "add-circle-outline", key: "addPlaylist" },
  { label: "Details", icon: "information-circle-outline", key: "details" },
  {
    label: "Delete from Device",
    icon: "trash-outline",
    key: "delete",
    danger: true,
  },
];

interface SongActionSheetProps {
  visible: boolean;
  onClose: () => void;
  song: Result | null;
}

/* ---------------- component ---------------- */

const SongActionSheet = ({ visible, onClose, song }: SongActionSheetProps) => {
  const { playNext, addToQueue } = useQueueStore();
  const { currentSong, play } = usePlayerStore();

  const [favourite, setFavourite] = useState(false);
  const { height } = Dimensions.get("window");

  /* -------- load favourite state -------- */

  useEffect(() => {
    if (!song) {
      setFavourite(false);
      return;
    }

    isFavouriteSong(song.id).then(setFavourite);
  }, [song?.id]);

  /* -------- helpers -------- */

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min} min ${sec} sec`;
  };

  const artistName =
    song?.artists?.primary?.[0]?.name ?? "Unknown Artist";

  const handleAction = async (key: ActionKey) => {
    if (!song) return;

    switch (key) {
      case "playNext":
        if (!currentSong) {
          play(song);
        } else {
          playNext(song);
        }
        break;

      case "addQueue":
        if (!currentSong) {
          play(song);
        } else {
          playNext(song);
        }
        addToQueue(song);
        Alert.alert("Added to queue");
        break;

      case "addPlaylist":
        await addToPlaylist(song);
        Alert.alert("Added to playlist");
        break;

      case "details":
        Alert.alert(
          "Song Details",
          `Name: ${song.name}
Artist: ${artistName}
Album: ${song.album?.name ?? "—"}
Year: ${song.year ?? "—"}`
        );
        break;

      case "delete":
        await removeFromPlaylist(song.id);
        Alert.alert("Removed from playlist");
        break;
    }

    onClose();
  };

  /* ---------------- render ---------------- */

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableOpacity
        className="flex-1 bg-black/40"
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{ maxHeight: height * 0.7 }}
          className="absolute bottom-0 w-full bg-white dark:bg-black rounded-t-2xl px-4 pb-4"
        >
          {/* Grab handle */}
          <View className="items-center py-2">
            <View className="h-1 w-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </View>

          {/* Song info */}
          {song && (
            <View className="py-3 border-b border-gray-200 dark:border-gray-800">
              <View className="flex-row items-center justify-between">
                <Text
                  numberOfLines={1}
                  className="flex-1 font-semibold text-black dark:text-white text-lg pr-3"
                >
                  {song.name}
                </Text>

                <TouchableOpacity
                  onPress={async () => {
                    const next = await toggleFavouriteSong(song);
                    setFavourite(next);
                  }}
                  hitSlop={10}
                >
                  <Ionicons
                    name={favourite ? "heart" : "heart-outline"}
                    size={22}
                    color={favourite ? "#EF4444" : "#9CA3AF"}
                  />
                </TouchableOpacity>
              </View>

              <Text className="text-gray-500 text-xs mt-1">
                {artistName} • {formatDuration(song.duration)}
              </Text>
            </View>
          )}

          {/* Actions */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {song &&
              actions.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => handleAction(item.key)}
                  className="flex-row items-center py-3"
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.danger ? "#EF4444" : "#6B7280"}
                  />
                  <Text
                    className={`ml-4 text-sm ${
                      item.danger
                        ? "text-red-500"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SongActionSheet;
