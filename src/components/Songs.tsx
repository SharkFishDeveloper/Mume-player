import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { searchSongs } from "../api/saavn";
import getImage from "../../util/getImage";
import { getRecentSongs } from "../storage/recent";
import FILTER_OPTIONS from "../../util/ApplyFilters";
import { Modal } from "react-native";
import CircleLoader from "./Loading";
import SongActionSheet from "./SongActionSheet";
import { usePlayerStore } from "../store/usePlayerStore";
import { saveRecentSong } from "../storage/recent";

const Songs = ({searchQuery}:{searchQuery?:string}) => {
    const [songs, setSongs] = useState<any[]>([]);
    const [filter, setFilter] = useState<typeof FILTER_OPTIONS[number]>("Ascending");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [debouncedQuery, setDebouncedQuery] =  useState<string|undefined>("");
    const [loading,setLoading] = useState(false);
    const [showSheet, setShowSheet] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);

    function mergeWithRecent<T extends { id: string }>(
      recent: T[],
      api: T[]
      ): T[] {
      const recentIds = new Set(recent.map((item) => item.id));
      const filteredApi = api.filter((item) => !recentIds.has(item.id));
      return [...recent, ...filteredApi];
      }

    useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

function getPrimaryArtist(song: any): string {
  if (song.primaryArtists && song.primaryArtists.trim()) {
    return song.primaryArtists.split(",")[0].trim();
  }

  return song.artists?.primary?.[0]?.name ?? "";
}


  function applySongFilter(
  songs: any[],
  filter: typeof FILTER_OPTIONS[number]
) {
  const list = [...songs];

  switch (filter) {
    case "Ascending":
      return list.sort((a, b) => a.name.localeCompare(b.name));

    case "Descending":
      return list.sort((a, b) => b.name.localeCompare(a.name));

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

    case "Date Added":
      // recent songs are already prepended
      return list;

    case "Date Modified":
      // Saavn doesn’t provide modified date → fallback
      return list;

    case "Composer":
      return list.filter((song) =>
        song.artists?.all?.some((a: any) => a.role === "music")
      );

    default:
      return list;
  }
}
const filteredSongs = useMemo(
  () => applySongFilter(songs, filter),
  [songs, filter]
);
    useEffect(() => {
      async function loadData() {
        setLoading(true)  
        const storedSongs = await getRecentSongs();
        const apiSongs = await searchSongs(debouncedQuery ?? "");
        const mergedSongs = mergeWithRecent(storedSongs, apiSongs);
        setSongs(mergedSongs);
        setLoading(false)
      }

      loadData();
  }, [debouncedQuery]);


  const { play, togglePlay, currentSong, isPlaying } = usePlayerStore();
  
  const renderItem = ({ item }: { item: any }) => {
    const durationMin = Math.floor(Number(item.duration) / 60);
    const durationSec = Number(item.duration) % 60;
    const artistName =
    item.primaryArtists && item.primaryArtists.trim() !== ""
      ? item.primaryArtists.split(",")[0].trim()
      : item.artists?.primary?.[0]?.name || "Unknown Artist";
    return (
      <View className="flex-row items-center mb-4">
        {/* Song Image */}
        <Image
          source={{ uri: getImage(item) }}
          className="w-20 h-20 rounded-xl"
        />

        {/* Song Info */}
        <TouchableOpacity className="flex-1 ml-4" onPress={() => {
            setSelectedSong(item);
            setShowSheet(true);
          }}>
          <Text
            numberOfLines={1}
            className="text-black dark:text-white font-semibold"
             
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            className="text-gray-500 text-xs mt-1"
          >
            {artistName} | {durationMin}:{durationSec
              .toString()
              .padStart(2, "0")} mins
          </Text>
        </TouchableOpacity>

        {/* Play Button */}
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-orange-500 items-center justify-center mr-3"
          onPress={async() => {
            await saveRecentSong(item); 
            if (currentSong?.id === item.id) {
              // same song → toggle play / pause
              togglePlay();
            } else {
              // different song → start playing
              play(item);
            }
          }}
        >
          <Ionicons
            name={
              currentSong?.id === item.id && isPlaying ? "pause" : "play"
            }
            size={16}
            color="white"
          />
        </TouchableOpacity>

        {/* More Icon */}
        <TouchableOpacity>
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
    <View className="flex-1 bg-white dark:bg-black px-4 pt-4">
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-gray-500 text-sm">
          {songs.length} songs
        </Text>

        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          className="flex-row items-center gap-1"
        >
          <Text className="text-orange-500 text-sm font-medium">
            {filter}
          </Text>
          <Ionicons
            name="swap-vertical"
            size={14}
            color="#F97316"
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <CircleLoader />
          </View>
        ) : (
          <FlatList
            data={filteredSongs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Filter Modal */}
      <Modal transparent visible={showFilterModal} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/40"
          onPress={() => setShowFilterModal(false)}
        >
          <View className="absolute right-4 top-20 bg-white dark:bg-black rounded-xl w-56 p-2">
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setFilter(option);
                  setShowFilterModal(false);
                }}
                className="py-3 px-4"
              >
                <Text
                  className={
                    option === filter
                      ? "text-orange-500 font-semibold"
                      : "text-black dark:text-white"
                  }
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <SongActionSheet
        visible={showSheet}
        song={selectedSong}
        onClose={() => setShowSheet(false)}
      />
          </View>
        );
};

export default Songs;
