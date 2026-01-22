import { create } from "zustand";

type ThemeState = {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (value: boolean) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false, // default = light
  toggleTheme: () =>
    set((state) => ({ isDark: !state.isDark })),
  setTheme: (value) =>
    set({ isDark: value }),
}));
