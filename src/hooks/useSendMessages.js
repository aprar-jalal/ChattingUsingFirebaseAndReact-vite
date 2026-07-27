import { createMessage } from "../services/MessagesService";

export function useSendMessage() {
  async function sendMessage(chat, currentUserId,  messageData) {
    return await createMessage(chat, currentUserId,  messageData);
  }

  return {
    sendMessage,
  };
}
