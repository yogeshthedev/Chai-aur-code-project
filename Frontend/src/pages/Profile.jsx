import { useState } from "react";
import { Camera, PencilLine, UserCircle, Mail, AtSign, Tv } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { getCurrentUserApi, updateAccountDetailsApi, updateAvatarApi, updateCoverImageApi } from "../api/auth.api";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUserApi,
    enabled: !!user,
    select: (response) => response?.data,
  });

  const profile = data || user;

  const handleSaveProfile = async (formData) => {
    try {
      const response = await updateAccountDetailsApi(formData);
      const updatedUser = response?.data;
      setUser(updatedUser);
      queryClient.setQueryData(["current-user"], { data: updatedUser });
      toast.success("Profile updated successfully!");
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to update profile";
      toast.error(message);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await updateAvatarApi(file);
      const updatedUser = response?.data;
      setUser(updatedUser);
      queryClient.setQueryData(["current-user"], { data: updatedUser });
      toast.success("Avatar updated successfully!");
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to update avatar";
      toast.error(message);
    }
  };

  const handleCoverChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await updateCoverImageApi(file);
      const updatedUser = response?.data;
      setUser(updatedUser);
      queryClient.setQueryData(["current-user"], { data: updatedUser });
      toast.success("Cover banner updated successfully!");
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to update cover photo";
      toast.error(message);
    }
  };

  if (isLoading && !profile) {
    return <div className="h-64 animate-pulse rounded-3xl bg-zinc-200/80 dark:bg-zinc-800/80" />;
  }

  if (!profile) {
    return (
      <div className="rounded-3xl border border-red-200/80 bg-red-50/50 p-6 text-center text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
        You need to be signed in to view your channel profile.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Profile Header Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm">
        {/* Cover Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900 md:h-56">
          {profile.coverImage ? (
            <img src={profile.coverImage} alt="Cover" className="h-full w-full object-cover" />
          ) : null}

          <label className="absolute right-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/80 active:scale-95">
            <Camera size={14} />
            <span>Edit Cover</span>
            <input type="file" accept="image/*" hidden onChange={handleCoverChange} />
          </label>
        </div>

        {/* Profile Info Bar */}
        <div className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {/* Avatar with Camera badge */}
              <div className="relative -mt-14 shrink-0 rounded-full ring-4 ring-white dark:ring-zinc-900 bg-white dark:bg-zinc-900 shadow-md">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="h-24 w-24 rounded-full object-cover md:h-28 md:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 md:h-28 md:w-28 text-2xl font-bold">
                    {profile.username?.slice(0, 1).toUpperCase() || <UserCircle size={40} />}
                  </div>
                )}

                <label className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 active:scale-95 transition">
                  <Camera size={14} />
                  <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </label>
              </div>

              <div className="mb-1">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  {profile.fullName || profile.username}
                </h1>
                <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">@{profile.username}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700 px-4 py-2 text-xs font-semibold shadow-xs hover:opacity-90 active:scale-95 transition self-start sm:self-auto cursor-pointer"
            >
              <PencilLine size={14} />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            <Mail size={14} className="text-red-500" />
            <span>Email</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
            {profile.email || "Not available"}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            <AtSign size={14} className="text-red-500" />
            <span>Username</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
            @{profile.username || "Not available"}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            <Tv size={14} className="text-red-500" />
            <span>Channel Handle</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
            video.tube/@{profile.username || "channel"}
          </p>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
