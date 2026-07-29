import React, { useState } from "react";
import styles from "./Chat.module.css";
import Navbar from "./../../Components/Navbar/Navbar";
import ChatList from "../../Components/ChatList/ChatList";
import ChatMessages from "../../Components/ChatMessage/ChatMessage";
function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  return (
    <div className={styles.Container}>
      <div>
        <ChatList setSelectedChat={setSelectedChat} />
      </div>
      <div className={styles.ChatArea}>
        <Navbar
          selectedChat={selectedChat}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <ChatMessages
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          searchText={searchText}
        />
      </div>
    </div>
  );
}

export default Chat;
