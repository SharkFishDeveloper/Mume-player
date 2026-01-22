import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../store/useThemeStore";

const SettingsScreen = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <View className="flex-1 bg-white px-5 pt-14">
      {/* Header */}
      <Text className="text-2xl font-bold text-black mb-6">
        Settings
      </Text>

      {/* Section */}
      <View className="border-t border-gray-200 pt-4">
        {/* Dark Mode */}
        <View className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3">
            <Ionicons
              name={isDark ? "moon" : "moon-outline"}
              size={22}
              color="#e4712a"
            />
            <Text className="text-base text-black">
              Dark Mode
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
          />
        </View>

        {/* Account */}
        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name="person-outline" size={22} color="#374151" />
            <Text className="text-base text-black">Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name="notifications-outline" size={22} color="#374151" />
            <Text className="text-base text-black">Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Playback */}
        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name="musical-notes-outline" size={22} color="#374151" />
            <Text className="text-base text-black">Playback</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Storage */}
        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name="folder-outline" size={22} color="#374151" />
            <Text className="text-base text-black">Storage</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* About */}
        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3">
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#374151"
            />
            <Text className="text-base text-black">About</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
