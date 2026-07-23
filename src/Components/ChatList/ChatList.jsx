import React, { useState } from "react";
import styles from "./ChatList.module.css";
import ChatItem from "../ChatItem/ChatItem";
import { useChats } from "../../hooks/useChats";
import { useAuth } from "../../Context/AuthContext";
import { useSearchUsers } from "../../hooks/useSearchUsers";
import { useCreateChat } from "../../hooks/useCreateChat";
import avatar from "../../assets/avatar.webp";

function ChatList({ setSelectedChat }) {
  const { user: currentUser } = useAuth();
  const [searchText, setSearchText] = useState("");
  const { users: searchResults, search, clearSearch } = useSearchUsers();
  const { openChat } = useCreateChat();
  async function handleOpenChat(user) {
    const chat = await openChat(currentUser.uid, user.id);

    setSelectedChat(chat);
    clearSearch();
    setSearchText("");
  }

  const { chats, loading, error } = useChats(currentUser?.uid);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <div className={styles.head}>
        <i className="fa-solid fa-bars"></i>

        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass"></i>

          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);

              search(e.target.value);
            }}
          />
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className={styles.SearchResults}>
          {searchResults.map((user) => (
            <div
              key={user.id}
              onClick={() => handleOpenChat(user)}
              className={styles.searchUser}
            >
              <img
                src={user.photoURL || avatar}
                className={styles.searchAvatar}
              />

              <span>{user.Name}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.Chats}>
        {chats?.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            setSelectedChat={setSelectedChat}
            currentUserId={currentUser.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default ChatList;
