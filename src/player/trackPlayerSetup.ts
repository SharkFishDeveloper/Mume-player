//@ts-ignore
import TrackPlayer from "react-native-track-player";

export async function setupTrackPlayer() {
  await TrackPlayer.setupPlayer();

  await TrackPlayer.updateOptions({
    stopWithApp: false, // ✅ background playback
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
    ],
  });
}
