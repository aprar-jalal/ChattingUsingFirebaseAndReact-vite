import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatMessage.module.css";

import { useAuth } from "../../Context/AuthContext";
import { useMessages } from "../../hooks/useMessages";
import { useSendMessage } from "../../hooks/useSendMessages";
import { useMarkMessagesSeen } from "../../hooks/useMarkMessagesSeen";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { useSendAudioMessage } from "../../hooks/useSendAudioMessage";
import AttachmentMenu from "../AttachmentMenu/AttachmentMenu";

function ChatMessages({ selectedChat, setSelectedChat }) {
  const { user: currentUser } = useAuth();

  const [messageText, setMessageText] = useState("");

  const messagesEndRef = useRef(null);

  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const { sendMessage: send } = useSendMessage();

  const { messages, loading, error } = useMessages(
    selectedChat?.id,
    currentUser?.uid,
  );

  // to be sure that this is audio is sent to this chat even if the user changes between chats before the audio is sent
  const recordingChatRef = useRef(null);

  //Recording
  const { startRecording, stopRecording, isRecording, audioBlob, clearAudio } =
    useAudioRecorder();

  //sending recored into firebase
  const {
    sendAudio,
    loading: audioUploading,
    error: audioError,
  } = useSendAudioMessage();

  //when i open the chat change the status to the seen status
  useMarkMessagesSeen(selectedChat?.id, currentUser?.uid);

  // Scroll to the last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSendMessage() {
    if (!messageText.trim()) return;

    await send(selectedChat, currentUser.uid, {
      type: "text",
      text: messageText,
      fileURL: null,
    });

    setMessageText("");
  }

  async function handleRecording() {
    if (isRecording) {
      await stopRecording();
    } else {
      recordingChatRef.current = selectedChat;
      startRecording();
    }
  }

  useEffect(() => {
    if (!audioBlob || !recordingChatRef.current || !currentUser?.uid) {
      return;
    }
    async function handleAudioMessage() {
      try {
        const chat = recordingChatRef.current;
        await sendAudio(chat, currentUser.uid, audioBlob);
        console.log("Audio message sent successfully");
        clearAudio();
        recordingChatRef.current = null;
      } catch (error) {
        console.error("Audio message failed:", error);
      }
    }
    handleAudioMessage();
  }, [audioBlob, currentUser?.uid]);

  if (!selectedChat) {
    return null;
  }

  if (loading) {
    return <p>Loading messages...</p>;
  }

  if (error || audioError) {
    return <p>{(error || audioError).message}</p>;
  }
  return (
    <div className={styles.chat}>
      <div className={styles.messagesContainer}>
        <div className={styles.messages}>
          <div className={styles.date}>
            <span className={styles.today}>Today</span>
          </div>

          {messages?.map((message) => (
            <div
              key={message.id}
              className={
                message.senderId === currentUser?.uid
                  ? `${styles.message} ${styles.sent}`
                  : `${styles.message} ${styles.received}`
              }
            >
              {message.type === "text" && (
                <span className={styles.text}>{message.text}</span>
              )}

              {message.type === "audio" && (
                <audio
                  controls
                  src={message.fileURL}
                  className={styles.audio}
                />
              )}

              {message.type === "image" && (
                <img
                  src={message.fileURL}
                  alt="Sent image"
                  className={styles.messageImage}
                />
              )}

              {message.type === "video" && (
                <video
                  controls
                  src={message.fileURL}
                  className={styles.messageVideo}
                />
              )}

              {message.type === "file" && (
                <a
                  href={message.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.messageFile}
                >
                  <i className="fa-solid fa-file"></i>
                  <span>Open file</span>
                </a>
              )}

              {/* status يظهر فقط لرسائلي */}
              {message.senderId === currentUser?.uid && (
                <span className={styles.status}>
                  {message.status === "sent" && (
                    <i className="fa-solid fa-check"></i>
                  )}

                  {message.status === "delivered" && (
                    <i
                      className={`fa-solid fa-check-double ${styles.delivered}`}
                    ></i>
                  )}

                  {message.status === "seen" && (
                    <i
                      className={`fa-solid fa-check-double ${styles.seen}`}
                    ></i>
                  )}
                </span>
              )}
            </div>
          ))}

          {/* نقطة النزول للآخر */}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <button
            type="button"
            className={styles.emojiButton}
            onClick={() => setShowAttachmentMenu((prev) => !prev)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
          {showAttachmentMenu && (
            <AttachmentMenu
              setShowAttachmentMenu={setShowAttachmentMenu}
              selectedChat={selectedChat}
              currentUserId={currentUser.uid}
            />
          )}
          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />

          <button
            className={styles.recordButton}
            type="button"
            disabled={audioUploading}
            onClick={handleRecording}
          >
            <i
              className={
                audioUploading
                  ? "fa-solid fa-spinner fa-spin"
                  : isRecording
                    ? "fa-solid fa-stop"
                    : "fa-solid fa-microphone"
              }
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
