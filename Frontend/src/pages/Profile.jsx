import { useState } from "react";
import {
  Camera,
  PencilLine,
  User,
  UserCircle,
  Mail,
  AtSign,
  Film,
  Upload,
  Layers,
  ShieldCheck,
  VideoOff
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  getCurrentUserApi,
  updateAccountDetailsApi,
  updateAvatarApi,
  updateCoverImageApi,
} from "../api/auth.api";
import { getVideosApi } from "../api/video.api";
import { getUserPlaylistsApi } from "../api/playlist.api";
import EditProfileModal from "../components/EditProfileModal";
import ImageCropperModal from "../components/common/ImageCropperModal";
import VideoCard from "../components/video/VideoCard";

const Profile = () => {
  const location = useLocation();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropperConfig, setCropperConfig] = useState({
    isOpen: false,
    imageSrc: "",
    cropType: "avatar",
    fileName: "",
  });
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' | 'playlists' | 'settings'

  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUserApi,
    enabled: Boolean(user),
    select: (response) => response?.data,
  });

  const profile = data || user;

  // Fetch user's uploaded videos
  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ["user-videos", profile?._id],
    queryFn: () => getVideosApi({ page: 1, limit: 50, userId: profile?._id }),
    enabled: Boolean(profile?._id),
    select: (response) => response?.data?.videos ?? [],
  });

  // Fetch user's playlists
  const { data: playlistsData, isLoading: playlistsLoading } = useQuery({
    queryKey: ["user-playlists", profile?._id],
    queryFn: () => getUserPlaylistsApi(profile?._id),
    enabled: Boolean(profile?._id),
    select: (response) => response?.data ?? [],
  });

  const videos = videosData ?? [];
  const playlists = playlistsData ?? [];

  const handleSaveProfile = async (formData) => {
    try {
      const response = await updateAccountDetailsApi(formData);
      const updatedUser = response?.data;
      setUser(updatedUser);
      queryClient.setQueryData(["current-user"], { data: updatedUser });
      toast.success("Profile updated successfully!");
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    }
  };

  const handleFileSelect = (event, cropType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropperConfig({
        isOpen: true,
        imageSrc: reader.result,
        cropType,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleCroppedImage = async (croppedFile) => {
    const isAvatar = cropperConfig.cropType === "avatar";
    const file = croppedFile instanceof File
      ? croppedFile
      : new File(
        [croppedFile],
        isAvatar ? "avatar.jpg" : "cover.jpg",
        { type: "image/jpeg" }
      );

    const formData = new FormData();
    formData.append(isAvatar ? "avatar" : "coverImage", file);

    const uploadApi = isAvatar ? updateAvatarApi : updateCoverImageApi;
    const promise = uploadApi(formData);

    toast.promise(promise, {
      loading: isAvatar ? "Updating profile picture..." : "Updating cover banner...",
      success: (response) => {
        const updatedUser = response?.data;
        if (updatedUser) {
          setUser(updatedUser);
          queryClient.setQueryData(["current-user"], { data: updatedUser });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
        }
        setCropperConfig((prev) => ({ ...prev, isOpen: false }));
        return isAvatar ? "Avatar updated!" : "Cover banner updated!";
      },
      error: (error) => {
        return error?.response?.data?.message || "Failed to upload image";
      },
    });
  };

  if (!profile) {
    return (
      <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-4 my-10 max-w-lg mx-auto">
        <h2 className="font-display font-bold text-lg text-[#FAFAF8]">Sign In Required</h2>
        <p className="font-mono text-xs text-[#71717A]">
          Please sign in to view and manage your profile.
        </p>
        <Link
          to="/login"
          state={{ backgroundLocation: { pathname: "/" }, from: location }}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
        >
          <User size={13} />
          <span>Sign In</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Profile Header Container */}
      <div className="overflow-hidden rounded-lg border border-white/8 bg-[#121212]">
        {/* Cover Art Banner */}
        <div className="relative h-44 sm:h-56 lg:h-64 w-full overflow-hidden bg-[#18181B] border-b border-white/8 group">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[#18181B] flex items-center justify-center text-white/10 font-display font-black text-6xl">
              {profile.username?.slice(0, 1).toUpperCase()}
            </div>
          )}

          {/* Banner Upload Button Overlay */}
          <label className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-mono font-medium text-white backdrop-blur-md hover:bg-black/90 transition cursor-pointer">
            <Camera size={13} />
            <span>Update Banner</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "cover")}
            />
          </label>
        </div>

        {/* Identity Section */}
        <div className="px-6 sm:px-8 pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Avatar with Upload Badge */}
              <div className="relative -mt-14 sm:-mt-16 shrink-0 self-start rounded-full ring-4 ring-[#121212] bg-[#18181B] overflow-hidden group">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName || profile.username}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center bg-[#18181B] text-[#FAFAF8] text-2xl font-bold font-display">
                    {profile.username?.slice(0, 1).toUpperCase()}
                  </div>
                )}

                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, "avatar")}
                  />
                </label>
              </div>

              {/* User Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-black text-xl sm:text-2xl text-[#FAFAF8]">
                    {profile.fullName || profile.username}
                  </h1>
                  <ShieldCheck size={18} className="text-[#FF5A36]" />
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#71717A]">
                  <span className="text-[#A1A1AA]">@{profile.username}</span>
                  <span>•</span>
                  <span>{profile.email}</span>
                  <span>•</span>
                  <span>{videos.length} videos</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Action */}
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] px-3.5 py-2 text-xs font-mono text-[#FAFAF8] transition cursor-pointer"
              >
                <PencilLine size={13} />
                <span>Edit Profile</span>
              </button>

              <Link
                to="/upload"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-3.5 py-2 text-xs font-mono font-bold transition cursor-pointer shadow-sm"
              >
                <Upload size={13} />
                <span>Upload</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-4 border-t border-white/6 px-6 sm:px-8 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`py-3 transition border-b-2 cursor-pointer ${activeTab === "videos"
              ? "border-[#FF5A36] text-[#FF5A36] font-bold"
              : "border-transparent text-[#71717A] hover:text-[#FAFAF8]"
              }`}
          >
            Your Videos ({videos.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("playlists")}
            className={`py-3 transition border-b-2 cursor-pointer ${activeTab === "playlists"
              ? "border-[#FF5A36] text-[#FF5A36] font-bold"
              : "border-transparent text-[#71717A] hover:text-[#FAFAF8]"
              }`}
          >
            Your Playlists ({playlists.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`py-3 transition border-b-2 cursor-pointer ${activeTab === "settings"
              ? "border-[#FF5A36] text-[#FF5A36] font-bold"
              : "border-transparent text-[#71717A] hover:text-[#FAFAF8]"
              }`}
          >
            Account Details
          </button>
        </div>
      </div>

      {/* Tab 1: Your Videos */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          {videosLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="aspect-video w-full rounded-md bg-[#18181B] animate-pulse" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3">
              <VideoOff size={32} className="mx-auto text-[#71717A]" />
              <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
                You haven't uploaded any videos yet
              </h3>
              <p className="font-mono text-xs text-[#71717A] max-w-sm mx-auto">
                Share tutorials, code reviews, and presentations with your audience.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
              >
                <Upload size={13} />
                <span>Upload First Video</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Your Playlists */}
      {activeTab === "playlists" && (
        <div className="space-y-4">
          {playlistsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="aspect-video w-full rounded-md bg-[#18181B] animate-pulse" />
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3">
              <Layers size={32} className="mx-auto text-[#71717A]" />
              <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
                You haven't created any playlists yet
              </h3>
              <Link
                to="/playlists"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
              >
                Create Playlist
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {playlists.map((pl) => (
                <Link
                  key={pl._id}
                  to={`/playlists/${pl._id}`}
                  className="group rounded-lg border border-white/8 bg-[#121212] hover:bg-[#18181B] hover:border-white/16 p-4 transition space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#FAFAF8] group-hover:text-[#FF5A36] transition-colors">
                      {pl.name}
                    </h3>
                    <p className="font-sans text-xs text-[#71717A] line-clamp-2 mt-1">
                      {pl.description || "No description provided."}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/6 flex items-center justify-between font-mono text-[11px] text-[#71717A]">
                    <span>{pl.videos?.length || 0} videos</span>
                    <span className="text-[#FF5A36] group-hover:underline">View Playlist →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Account Details */}
      {activeTab === "settings" && (
        <div className="rounded-lg border border-white/8 bg-[#121212] p-6 space-y-4 max-w-xl">
          <div className="flex items-center justify-between border-b border-white/6 pb-3">
            <h2 className="font-display font-bold text-base text-[#FAFAF8]">
              Account Information
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-mono text-[#FF5A36] hover:underline cursor-pointer"
            >
              Edit Details
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-md bg-[#18181B] border border-white/6">
              <span className="text-[#71717A]">Full Name</span>
              <span className="text-[#FAFAF8] font-bold">{profile.fullName || "—"}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-[#18181B] border border-white/6">
              <span className="text-[#71717A]">Username</span>
              <span className="text-[#FAFAF8] font-bold">@{profile.username}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-[#18181B] border border-white/6">
              <span className="text-[#71717A]">Email Address</span>
              <span className="text-[#FAFAF8] font-bold">{profile.email}</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={profile}
        onSave={handleSaveProfile}
      />

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperConfig.isOpen}
        onClose={() => setCropperConfig((prev) => ({ ...prev, isOpen: false }))}
        imageSrc={cropperConfig.imageSrc}
        cropType={cropperConfig.cropType}
        onCropComplete={handleCroppedImage}
      />
    </div>
  );
};

export default Profile;
