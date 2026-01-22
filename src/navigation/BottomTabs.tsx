import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { Settings, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Favourites from "../screens/Favourites";
import Playlists from "../screens/Playlists";
import SettingsScreen from "../screens/Settings";

const Tab = createBottomTabNavigator();

const Placeholder = ({ title }: { title: string }) => (
  <Text className="flex-1 text-center mt-20 text-black dark:text-white">
    {title}
  </Text>
);

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#F97316", // orange-500
        tabBarInactiveTintColor: "#A3A3A3", // gray-400
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0.5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Favorites") iconName = "heart-outline";
          else if (route.name === "Playlists") iconName = "list-outline";
          else iconName = "settings-outline";

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Favorites"
        component={() => <Favourites/>}
      />
      <Tab.Screen
        name="Playlists"
        component={() => <Playlists/>}
      />
      <Tab.Screen
        name="Settings"
        component={() => <SettingsScreen/>}
      />
    </Tab.Navigator>
  );
}
