import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { usePlayerStore } from "../store/usePlayerStore";
import getImage from "../../util/getImage"; // Ensure this import path is correct

const { height } = Dimensions.get("window");
const COLLAPSED_HEIGHT = 80; // Adjusted for mini-player
const EXPANDED_HEIGHT = height; 

const NowPlayingDrawer = () => {
  const {
    currentSong,
    isPlaying,
    isExpanded,
    togglePlay,
    expand,
    collapse,
  } = usePlayerStore();

  // 1. Setup the Animated Value
  const translateY = useRef(new Animated.Value(height - COLLAPSED_HEIGHT)).current;

  // 2. PanResponder to handle dragging
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture if the user drags vertically more than 5px
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // While dragging, update the position
        const newValue = isExpanded ? gestureState.dy : (height - COLLAPSED_HEIGHT) + gestureState.dy;
        
        // Prevent dragging above the top of the screen
        if (newValue >= 0) {
          translateY.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged up fast or more than halfway, expand. Otherwise, collapse.
        if (gestureState.dy < -100 || (isExpanded && gestureState.dy < 200)) {
          expand();
          animateTo(0);
        } else {
          collapse();
          animateTo(height - COLLAPSED_HEIGHT);
        }
      },
    })
  ).current;

  const animateTo = (toValue: number) => {
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  // Sync animation when store state changes (e.g., from pressing play button)
  useEffect(() => {
    animateTo(isExpanded ? 0 : height - COLLAPSED_HEIGHT);
  }, [isExpanded]);

  if (!currentSong) return null;

  const artist = currentSong.artists?.primary?.[0]?.name ?? "Unknown Artist";

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: EXPANDED_HEIGHT,
        zIndex: 100,
        elevation: 10,
      }}
      className="bg-white dark:bg-black rounded-t-3xl shadow-2xl"
      {...panResponder.panHandlers} // Attach the drag listeners here
    >
      {/* DRAG HANDLE INDICATOR */}
      <View className="items-center py-2">
        <View className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </View>

      {/* MINI PLAYER (Only visible when collapsed) */}
      {!isExpanded && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={expand}
          className="h-16 px-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1">
            <Image 
               source={{ uri: getImage(currentSong) }} 
               className="w-12 h-12 rounded-lg mr-3" 
            />
            <View className="flex-1">
              <Text numberOfLines={1} className="font-semibold text-black dark:text-white">
                {currentSong.name}
              </Text>
              <Text className="text-xs text-gray-500">{artist}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={togglePlay} className="px-2">
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={28}
              color="#F97316"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* FULL PLAYER CONTENT */}
      {isExpanded && (
        <View className="flex-1 px-6 pt-10">
           {/* You can add your Starboy cover art here */}
           <Image 
               source={{ uri: getImage(currentSong) }} 
               className="w-full aspect-square rounded-3xl mb-10" 
            />
          
          <Text className="text-2xl font-bold text-black dark:text-white text-center">
            {currentSong.name}
          </Text>
          <Text className="text-lg text-gray-500 text-center mt-2">{artist}</Text>

          <View className="flex-row justify-center items-center mt-10 gap-10">
            <Ionicons name="play-back" size={40} color="black" />
            <TouchableOpacity onPress={togglePlay}>
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={80}
                color="#F97316"
              />
            </TouchableOpacity>
            <Ionicons name="play-forward" size={40} color="black" />
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default NowPlayingDrawer;