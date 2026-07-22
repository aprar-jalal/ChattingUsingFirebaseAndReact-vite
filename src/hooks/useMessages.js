import { useEffect, useState } from "react";
import { subscribeToMessages } from "../services/MessagesService";

export function useMessages(chatId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chatId) {
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
    );
    return unsubscribe;
  }, [chatId]);

  return {
    messages,
    loading,
    error,
  };
}


