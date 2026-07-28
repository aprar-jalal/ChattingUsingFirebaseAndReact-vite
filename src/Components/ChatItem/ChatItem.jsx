import React from "react";
import styles from "../ChatList/ChatList.module.css";
import avatar from "../../assets/avatar.webp";
import { useUser } from "../../hooks/useUser";
import { useUnreadCount } from "../../hooks/useUnreadCount";
function ChatItem({ chat, currentUserId, setSelectedChat }) {
  const otherUserId = chat.members.find((id) => id !== currentUserId);

  const { user, loading } = useUser(otherUserId);
  const unreadCount = useUnreadCount(chat.id, currentUserId);

  return (
    <div className={styles.Chat} onClick={() => setSelectedChat(chat)}>
      <div className={styles.Info}>
        <img src={user?.photoURL || avatar} />
        <div className={styles.subInfo}>
          <div className={styles.subInfoHeading}>
            <div className={styles.subInfoSubHeading}>
              <h2>{user?.Name}</h2>
              {user?.verified && <img src="src/assets/verified.png" />}
            </div>
            <p>
              {chat.updatedAt?.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className={styles.MessageInfo}>
            <p className={styles.lastMessage}>{chat.lastMessage}</p>
            {unreadCount > 0 && (
              <p className={styles.MessageCounter}>{unreadCount}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
