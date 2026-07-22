import { useEffect } from "react";
import { markMessagesAsSeen } from "../services/MessagesService";

export function useMarkMessagesSeen(chatId, userId, messages) {
  useEffect(() => {
    if (!chatId || !userId || !messages) return;

    markMessagesAsSeen(chatId, userId);
  }, [chatId, userId, messages.length]);
}
