import { View, Text, TouchableOpacity, Animated, Dimensions, PanResponder, Image, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import Slider from "@react-native-community/slider";
import { usePlayerStore } from "../store/usePlayerStore";
import getImage from "../../util/getImage";
import { useQueueStore } from "../store/useQueueStore";

const { height } = Dimensions.get("window");
const COLLAPSED_HEIGHT = 80;
const EXPANDED_HEIGHT = height;

const NowPlayingDrawer = () => {
  const { 
    currentSong, isPlaying, isExpanded, togglePlay, expand, collapse,
    lyrics, fetchLyrics, position, duration, seek, playbackSpeed, setSpeed, isLooping, toggleLoop 
  } = usePlayerStore();

  const { stop,play  } = usePlayerStore();
const { next, currentSong: getQueueSong,clearQueue } = useQueueStore();

  const translateY = useRef(new Animated.Value(height - COLLAPSED_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        const newValue = isExpanded ? gestureState.dy : (height - COLLAPSED_HEIGHT) + gestureState.dy;
        if (newValue >= 0) translateY.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
  // 🚀 FAST swipe down → END song completely
  if (gestureState.vy > 1.5 && gestureState.dy > 120) {
    stop();        // 🛑 stop audio + currentSong = null
    clearQueue();  // 🧹 empty queue

    // animate drawer off screen
    Animated.timing(translateY, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
    }).start();

    return;
  }

  // Normal expand / collapse behavior
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
    Animated.spring(translateY, { toValue, useNativeDriver: true, friction: 8 }).start();
  };

  useEffect(() => {
    animateTo(isExpanded ? 0 : height - COLLAPSED_HEIGHT);
  }, [isExpanded]);



  useEffect(() => {
  if (currentSong) {
    // 🔑 bring drawer back to collapsed position
    translateY.setValue(height - COLLAPSED_HEIGHT);
  }
}, [currentSong]);

  const playNextFromQueue = async () => {
  next(); // move queue index forward

  // wait for zustand to update
  setTimeout(() => {
    const nextSong = getQueueSong();
    if (nextSong) {
      play(nextSong);
    }
  }, 0);
};

  if (!currentSong) return null;

  const artist = currentSong.artists?.primary?.[0]?.name ?? "Unknown Artist";

  const formatTime = (millis: number) => {
    const sec = Math.floor(millis / 1000);
    return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setSpeed(next);
  };

 const handleNext = () => {
  next(); // move queue index

  // Read updated queue song on next tick
  setTimeout(() => {
    const song = getQueueSong();
    if (song) {
      play(song); // 🔑 updates PlayerStore.currentSong
    }
  }, 0);
};

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
      className="bg-white dark:bg-black rounded-t-[40px] shadow-2xl"
      {...panResponder.panHandlers}
    >
      {/* 1. TOP HEADER */}
      {isExpanded && (
        <View className="flex-row justify-between items-center px-6 pt-12">
          <TouchableOpacity onPress={collapse}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="ellipsis-horizontal-circle" size={24} color="black" /></TouchableOpacity>
        </View>
      )}

      {/* 2. DRAG HANDLE */}
      {!isExpanded && (
        <View className="items-center py-2">
          <View className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </View>
      )}

      {/* 3. MINI PLAYER */}
      {!isExpanded && (
        <TouchableOpacity activeOpacity={1} onPress={expand} className="h-16 px-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Image source={{ uri: getImage(currentSong) }} className="w-12 h-12 rounded-lg mr-3" />
            <View className="flex-1">
              <Text numberOfLines={1} className="font-semibold text-black dark:text-white">{currentSong.name}</Text>
              <Text className="text-xs text-gray-500">{artist}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={handleNext}><Ionicons name={isPlaying ? "pause" : "play"} size={28} color="#F97316" /></TouchableOpacity>
            <TouchableOpacity onPress={handleNext}>
  <Ionicons
    name="play-forward"
    size={28}
    color="#F97316"
  />
</TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* 4. FULL PLAYER */}
      {isExpanded && (
        <View className="flex-1 px-8">
          <View className="mt-8 shadow-2xl shadow-black/50">
            <Image source={{ uri: getImage(currentSong) }} className="w-full aspect-square rounded-[30px]" />
          </View>

          <View className="items-center mt-10">
            <Text className="text-3xl font-bold text-black dark:text-white text-center">{currentSong.name}</Text>
            <Text className="text-lg text-gray-500 text-center mt-1">{artist}</Text>
          </View>

          {/* REAL PROGRESS SLIDER */}
          <View className="mt-10">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              minimumTrackTintColor="#F97316"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#F97316"
              onSlidingComplete={seek}
            />
            <View className="flex-row justify-between px-2">
              <Text className="text-xs font-medium text-gray-400">{formatTime(position)}</Text>
              <Text className="text-xs font-medium text-gray-400">{formatTime(duration)}</Text>
            </View>
          </View>

          {/* PLAYER CONTROLS */}
          <View className="flex-row justify-between items-center mt-8">
  <TouchableOpacity onPress={() => seek(0)}>
    <Ionicons name="play-skip-back" size={32} color="black" />
  </TouchableOpacity>

  <TouchableOpacity onPress={toggleLoop}>
    <MaterialCommunityIcons 
      name={isLooping ? "repeat-once" : "repeat"} 
      size={26} 
      color={isLooping ? "#F97316" : "black"} 
    />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={togglePlay}
    className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center shadow-lg shadow-orange-500"
  >
    <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" />
  </TouchableOpacity>

  <TouchableOpacity onPress={cycleSpeed}>
    <Text className="font-bold text-orange-500">{playbackSpeed}x</Text>
  </TouchableOpacity>

  <TouchableOpacity>
    <Ionicons name="play-skip-forward" size={32} color="black" onPress={playNextFromQueue} />
  </TouchableOpacity>
</View>

          {/* LYRICS SCROLL AREA */}
          <View className="flex-1 mt-6 mb-4">
          </View>

          <View className="flex-row justify-between items-center mb-10 px-4">
             <Ionicons name="speedometer-outline" size={22} color="black" />
             <Ionicons name="timer-outline" size={22} color="black" />
             <Ionicons name="cast-outline" size={22} color="black" />
             <Ionicons name="ellipsis-vertical" size={22} color="black" />
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default NowPlayingDrawer;