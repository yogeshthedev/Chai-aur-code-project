import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  Clock3,
  Heart,
  Home,
  ListVideo,
  LogOut,
  User,
  X,
  BarChart3,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuthStore } from "../store/useAuthStore";

const primaryNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/history", label: "History", icon: Clock3 },
  { to: "/playlists", label: "Playlists", icon: ListVideo },
  { to: "/liked", label: "Liked Videos", icon: Heart },
];

const studioNav = [
  { to: "/dashboard", label: "Creator Studio", icon: BarChart3 },
];

const RootLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsSidebarCollapsed((prev) => !prev);
    } else {
      setIsMobileSidebarOpen((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAF8] selection:bg-[#FF5A36]/25 selection:text-[#FAFAF8]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 h-14 w-full border-b border-white/8 bg-[#0A0A0A]/95 backdrop-blur-md">
        <Navbar onToggleSidebar={toggleSidebar} />
      </header>

      {/* Main Container */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 flex-col justify-between overflow-y-auto border-r border-white/8 bg-[#0A0A0A] p-3 md:flex transition-all duration-200 ${
            isSidebarCollapsed ? "w-16" : "w-56"
          }`}
        >
          {/* Top Nav Sections */}
          <div className="space-y-6">
            <div>
              {!isSidebarCollapsed && (
                <div className="px-2.5 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
                  Library
                </div>
              )}
              <nav className="space-y-0.5">
                {primaryNav.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    title={isSidebarCollapsed ? label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-md py-2 text-xs font-medium transition-colors duration-150 ${
                        isSidebarCollapsed ? "justify-center px-0" : "px-2.5"
                      } ${
                        isActive
                          ? "bg-[#18181B] text-[#FAFAF8] font-semibold border-l-2 border-[#FF5A36]"
                          : "text-[#A1A1AA] hover:bg-[#121212] hover:text-[#FAFAF8]"
                      }`
                    }
                  >
                    <Icon size={16} className="shrink-0" />
                    {!isSidebarCollapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="border-t border-white/8 pt-4">
              {!isSidebarCollapsed && (
                <div className="px-2.5 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
                  Creator Mode
                </div>
              )}
              <nav className="space-y-0.5">
                {studioNav.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    title={isSidebarCollapsed ? label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-md py-2 text-xs font-medium transition-colors duration-150 ${
                        isSidebarCollapsed ? "justify-center px-0" : "px-2.5"
                      } ${
                        isActive
                          ? "bg-[#18181B] text-[#FAFAF8] font-semibold border-l-2 border-[#FF5A36]"
                          : "text-[#A1A1AA] hover:bg-[#121212] hover:text-[#FAFAF8]"
                      }`
                    }
                  >
                    <Icon size={16} className="shrink-0" />
                    {!isSidebarCollapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom Sidebar Action */}
          <div className="border-t border-white/8 pt-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                title={isSidebarCollapsed ? "Sign out" : undefined}
                className={`flex w-full items-center gap-2 rounded-md py-2 text-xs font-medium text-[#71717A] hover:text-[#FF5A36] hover:bg-white/4 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? "justify-center px-0" : "px-2.5"
                }`}
              >
                <LogOut size={15} className="shrink-0" />
                {!isSidebarCollapsed && <span>Sign out</span>}
              </button>
            ) : (
              <Link
                to="/login"
                state={{ backgroundLocation: location }}
                title={isSidebarCollapsed ? "Sign in" : undefined}
                className={`flex w-full items-center gap-2 rounded-md py-2 text-xs font-medium text-[#FF5A36] hover:bg-white/4 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? "justify-center px-0" : "px-2.5"
                }`}
              >
                <User size={15} className="shrink-0 text-[#FF5A36]" />
                {!isSidebarCollapsed && <span>Sign in</span>}
              </Link>
            )}
          </div>
        </aside>

        {/* Mobile Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
              onClick={closeMobileSidebar}
            />
            <div className="relative z-10 flex h-full w-64 flex-col justify-between bg-[#0A0A0A] border-r border-white/10 p-4 shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/8">
                  <span className="font-display font-bold text-sm text-[#FAFAF8]">REELIO.</span>
                  <button
                    type="button"
                    onClick={closeMobileSidebar}
                    className="p-1 rounded text-[#71717A] hover:text-[#FAFAF8] cursor-pointer"
                  >
                    <X size={16} />
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
                          `flex items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium transition ${
                            isActive
                              ? "bg-[#18181B] text-[#FAFAF8] border-l-2 border-[#FF5A36]"
                              : "text-[#A1A1AA] hover:bg-[#121212] hover:text-[#FAFAF8]"
                          }`
                        }
                      >
                        <Icon size={16} />
                        <span>{label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </div>

              <div className="border-t border-white/8 pt-3">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-[#71717A] hover:text-[#FF5A36] transition cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign out</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    state={{ backgroundLocation: location }}
                    onClick={closeMobileSidebar}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-[#FF5A36] transition cursor-pointer"
                  >
                    <User size={15} className="text-[#FF5A36]" />
                    <span>Sign in</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Main Arena */}
        <main className="w-full min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-[1700px] mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/8 bg-[#0A0A0A]/95 py-2 backdrop-blur-md md:hidden">
        {primaryNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-mono transition ${
                isActive ? "text-[#FF5A36] font-semibold" : "text-[#71717A] hover:text-[#FAFAF8]"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default RootLayout;
