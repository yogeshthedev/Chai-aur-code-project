import { create } from "zustand";
import { persist } from "zustand/middleware";

const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      toggleTheme: () => {
        set((state) => {
          const nextTheme = state.theme === "light" ? "dark" : "light";
          applyTheme(nextTheme);
          return { theme: nextTheme };
        });
      },
    }),
    {
      name: "video-platform-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);
