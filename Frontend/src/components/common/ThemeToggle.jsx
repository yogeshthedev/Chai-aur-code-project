import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Creamy Light mode" : "Switch to Dark mode"}
      title={isDark ? "Switch to Creamy Light mode" : "Switch to Dark mode"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAF8] hover:border-white/20 transition-all duration-150 active:scale-95 cursor-pointer"
    >
      {isDark ? (
        <Sun size={15} className="text-[#E5A93C] transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon size={15} className="text-[#FF5A36] transition-transform duration-200" />
      )}
    </button>
  );
};

export default ThemeToggle;
