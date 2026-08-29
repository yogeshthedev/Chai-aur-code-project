import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, BellRing, Check } from "lucide-react";
import { toggleSubscriptionApi } from "../api/subscription.api";

const SubscribeButton = ({
  channelId,
  isSubscribed,
  subscriberCount,
  className = "",
  optimistic = true,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => toggleSubscriptionApi(channelId),
    onMutate: async () => {
      if (!optimistic) return;

      await queryClient.cancelQueries({ queryKey: ["video"] });
      await queryClient.cancelQueries({ queryKey: ["channel"] });

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video"] });
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      queryClient.invalidateQueries({ queryKey: ["channel-videos"] });
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 ${
        isSubscribed
          ? "bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
          : "bg-red-600 text-white shadow-sm shadow-red-500/20 hover:bg-red-700"
      } ${className}`}
    >
      {isSubscribed ? <Check size={15} className="text-slate-600 dark:text-zinc-400" /> : <Bell size={15} />}
      <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
      {subscriberCount !== undefined && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            isSubscribed
              ? "bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300"
              : "bg-red-700/60 text-white"
          }`}
        >
          {subscriberCount}
        </span>
      )}
    </button>
  );
};

export default SubscribeButton;


