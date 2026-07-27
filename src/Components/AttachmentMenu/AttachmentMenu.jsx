import React from "react";
import styles from "./AttachmentMenu.module.css";
import { useUploadAttachment } from "../../hooks/useUploadAttachment";

function AttachmentMenu({
  setShowAttachmentMenu,
  selectedChat,
  currentUserId,
}) {
  const {
    uploadAttachment,
    loading,
    error,
  } = useUploadAttachment();

  async function handleFileChange(e, uploadType, messageType) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadAttachment(
        selectedChat,
        currentUserId,
        file,
        uploadType,
        messageType,
      );

      setShowAttachmentMenu(false);
    } catch (error) {
      console.error("Attachment upload failed:", error);
    }
  }

  return (
    <div className={styles.attachmentMenu}>
      <label>
        <i className="fa-solid fa-image"></i>
        <span>Image</span>

        <input
          type="file"
          accept="image/*"
          hidden
          disabled={loading}
          onChange={(e) =>
            handleFileChange(e, "image", "image")
          }
        />
      </label>

    
      <label>
        <i className="fa-solid fa-file"></i>
        <span>File</span>
        <input
          type="file"
          hidden
          disabled={loading}
          onChange={(e) =>
            handleFileChange(e, "raw", "file")
          }
        />
      </label>

      
      <label>
        <i className="fa-solid fa-video"></i>
        <span>Video</span>
        <input
          type="file"
          accept="video/*"
          hidden
          disabled={loading}
          onChange={(e) =>
            handleFileChange(e, "video", "video")
          }
        />
      </label>

      {loading && (
        <i className="fa-solid fa-spinner fa-spin"></i>
      )}

      {error && (
        <p>{error.message}</p>
      )}

    </div>
  );
}

export default AttachmentMenu;