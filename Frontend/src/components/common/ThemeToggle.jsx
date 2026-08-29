import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 transition-all duration-200 hover:scale-105 active:scale-95 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
    >
      {isDark ? (
        <Sun size={17} className="transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon size={17} className="transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};

export default ThemeToggle;
