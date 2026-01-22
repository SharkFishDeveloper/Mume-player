import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { searchAlbums } from "../api/saavn";
import getImage from "../../util/getImage";
import CircleLoader from "./Loading";

const BASE_URL = "https://saavn.sumit.co/api";

const FILTERS = ["Date Modified", "Ascending", "Descending"] as const;

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

/* ---------------- helpers ---------------- */

function applyAlbumFilter(list: any[], filter: string) {
  const data = [...list];

  switch (filter) {
    case "Ascending":
      return data.sort((a, b) => a.name.localeCompare(b.name));

    case "Descending":
      return data.sort((a, b) => b.name.localeCompare(a.name));

    case "Date Modified":
    default:
      return data;
  }
}

/* ---------------- component ---------------- */

const Albums = ({searchQuery}:{searchQuery:string}) => {
  const [allAlbums, setAllAlbums] = useState<any[]>([]);
  const [filter, setFilter] =
    useState<typeof FILTERS[number]>("Date Modified");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading,setLoading] = useState(false);


  useEffect(() => {
    setLoading(true)
    async function loadAlbums() {
      const albums = await searchAlbums(searchQuery);
      setAllAlbums(albums);
      setLoading(false)
    }
    setTimeout(()=>{
      loadAlbums();
    },500)
  }, [searchQuery]);

  const albums = useMemo(
    () => applyAlbumFilter(allAlbums, filter),
    [allAlbums, filter]
  );

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={{ width: CARD_WIDTH }} className="mb-6 p-2">
        <Image
          source={{ uri: getImage(item) }}
          className="w-full h-40 rounded-xl"
        />

        <View className="mt-2">
          <View className="flex-row justify-between items-start">
            <Text
              numberOfLines={1}
              className="text-black dark:text-white font-semibold flex-1 pr-2"
            >
              {item.name}
            </Text>

            <TouchableOpacity>
              <Ionicons
                name="ellipsis-vertical"
                size={16}
                color="#A3A3A3"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 text-xs mt-1">
            {item.primaryArtists || "Unknown Artist"} | {item.year}
          </Text>

          <Text className="text-gray-500 text-xs mt-1">
            {item.songCount || Math.floor(Math.random() * 10 + 8)} songs
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black px-4 pt-4">
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-gray-500 text-sm">
          {albums.length} albums
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

      {/* Albums Grid */}
      {loading ?
       <View className="flex-1 items-center justify-center">
            <CircleLoader />
          </View>
      : (

        <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        scrollEnabled={false} 
      />
      )}

      {/* Filter Dropdown */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View className="absolute top-20 right-4 w-56 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            {FILTERS.map((option) => {
              const active = filter === option;

              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setFilter(option);
                    setShowFilterModal(false);
                  }}
                  className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700"
                >
                  <Text
                    className={
                      active
                        ? "text-orange-500 font-medium"
                        : "text-black dark:text-white"
                    }
                  >
                    {option}
                  </Text>

                  <View
                    className={
                      active
                        ? "w-4 h-4 rounded-full border-2 border-orange-500"
                        : "w-4 h-4 rounded-full border border-gray-400"
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Albums;
