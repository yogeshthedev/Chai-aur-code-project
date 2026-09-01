import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import toast from "react-hot-toast";
import { toggleSubscriptionApi } from "../api/subscription.api";
import { useAuthStore } from "../store/useAuthStore";

const SubscribeButton = ({
  channelId,
  isSubscribed,
  subscriberCount,
  className = "",
  optimistic = true,
}) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => toggleSubscriptionApi(channelId),
    onMutate: async () => {
      if (!optimistic) return;

      await queryClient.cancelQueries({ queryKey: ["video"] });
      await queryClient.cancelQueries({ queryKey: ["channel"] });

      const prevVideo = queryClient.getQueryData(["video"]);
      const prevChannel = queryClient.getQueryData(["channel"]);

      queryClient.setQueriesData({ queryKey: ["video"] }, (oldData) => {
        if (!oldData?.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            owner: {
              ...oldData.data.owner,
              isSubscribed: !oldData.data.owner?.isSubscribed,
              subscriberCount: Math.max(
                0,
                (oldData.data.owner?.subscriberCount ?? 0) + (oldData.data.owner?.isSubscribed ? -1 : 1)
              ),
            },
          },
        };
      });

      queryClient.setQueriesData({ queryKey: ["channel"] }, (oldData) => {
        if (!oldData?.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            isSubscribed: !oldData.data.isSubscribed,
            subscribersCount: Math.max(
              0,
              (oldData.data.subscribersCount ?? 0) + (oldData.data.isSubscribed ? -1 : 1)
            ),
          },
        };
      });

      return { prevVideo, prevChannel };
    },
    onError: (err, _, context) => {
      if (context?.prevVideo) {
        queryClient.setQueryData(["video"], context.prevVideo);
      }
      if (context?.prevChannel) {
        queryClient.setQueryData(["channel"], context.prevChannel);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["video"] });
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      queryClient.invalidateQueries({ queryKey: ["channel-videos"] });
    },
  });

  const handleClick = () => {
    if (!user) {
      toast.error("Please sign in to subscribe to channels");
      return;
    }
    mutation.mutate();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={mutation.isPending}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-mono transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50 ${
        isSubscribed
          ? "bg-[#18181B] text-[#FAFAF8] border border-white/10 hover:bg-[#222226]"
          : "bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] font-bold shadow-xs"
      } ${className}`}
    >
      {isSubscribed ? <Check size={13} className="text-[#2DD4BF]" /> : <Bell size={13} />}
      <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
      {subscriberCount !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
            isSubscribed
              ? "bg-white/10 text-[#A1A1AA]"
              : "bg-black/20 text-[#0A0A0A] font-bold"
          }`}
        >
          {subscriberCount}
        </span>
      )}
    </button>
  );
};

export default SubscribeButton;
