import { View, Text, TouchableOpacity } from "react-native";

export default function Header() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <Text className="text-xl font-bold text-black dark:text-white">
        🎵 Mume
      </Text>

      <TouchableOpacity>
        <Text className="text-xl text-black dark:text-white">🔍</Text>
      </TouchableOpacity>
    </View>
  );
}
