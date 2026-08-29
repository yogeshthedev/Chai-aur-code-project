import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Clock3,
  Heart,
  Home,
  ListVideo,
  LogOut,
  X,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuthStore } from "../store/useAuthStore";

const primaryNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/playlists", label: "Playlists", icon: ListVideo },
  { to: "/liked", label: "Liked Videos", icon: Heart },
  { to: "/history", label: "History", icon: Clock3 },
];

const studioNav = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

const RootLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) selection:bg-red-500 selection:text-white">
      {/* Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-[#09090b]/90 backdrop-blur-xl transition-colors">
        <Navbar onToggleSidebar={toggleMobileSidebar} />
      </header>

      {/* Main Layout Area */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#09090b] p-3.5 md:flex transition-colors">
          {/* Top Navigation Links */}
          <div className="space-y-6">
            <div>
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Feeds
              </p>
              <nav className="space-y-1">
                {primaryNav.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200/80 dark:border-red-900/40 shadow-xs"
                          : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100 border border-transparent"
                      }`
                    }
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="border-t border-slate-200/90 dark:border-zinc-800/90 pt-4">
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Studio
              </p>
              <nav className="space-y-1">
                {studioNav.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200/80 dark:border-red-900/40 shadow-xs"
                          : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100 border border-transparent"
                      }`
                    }
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom Sidebar Action: Logout */}
          <div className="border-t border-slate-200/90 dark:border-zinc-800/90 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Drawer Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={closeMobileSidebar}
            />
            <div className="relative z-10 flex h-full w-72 flex-col justify-between bg-white dark:bg-[#09090b] border-r border-slate-200 dark:border-zinc-800 p-4 shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
                  <span className="text-base font-bold text-slate-900 dark:text-zinc-100">Navigation</span>
                  <button
                    type="button"
                    onClick={closeMobileSidebar}
                    className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <nav className="space-y-1">
                    {[...primaryNav, ...studioNav].map(({ to, label, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        onClick={closeMobileSidebar}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                            isActive
                              ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200/80"
                              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                          }`
                        }
                      >
                        <Icon size={17} />
                        <span>{label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Mobile Drawer Bottom */}
              <div className="border-t border-slate-200 dark:border-zinc-800 pt-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="min-w-0 flex-1 p-4 pb-20 md:p-6 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200/90 bg-white/95 py-2 backdrop-blur-xl dark:border-zinc-800/90 dark:bg-[#09090b]/95 md:hidden">
        {primaryNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium transition ${
                isActive
                  ? "text-red-500 font-semibold"
                  : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default RootLayout;


