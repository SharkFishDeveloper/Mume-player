import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQueueStore } from "../store/useQueueStore";
import type { Result } from "../types/saavn";
import { useEffect, useState, type ComponentProps } from "react";
import { isFavourite, toggleFavourite } from "../../util/favourite";

type ActionKey = "playNext" | "addQueue" | undefined;

interface Action {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  key?: ActionKey;
  danger?: boolean;
}

const actions: Action[] = [
  { label: "Play Next", icon: "play-skip-forward-outline", key: "playNext" },
  { label: "Add to Playing Queue", icon: "list-outline", key: "addQueue" },
  { label: "Add to Playlist", icon: "add-circle-outline" },
  { label: "Go to Album", icon: "albums-outline" },
  { label: "Go to Artist", icon: "person-outline" },
  { label: "Details", icon: "information-circle-outline" },
  { label: "Set as Ringtone", icon: "call-outline" },
  { label: "Add to Blacklist", icon: "close-circle-outline" },
  { label: "Share", icon: "share-social-outline" },
  { label: "Delete from Device", icon: "trash-outline", danger: true },
];

interface SongActionSheetProps {
  visible: boolean;
  onClose: () => void;
  song: Result | null;
}

const SongActionSheet = ({ visible, onClose, song }: SongActionSheetProps) => {
  const { playNext, addToQueue } = useQueueStore();
  const [favourite, setFavourite] = useState(false);

  const { height } = Dimensions.get("window");

  // ✅ Hooks must ALWAYS run
  useEffect(() => {
    if (!song) return;
    isFavourite(song.id).then(setFavourite);
  }, [song?.id]);

  // ✅ Safe early return AFTER hooks
  if (!song) return null;

  const handleAction = (key?: ActionKey) => {
    if (key === "playNext") playNext(song);
    if (key === "addQueue") addToQueue(song);
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min} min ${sec} sec`;
  };

  const artistName =
    song.artists?.primary?.[0]?.name ?? "Unknown Artist";

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
                  const newState = await toggleFavourite(song.id);
                  setFavourite(newState);
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

          {/* Actions */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {actions.map((item) => (
              <TouchableOpacity
                key={item.label}
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
