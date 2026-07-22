import React from "react";
import styles from "./ChatList.module.css";
import ChatItem from "../ChatItem/ChatItem";
import { useChats } from "../../hooks/useChats";
import { useAuth } from "../../Context/AuthContext";

function ChatList({ setSelectedChat }) {
const {user:currentUser}=useAuth();
  console.log(currentUser?.email);
  const { chats, loading, error } = useChats(currentUser?.uid);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div >
      <div className={styles.head}>
        <i className="fa-solid fa-bars"></i>
        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className={styles.Chats}>
        {chats?.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            setSelectedChat={setSelectedChat}
            currentUserId={currentUser?.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default ChatList;
