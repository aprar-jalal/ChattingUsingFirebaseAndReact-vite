import React, { useState } from "react";
import styles from "./ChatList.module.css";
import ChatItem from "../ChatItem/ChatItem";
import { useChats } from "../../hooks/useChats";
import { useAuth } from "../../Context/AuthContext";
import { useSearchUsers } from "../../hooks/useSearchUsers";
import { useCreateChat } from "../../hooks/useCreateChat";
import avatar from "../../assets/avatar.webp";
import Settings from "../Settings/Settings";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";

function ChatList({ setSelectedChat }) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [searchText, setSearchText] = useState("");
  const { users: searchResults, search, clearSearch } = useSearchUsers();
  const { openChat } = useCreateChat();
  const [showSettings, setShowSettings] = useState(false);
  async function handleOpenChat(user) {
    const chat = await openChat(currentUser.uid, user.id);

    setSelectedChat(chat);
    clearSearch();
    setSearchText("");
  }

  const { chats, loading, error } = useChats(currentUser?.uid);

  const [showList, setShowList] = useState(false);

  async function handleLogout(){
     try {
    await signOut(auth);
    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
  }
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

if (!currentUser) {
  return null;
}
  return (
    <div>
      <div className={styles.head}>
        <div className={styles.wrapper}>
          <i
            onClick={() => setShowList((prev) => !prev)}
            className="fa-solid fa-bars"
          ></i>
          {showList && (
            <div className={styles.dropdown}>
              <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
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

      {!showSettings && searchResults.length > 0 && (
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
      {!showSettings ? (
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
      ) : (
        <Settings userId={currentUser.uid} />
      )}
      <div
        className={styles.Settings}
        onClick={() => setShowSettings((prev) => !prev)}
      >
        <span>
          {showSettings ? (
            <span>
              <i className="fa-regular fa-comment-dots"></i>Chats
            </span>
          ) : (
            <span>
              <i className="fa-solid fa-gear"></i>Settings
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default ChatList;
