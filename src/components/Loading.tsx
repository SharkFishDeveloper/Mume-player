import { View, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

const CircleLoader = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 items-center justify-center py-10 h-full w-full ">
      <Animated.View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          borderWidth: 3,
          borderColor: "#FDBA74",
          borderTopColor: "#F97316",
          transform: [{ rotate }],
        }}
      />
    </View>
  );
};

export default CircleLoader;
