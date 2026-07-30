import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatMessage.module.css";
import { useAuth } from "../../Context/AuthContext";
import { useMessages } from "../../hooks/useMessages";
import { useSendMessage } from "../../hooks/useSendMessages";
import { useMarkMessagesSeen } from "../../hooks/useMarkMessagesSeen";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { useSendAudioMessage } from "../../hooks/useSendAudioMessage";
import AttachmentMenu from "../AttachmentMenu/AttachmentMenu";
import { useUser } from "../../hooks/useUser";
import { useBlockStatus } from "../../hooks/useBlockStatus";
import { highlightText } from "../../hooks/usehighlightText.jsx";
import {
  formatMessageDate,
  formatFullDate,
} from "../../hooks/useFormatMessageDate.js";
import MessageDetails from "../MessageDetails/MessageDetails.jsx";
function ChatMessages({ selectedChat, setSelectedChat, searchText }) {
  const { user: currentUser } = useAuth();

  const [messageText, setMessageText] = useState("");

  const messagesEndRef = useRef(null);

  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const { sendMessage: send } = useSendMessage();

  const { messages, loading, error } = useMessages(
    selectedChat?.id,
    currentUser?.uid,
  );

  const [selectedMessage, setSelectedMessage] = useState(null);

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

  const otherUserId = selectedChat?.members?.find(
    (id) => id !== currentUser?.uid,
  );

  const {
    blockedByMe,
    blockedMe,
    loading: blockLoading,
  } = useBlockStatus(currentUser?.uid, otherUserId);

  const filteredMessages = messages?.filter((message) => {
    if (!searchText.trim()) return true;
    if (message.type !== "text") return false;

    return message.text?.toLowerCase().includes(searchText.toLowerCase());
  });

  const getDayKey = (timestamp) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };
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
          {filteredMessages?.map((message, index) => {
            const currentDay = getDayKey(message.createdAt);

            const previousDay =
              index > 0
                ? getDayKey(filteredMessages[index - 1].createdAt)
                : null;

            const showDate = currentDay !== previousDay;

            return (
              //the react fragemnt to group the messages acoording to their sending date
              <React.Fragment key={message.id}>
                {showDate && (
                  <div className={styles.date}>
                    <span className={styles.dateLabel}>
                      {formatMessageDate(message.createdAt)}

                      <span className={styles.tooltip}>
                        {formatFullDate(message.createdAt)}
                      </span>
                    </span>
                  </div>
                )}
                <div className={styles.messageRow}>
                  {message.senderId === currentUser?.uid && (
                    <span
                      className={styles.infoButton}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <i className="fa-solid fa-circle-info"></i>
                    </span>
                  )}
                  <div
                    className={
                      message.senderId === currentUser?.uid
                        ? `${styles.message} ${styles.sent}`
                        : `${styles.message} ${styles.received}`
                    }
                  >
                    {message.type === "text" && (
                      <span className={styles.text}>
                        {highlightText(message.text, searchText)}
                      </span>
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
                </div>
              </React.Fragment>
            );
          })}
          {/* نقطة النزول للآخر */}
          <div ref={messagesEndRef}></div>
          {selectedMessage && (
            <MessageDetails
              message={selectedMessage}
              onClose={() => setSelectedMessage(null)}
            />
          )}
        </div>
      </div>
      {blockedByMe ? (
        <div className={styles.blockedMessage}>
          <i className="fa-solid fa-ban"></i>
          <span>You blocked this user. You can't send messages.</span>
        </div>
      ) : blockedMe ? (
        <div className={styles.blockedMessage}>
          <i className="fa-solid fa-ban"></i>

          <span>You are blocked by this user. You can't send messages.</span>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default ChatMessages;
