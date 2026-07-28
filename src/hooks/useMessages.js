import { useEffect, useState } from "react";
import { subscribeToMessages } from "../services/MessagesService";

export function useMessages(chatId, userId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chatId || !userId) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(
      chatId,

      (data) => {
        setMessages(data);
        setLoading(false);
      },

      (error) => {
        setError(error);
        setLoading(false);
      },

      userId,
    );

    return unsubscribe;
  }, [chatId, userId]);

  return {
    messages,
    loading,
    error,
  };
}
