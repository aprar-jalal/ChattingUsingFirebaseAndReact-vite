import React, { useState } from "react";
import styles from "./ChatMessage.module.css";
import { useAuth } from "../../Context/AuthContext";
import { useMessages } from "../../hooks/useMessages";
import { useSendMessage } from "../../hooks/useSendMessages";
import { useMarkMessagesSeen } from "../../hooks/useMarkMessagesSeen";

function ChatMessages({ selectedChat }) {
  const { user: currentUser } = useAuth();
  const [messageText, setMessageText] = useState("");
  const { sendMessage: send } = useSendMessage();
  const { messages, loading, error } = useMessages(selectedChat?.id);
  useMarkMessagesSeen(selectedChat?.id, currentUser?.uid);

  async function handleSendMessage() {
    if (!messageText.trim()) return;

    await send(
      selectedChat.id,

      {
        text: messageText,
        senderId: currentUser.uid,
        seen: false,
        verified: false,
      },
    );

    setMessageText("");
  }

  if (!selectedChat) {
    return <p>Select a Chat ...</p>;
  }

  if (loading) {
    return <p>Loading messages...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className={styles.chat}>
      <div className={styles.messagesContainer}>
        <div className={styles.messages}>
          <div className={styles.date}>
            <span className={styles.today}>Today</span>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.senderId === currentUser?.uid
                  ? `${styles.message} ${styles.sent}`
                  : `${styles.message} ${styles.received}`
              }
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <button className={styles.emojiButton}>
            <i className="fa-regular fa-face-smile"></i>
          </button>

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

          <button className={styles.sendButton} onClick={handleSendMessage}>
            <i className="fa-solid fa-location-arrow"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
