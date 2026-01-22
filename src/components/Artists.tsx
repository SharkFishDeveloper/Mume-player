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
import { searchArtists } from "../api/saavn";
import FILTER_OPTIONS from "../../util/ApplyFilters";
import CircleLoader from "./Loading";

/* ---------------- helpers ---------------- */

function applyArtistFilter(list: any[], filter: string) {
  const data = [...list];

  switch (filter) {
    case "Ascending":
      return data.sort((a, b) => a.name.localeCompare(b.name));

    case "Descending":
      return data.sort((a, b) => b.name.localeCompare(a.name));

    case "Date Added":
      return data; // API has no date → keep order

    default:
      return data;
  }
}

/* ---------------- component ---------------- */

const Artists = ({searchQuery}:{searchQuery:string}) => {
  const [allArtists, setAllArtists] = useState<any[]>([]);
  const [filter, setFilter] =
  useState<typeof FILTER_OPTIONS[number]>("Date Added");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function loadArtists() {
      const artists = await searchArtists("popular");
      setAllArtists(artists);
      setLoading(false);
    }
    setTimeout(()=>{
      loadArtists();
    },500)
  }, [searchQuery]);

  const artists = useMemo(
    () => applyArtistFilter(allArtists, filter),
    [allArtists, filter]
  );

  const renderItem = ({ item }: { item: any }) => {
    const albumCount =
      item.albums?.length ??
      item.albumCount ??
      Math.floor(Math.random() * 3) + 1;

    const songCount =
      item.songCount ??
      item.songs?.length ??
      Math.floor(Math.random() * 30) + 5;

    return (
      <View className="flex-row items-center mb-5">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-16 h-16 rounded-full"
        />

        <View className="flex-1 ml-4">
          <Text
            numberOfLines={1}
            className="text-black dark:text-white font-semibold"
          >
            {item.name}
          </Text>

          <Text className="text-gray-500 text-xs mt-1">
            {albumCount} Album{albumCount > 1 ? "s" : ""} |{" "}
            {songCount} Songs
          </Text>
        </View>

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

   if(loading){
    return <CircleLoader/>
  }


  return (
    <View className="flex-1 bg-white dark:bg-black px-4 pt-4">
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-gray-500 text-sm">
          {artists.length} artists
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

      {/* Artists List */}
      <View>
        {loading ? 
      
       <View className="flex-1 items-center justify-center">
            <CircleLoader />
          </View>: (

        <FlatList
        data={artists}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEnabled={false} 
      />
      )}
      </View>

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
            {["Date Added", "Ascending", "Descending"].map((option) => {
              const active = filter === option;

              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setFilter(option as any);
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

export default Artists;
