import { createMessage } from "../services/MessagesService";

export function useSendMessage() {
  async function sendMessage(chat, currentUserId, messageText) {
    return await createMessage(chat, currentUserId, messageText);
  }

  return {
    sendMessage,
  };
}
