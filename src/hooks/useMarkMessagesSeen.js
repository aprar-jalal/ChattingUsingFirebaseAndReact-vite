import { useEffect } from "react";
import { markMessagesAsSeen } from "../services/MessagesService";

export function useMarkMessagesSeen(chatId, userId) {
  useEffect(() => {
    if (!chatId || !userId) return;

    markMessagesAsSeen(chatId, userId);
  }, [chatId, userId]);
}
