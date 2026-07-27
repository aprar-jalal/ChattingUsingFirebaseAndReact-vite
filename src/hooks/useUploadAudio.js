import { useState } from "react";
import { uploadFile } from "../services/uploadFile";
export function useUploadAudio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  async function upload(audioBlob) {
    setLoading(true);
    setError(null);

    try {
      const url = await uploadFile(audioBlob, "video");

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
