import { create } from "zustand";
import Result from "../types/saavn";

interface QueueState {
  queue: Result[];
  currentIndex: number;

  playNext: (song: Result) => void;
  addToQueue: (song: Result) => void;
  setQueue: (songs: Result[], startIndex?: number) => void;
  playSong: (song: Result) => void;
  next: () => void;
  previous: () => void;
  currentSong: () => Result | undefined;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  currentIndex: -1,

  playNext: (song) =>
    set((state) => {
      const queue = [...state.queue];
      queue.splice(state.currentIndex + 1, 0, song);
      return { queue };
    }),

  addToQueue: (song) =>
    set((state) => ({
      queue: [...state.queue, song],
    })),

  setQueue: (songs, startIndex = 0) =>
    set({
      queue: songs,
      currentIndex: startIndex,
    }),

  playSong: (song) =>
    set({
      queue: [song],
      currentIndex: 0,
    }),

  next: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.queue.length - 1),
    })),

  previous: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),

  currentSong: () => {
    const { queue, currentIndex } = get();
    return queue[currentIndex];
  },
}));
