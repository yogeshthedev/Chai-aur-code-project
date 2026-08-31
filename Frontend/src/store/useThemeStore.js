import { create } from "zustand";
import { persist } from "zustand/middleware";

const applyTheme = (theme) => {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
      root.setAttribute("data-theme", "light");
    }
  }
};

// Immediately apply saved theme on initial script execution to prevent flash
try {
  const saved = localStorage.getItem("video-platform-theme");
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed?.state?.theme) {
      applyTheme(parsed.state.theme);
    } else {
      applyTheme("light");
    }
  } else {
    applyTheme("light");
  }
} catch {
  applyTheme("light");
}

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
