import { supabase } from "../lib/supabaseClient";

export function subscribeToOrderChanges(
  userId,
  isAdmin,
  callback
) {
  if (!userId) {
    return () => {};
  }

  const channelName = isAdmin
    ? "nutribasket-admin-orders"
    : `nutribasket-user-orders-${userId}`;

  let channel;

  if (isAdmin) {
    channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders"
        },
        (payload) => {
          callback(payload);
        }
      );
  } else {
    channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload);
        }
      );
  }

  channel.subscribe();

  return () => {
    supabase.removeChannel(
      channel
    );
  };
}