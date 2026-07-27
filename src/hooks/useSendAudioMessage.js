import { useState } from "react";
import { useUploadAudio } from "./useUploadAudio";
import { useSendMessage } from "./useSendMessages";

export function useSendAudioMessage() {
  const { upload } = useUploadAudio();
  const { sendMessage } = useSendMessage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendAudio(chat, userId, audioBlob) {
    setLoading(true);
    setError(null);

    try {
      // 1. Upload Blob to Cloudinary
      const audioURL = await upload(audioBlob);

      // 2. Save audio message in Firestore
      await sendMessage(chat, userId, {
        type: "audio",
        text: null,
        audioURL,
      });

      return audioURL;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    sendAudio,
    loading,
    error,
  };
}