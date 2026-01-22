import { create } from "zustand";
import { Audio, AVPlaybackStatus } from "expo-av";
import type { Result } from "../types/saavn";
import { getBestAudioUrl } from "../../util/getBestAudioUrl";

interface PlayerState {
  currentSong: Result | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  isExpanded: boolean;
  playbackSpeed: number;
  isLooping: boolean;
  position: number;
  duration: number;
  lyrics: string | null;

  play: (song: Result) => Promise<void>;
  togglePlay: () => Promise<void>;
  stop: () => Promise<void>;
  expand: () => void;
  collapse: () => void;
  setSpeed: (speed: number) => Promise<void>;
  toggleLoop: () => Promise<void>;
  seek: (millis: number) => Promise<void>;
  updateStatus: (status: AVPlaybackStatus) => void;
  fetchLyrics: (id: string) => Promise<void>;
  
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  sound: null,
  isExpanded: false,
  playbackSpeed: 1.0,
  isLooping: false,
  position: 0,
  duration: 0,
  lyrics: null,

  updateStatus: (status) => {
    if (status.isLoaded) {
      set({
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        isPlaying: status.isPlaying,
      });
      
      // Handle song ending
      if (status.didJustFinish && !status.isLooping) {
        set({ isPlaying: false });
      }
    }
  },

  play: async (song) => {
    const audioUrl = getBestAudioUrl(song);
    if (!audioUrl) return;

    const { sound: oldSound } = get();
    if (oldSound) await oldSound.unloadAsync();

    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true, rate: get().playbackSpeed, isLooping: get().isLooping },
      get().updateStatus
    );

    set({ currentSong: song, sound, isPlaying: true, lyrics: null });
    get().fetchLyrics(song.id);
  },

  togglePlay: async () => {
    const { sound, isPlaying } = get();
    if (!sound) return;
    isPlaying ? await sound.pauseAsync() : await sound.playAsync();
  },

  stop: async () => {
    const { sound } = get();
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    set({ sound: null, isPlaying: false, currentSong: null, isExpanded: false });
  },

  setSpeed: async (speed) => {
    const { sound } = get();
    if (sound) await sound.setRateAsync(speed, true);
    set({ playbackSpeed: speed });
  },

  toggleLoop: async () => {
    const { sound, isLooping } = get();
    const nextLoop = !isLooping;
    if (sound) await sound.setIsLoopingAsync(nextLoop);
    set({ isLooping: nextLoop });
  },

  seek: async (millis) => {
    const { sound } = get();
    if (sound) await sound.setPositionAsync(millis);
  },

  fetchLyrics: async (id) => {
    try {
      const res = await fetch(`https://saavn.dev/api/songs/${id}/lyrics`);
      const json = await res.json();
      const clean = json.data?.lyrics?.replace(/<br\s*\/?>/gi, '\n') || "No lyrics available.";
      set({ lyrics: clean });
    } catch {
      set({ lyrics: "Failed to load lyrics." });
    }
  },

  expand: () => set({ isExpanded: true }),
  collapse: () => set({ isExpanded: false }),
}));