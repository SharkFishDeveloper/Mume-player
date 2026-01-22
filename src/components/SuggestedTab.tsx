import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import SectionHeader from './SectionHeader';
import { searchArtists, searchSongs } from '../api/saavn';
import getImage from '../../util/getImage';
import {
  addRecentSong,
  getRecentSongs,
  addRecentArtist,
  getRecentArtists,
} from "../storage/recent"


const SuggestedTab = () => {

  const [recentSongs, setRecentSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [mostPlayed, setMostPlayed] = useState<any[]>([]);

  function mergeWithRecent<T extends { id: string }>(
    recent: T[],
    api: T[]
    ): T[] {
    const recentIds = new Set(recent.map((item) => item.id));
    const filteredApi = api.filter((item) => !recentIds.has(item.id));
    return [...recent, ...filteredApi];
    }

  useEffect(() => {
  async function loadData() {
    const storedSongs = await getRecentSongs();
    const storedArtists = await getRecentArtists();

    const [apiSongs, apiArtists] = await Promise.all([
      searchSongs("arijit"),
      searchArtists("popular"),
    ]);

    // merge (local first)
    const mergedSongs = mergeWithRecent(storedSongs, apiSongs);
    const mergedArtists = mergeWithRecent(storedArtists, apiArtists);

    setRecentSongs(mergedSongs);
    setArtists(mergedArtists);
    setMostPlayed(apiSongs); // mostPlayed stays pure API
  }

  loadData();
}, []);

  return (
    <>
        {/* Recently Played */}
      <SectionHeader title="Recently Played" />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recentSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mr-4 w-36">
            <Image
              source={{ uri: getImage(item) }}
              className="w-36 h-36 rounded-xl"
            />
            <Text
              numberOfLines={1}
              className="mt-2 text-black dark:text-white font-semibold"
            >
              {item.name}
            </Text>
            <Text className="text-gray-500 text-xs">
              {item.primaryArtists}
            </Text>
          </View>
        )}
      />

      {/* Artists */}
      <SectionHeader title="Artists" />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={artists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mr-4 w-24 items-center">
            <Image
              source={{ uri: getImage(item) }}
              className="w-20 h-20 rounded-full"
            />

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="mt-2 text-black dark:text-white text-sm text-center w-full"
            >
              {item.name}
            </Text>
          </View>
        )}
      />

      {/* Most Played */}
      <SectionHeader title="Most Played" />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={mostPlayed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mr-4 w-36">
            <Image
              source={{ uri: getImage(item) }}
              className="w-36 h-36 rounded-xl"
            />
            <Text
              numberOfLines={1}
              className="mt-2 text-black dark:text-white font-semibold"
            >
              {item.name}
            </Text>
            <Text className="text-gray-500 text-xs">
              {item.primaryArtists}
            </Text>
          </View>
        )}
      />
    
    </>
  )
}

export default SuggestedTab