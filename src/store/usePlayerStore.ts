import { create } from "zustand";
import { Audio } from "expo-av";
import type { Result } from "../types/saavn";
import { getBestAudioUrl } from "../../util/getBestAudioUrl";

interface PlayerState {
  currentSong: Result | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  // --- New UI State ---
  isExpanded: boolean; 

  play: (song: Result) => Promise<void>;
  togglePlay: () => Promise<void>;
  stop: () => Promise<void>;
  // --- New Actions ---
  expand: () => void;
  collapse: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  sound: null,
  isExpanded: false, // Default to collapsed

  play: async (song) => {
    const audioUrl = getBestAudioUrl(song);
    if (!audioUrl) return;

    const oldSound = get().sound;
    if (oldSound) {
      await oldSound.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true }
    );

    set({
      currentSong: song,
      sound,
      isPlaying: true,
      // Automatically expand when a song starts playing (optional)
      // isExpanded: true, 
    });
  },

  togglePlay: async () => {
    const { sound, isPlaying } = get();
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }

    set({ isPlaying: !isPlaying });
  },

  stop: async () => {
    const { sound } = get();
    if (!sound) return;

    await sound.stopAsync();
    await sound.unloadAsync();

    set({ sound: null, isPlaying: false, currentSong: null, isExpanded: false });
  },

  // --- Implement the new actions ---
  expand: () => set({ isExpanded: true }),
  collapse: () => set({ isExpanded: false }),
}));