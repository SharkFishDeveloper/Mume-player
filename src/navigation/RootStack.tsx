import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import ArtistSongs from "../components/ArtistSongs";

export type RootStackParamList = {
  Tabs: undefined;
  ArtistSongs: {
    artistId: string;
    artistName: string;
    artistImage?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="ArtistSongs" component={ArtistSongs} />
    </Stack.Navigator>
  );
}
