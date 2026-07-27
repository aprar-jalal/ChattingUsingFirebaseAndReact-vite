import { useState } from "react";
import { uploadFile } from "../services/uploadFile";
import { useSendMessage } from "./useSendMessages";

export function useUploadAttachment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { sendMessage } = useSendMessage();

  async function uploadAttachment(
    selectedChat,
    currentUserId,
    file,
    uploadType,
    messageType,
  ) {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const url = await uploadFile(file, uploadType);
      await sendMessage(selectedChat, currentUserId, {
        type: messageType,
        text: null,
        fileURL: url,
      });

      return url;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    uploadAttachment,
    loading,
    error,
  };
}