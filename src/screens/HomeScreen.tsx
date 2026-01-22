import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TABS, TABSEnum } from "../../util/TabEnum";
import SuggestedTab from "../components/SuggestedTab";
import Songs from "../components/Songs";
import Artists from "../components/Artists";
import Albums from "../components/Albums";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<string>(TABSEnum.Suggested);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  


  const closeSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black px-4 pt-16">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        {!isSearching ? (
          <>
            {/* Logo */}
            <View className="flex-row items-center gap-3 flex-1">
              <Ionicons
                name="musical-notes-outline"
                size={22}
                color="#F97316"
              />
              <Text className="text-2xl font-bold text-black dark:text-white">
                Mume
              </Text>
            </View>

            {/* Search Icon */}
            <TouchableOpacity onPress={() => {
              setIsSearching(true) ; setActiveTab(TABSEnum.Songs)
            } }>
              <Ionicons
                name="search-outline"
                size={22}
                color="#A3A3A3"
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Back Arrow */}
            <TouchableOpacity onPress={closeSearch}>
              <Ionicons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>

            {/* Search Input */}
            <View className="flex-row items-center flex-1 ml-3 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
              <Ionicons
                name="search-outline"
                size={18}
                color="#9CA3AF"
              />

              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-2 text-black dark:text-white"
                autoFocus
              />

              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close"
                    size={18}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>

      {/* Tabs (hidden while searching) */}
      {!isSearching && (
        <View className="flex-row mt-4 gap-10 justify-around">
          {TABS.map((tab) => (
            <View className="items-center" key={tab}>
              <TouchableOpacity onPress={() => setActiveTab(tab)}>
                <Text
                  className={
                    activeTab === tab
                      ? "text-orange-500 font-semibold mb-2"
                      : "text-gray-400 mb-2"
                  }
                >
                  {tab}
                </Text>
              </TouchableOpacity>

              {activeTab === tab && (
                <View className="h-0.5 w-10 bg-orange-500 rounded-full" />
              )}
            </View>
          ))}
        </View>
      )}

      {/* Content */}
      {!isSearching && activeTab === TABSEnum.Suggested && <SuggestedTab />}

      {!isSearching && activeTab === TABSEnum.Songs && (
        <Songs searchQuery={searchQuery} />
      )}

      {!isSearching && activeTab === TABSEnum.Artists && (
        <Artists searchQuery={searchQuery}  />
      )}

      {!isSearching && activeTab === TABSEnum.Albums && (
        <Albums searchQuery={searchQuery} />
      )}

      {/* Search Mode Content */}
      {isSearching && activeTab !== TABSEnum.Suggested && (
        <>
          {activeTab === TABSEnum.Songs && (
            <Songs searchQuery={searchQuery} />
          )}
          {activeTab === TABSEnum.Artists && (
            <Artists searchQuery={searchQuery} />
          )}
          {activeTab === TABSEnum.Albums && (
            <Albums searchQuery={searchQuery} />
          )}
        </>
      )}
    </ScrollView>
  );
}
