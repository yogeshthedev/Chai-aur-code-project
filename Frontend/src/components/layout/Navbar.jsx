import { Menu, Search, Upload, UserCircle, X, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import ThemeToggle from "../common/ThemeToggle";

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setIsMac(typeof window !== "undefined" && /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));

    const handleKeyDown = (event) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }

      // Check for Escape to blur search
      if (event.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    const nextQuery = query.trim();
    navigate(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search");
  };

  const handleClear = () => {
    setQuery("");
    navigate("/search");
  };

  return (
    <div className="flex h-14 w-full items-center justify-between gap-4 px-4 md:px-6 bg-[#0A0A0A] border-b border-white/8">
      {/* Left: Sidebar Toggle & Brand Mark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAF8] transition-colors cursor-pointer"
        >
          <Menu size={18} />
        </button>

        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#18181B] border border-white/12 text-[#FAFAF8] font-display font-black text-sm transition-colors group-hover:border-[#FF5A36]">
            V
          </div>
          <span className="font-display font-extrabold text-base tracking-tight text-[#FAFAF8]">
            VIDRA<span className="text-[#FF5A36]">.</span>
          </span>
        </Link>
      </div>

      {/* Center: Command-Style Search Bar */}
      <form
        onSubmit={handleSearch}
        className={`relative flex min-w-0 max-w-xl flex-1 items-center transition-all duration-200 ${
          isFocused ? "max-w-2xl" : ""
        }`}
      >
        <div
          className={`flex w-full items-center rounded-md border bg-[#121212] px-3 py-1.5 transition-all duration-150 ${
            isFocused
              ? "border-[#FF5A36] ring-1 ring-[#FF5A36]/30 bg-[#18181B]"
              : "border-white/8 hover:border-white/16"
          }`}
        >
          <Search
            size={14}
            className={`shrink-0 mr-2.5 transition-colors ${
              isFocused ? "text-[#FF5A36]" : "text-[#71717A]"
            }`}
          />
          <input
            ref={searchInputRef}
            id="site-search"
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search index by keyword, curator, code topic, or cinema..."
            className="w-full bg-transparent text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="p-1 rounded text-[#71717A] hover:text-[#FAFAF8] hover:bg-white/10 transition cursor-pointer"
            >
              <X size={12} />
            </button>
          ) : (
            <kbd
              onClick={() => searchInputRef.current?.focus()}
              title={`Press ${isMac ? "⌘" : "Ctrl"} + K to focus search`}
              className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/10 bg-[#18181B] px-1.5 py-0.5 text-[10px] font-mono text-[#71717A] cursor-pointer hover:border-white/20 hover:text-[#FAFAF8] transition-colors select-none"
            >
              <span>{isMac ? "⌘" : "Ctrl"}</span>
              <span>K</span>
            </kbd>
          )}
        </div>
      </form>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-2.5">
        <Link
          to="/upload"
          aria-label="Upload video"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] hover:bg-coral-hover text-[#0A0A0A] px-3 py-1.5 text-xs font-mono font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          <Upload size={13} strokeWidth={2.5} />
          <span className="hidden sm:inline">Upload</span>
        </Link>

        <ThemeToggle />

        {isAuthenticated && user ? (
          <Link
            to="/profile"
            aria-label="Open your profile"
            title="Open your profile"
            className="relative inline-flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName || user.username || "Your channel"}
                className="h-7.5 w-7.5 rounded-full object-cover ring-1 ring-white/15"
              />
            ) : (
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[#18181B] text-[#FAFAF8] font-bold text-xs ring-1 ring-white/15">
                {user?.username ? user.username.slice(0, 1).toUpperCase() : <UserCircle size={17} />}
              </div>
            )}
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              state={{ backgroundLocation: location }}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] px-3.5 py-1.5 font-mono text-xs text-[#FAFAF8] hover:bg-[#222226] hover:border-[#FF5A36]/40 transition cursor-pointer"
            >
              <User size={13} className="text-[#FF5A36]" />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
