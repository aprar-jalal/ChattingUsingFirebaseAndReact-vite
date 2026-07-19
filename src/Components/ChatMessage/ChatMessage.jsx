import React from "react";
import styles from "./ChatMessage.module.css";

const messages = [
  {
    id: 1,
    text: "OMG do you remember what you did last night?",
    senderId: "friend",
  },
  {
    id: 2,
    text: "no haha",
    senderId: "me",
  },
  {
    id: 3,
    text: "I don't remember anything ",
    senderId: "me",
  },
];

function ChatMessages() {
  const currentUserId = "me";
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
                message.senderId === currentUserId
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
          <input type="text" placeholder="Type a message..." />

          <button className={styles.sendButton}>
            <i class="fa-solid fa-location-arrow"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ChatMessages;
