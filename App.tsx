import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import BottomTabs from "./src/navigation/BottomTabs";
import NowPlayingDrawer from "./src/components/NowPlayingDrawer";

export default function App() {
  return (
    <>
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
        <NowPlayingDrawer />
    </>
  );
}
