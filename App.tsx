import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import AppNavigator from "./src/navigation/AppNavigator";
import BottomTabs from "./src/navigation/BottomTabs";

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
