import { createChat } from "../services/ChatServices";

export function useCreateChat() {
  async function openChat(currentUserId, otherUserId) {
    const chat = await createChat(currentUserId, otherUserId);

    return chat;
  }

  return {
    openChat,
  };
}
