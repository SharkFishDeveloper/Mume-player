import { View ,Text,TouchableOpacity} from "react-native";

/* ---------- Reusable section header ---------- */
export default function SectionHeader({ title }: { title: string }) {
  return (
    <View className="flex-row justify-between items-center mb-3 mt-6">
      <Text className="text-lg font-semibold text-black dark:text-white">
        {title}
      </Text>
      <TouchableOpacity>
        <Text className="text-orange-500">See All</Text>
      </TouchableOpacity>
    </View>
  );
}
