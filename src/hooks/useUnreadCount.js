import { useEffect, useState } from "react";
import { subscribeToUnreadCount } from "../services/MessagesService";

export function useUnreadCount(chatId, userId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!chatId || !userId) return;

    const unsubscribe = subscribeToUnreadCount(
      chatId,
      userId,
      (value) => {
        setCount(value);
      },
      (error) => {
        console.log(error);
      },
    );

    return unsubscribe;
  }, [chatId, userId]);

  return count;
}
