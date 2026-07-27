import { useState } from "react";
import { uploadAudio } from "../services/audioService";

export function useUploadAudio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  async function upload(audioBlob) {
    setLoading(true);
    setError(null);

    try {
      const url = await uploadAudio(audioBlob);

      setAudioUrl(url);

      return url;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    upload,
    audioUrl,
    loading,
    error,
  };
}