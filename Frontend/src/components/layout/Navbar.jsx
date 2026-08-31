import { LogOut, Menu, Search, Upload, UserCircle, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import ThemeToggle from "../common/ThemeToggle";

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    const nextQuery = query.trim();
    navigate(nextQuery ? `/?q=${encodeURIComponent(nextQuery)}` : "/");
  };

  const handleClear = () => {
    setQuery("");
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-16 w-full items-center justify-between gap-3 px-4 md:px-6">
      {/* Left: Sidebar Toggle & Brand */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-105">
            <span className="text-base font-black tracking-tight">V</span>
          </div>
          <span className="hidden sm:inline text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Video<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Flow</span>
          </span>
        </Link>
      </div>

      {/* Center: Minimalist Modern Search Bar */}
      <form
        onSubmit={handleSearch}
        className={`relative flex min-w-0 max-w-xl flex-1 items-center transition-all duration-200 ${
          isFocused ? "max-w-2xl" : ""
        }`}
      >
        <div
          className={`flex w-full items-center rounded-full border bg-slate-100/90 dark:bg-zinc-900/90 px-4 py-2 transition-all duration-200 ${
            isFocused
              ? "border-indigo-500/80 ring-2 ring-indigo-500/20 bg-white dark:bg-zinc-900 shadow-sm"
              : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
          }`}
        >
          <Search size={16} className={`shrink-0 mr-2.5 transition-colors ${isFocused ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-zinc-500"}`} />
          <input
            id="site-search"
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search videos, creators, playlists..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search query"
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:text-zinc-500 dark:hover:text-white dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-2.5">
        <Link
          to="/upload"
          aria-label="Upload video"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold shadow-sm shadow-indigo-500/20 transition active:scale-95 cursor-pointer"
        >
          <Upload size={14} />
          <span>Upload</span>
        </Link>

        <ThemeToggle />

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
              className="h-8.5 w-8.5 rounded-full object-cover ring-2 ring-slate-200 dark:ring-zinc-700"
            />
          ) : (
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-zinc-800 dark:text-zinc-200 font-semibold text-xs ring-2 ring-slate-200 dark:ring-zinc-700">
              {user?.username ? user.username.slice(0, 1).toUpperCase() : <UserCircle size={20} />}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;



