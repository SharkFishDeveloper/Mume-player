import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import RootStack from "./src/navigation/RootStack";
import NowPlayingDrawer from "./src/components/NowPlayingDrawer";
import { useThemeStore } from "./src/store/useThemeStore";

export default function App() {
  
  return (
    <NavigationContainer >
      <RootStack />
      <NowPlayingDrawer />
    </NavigationContainer>
  );
}
