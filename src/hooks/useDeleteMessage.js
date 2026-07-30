import {
  deleteMessageForMe,
  deleteMessageForEveryone,
} from "../services/MessagesService";

export function useDeleteMessage() {
  async function deleteForMe(chatId, messageId, userId) {
    try {
      await deleteMessageForMe(chatId, messageId, userId);
    } catch (error) {
      console.error("Delete for me failed:", error);
      throw error;
    }
  }

  async function deleteForEveryone(chatId, messageId, userId) {
    try {
      await deleteMessageForEveryone(chatId, messageId, userId);
    } catch (error) {
      console.error("Delete for everyone failed:", error);
      throw error;
    }
  }

  return {
    deleteForMe,
    deleteForEveryone,
  };
}