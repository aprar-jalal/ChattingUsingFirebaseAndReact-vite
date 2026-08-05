import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import avatar from "../../assets/avatar.webp";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../Context/AuthContext";
import { formatLastSeen } from "../../services/userService";
import { usePresence } from "../../hooks/usePresence";
import { useBlockUser } from "../../hooks/useBlock";
import { useBlockStatus } from "../../hooks/useBlockStatus";

function Navbar({
  selectedChat,
  searchMode,
  setSearchMode,
  searchText,
  setSearchText,
  startCall,
}) {
  // who is the current user
  const { user: currentUser } = useAuth();
  // the other user id
  const otherUserId = selectedChat?.members?.find(
    (id) => id !== currentUser?.uid,
  );
  // the other user status
  const presence = usePresence(otherUserId);
  // fetching other user data
  const { user: firestoreUser } = useUser(otherUserId);

  const user = selectedChat?.user || firestoreUser;

  const [clickedDots, setClickedDots] = useState(false);
  const { block, unblock, loading } = useBlockUser();
  const { blockedByMe, blockedMe } = useBlockStatus(
    currentUser?.uid,
    otherUserId,
  );
  function showList() {
    setClickedDots((prev) => !prev);
  }

  async function handleBlock() {
    await block(currentUser.uid, otherUserId);
    setClickedDots(false);
  }

  async function handleUnBlock() {
    await unblock(currentUser.uid, otherUserId);
    setClickedDots(false);
  }

  if (!selectedChat) {
    return <div className={styles.navHidden}></div>;
  }
  return (
    <div className={styles.nav}>
      <div className={styles.Info}>
        <img src={user?.photoURL || avatar} />

        <div className={styles.subInfo}>
          <h2>{user?.Name || "Unknown"}</h2>

          <p className={styles.lastSeen}>
            {presence?.state === "online"
              ? "Online"
              : formatLastSeen(presence?.lastChanged)}
          </p>
        </div>
      </div>

      <div className={styles.icons}>
        {searchMode && (
          <input
            type="text"
            placeholder="Search messages..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
            autoFocus
          />
        )}

        <i
          className="fa-solid fa-magnifying-glass"
          onClick={() => setSearchMode((prev) => !prev)}
        ></i>
        <i
          className="fa-solid fa-phone"
          onClick={() => {
            startCall(currentUser.uid, otherUserId);
          }}
        ></i>
        <div className={styles.menuWrapper}>
          <button
            type="button"
            className={styles.dotsButton}
            onClick={showList}
            disabled={loading}
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
          {clickedDots && (
            <div className={styles.dropdown}>
              {blockedByMe ? (
                <button
                  type="button"
                  className={styles.blockButton}
                  onClick={handleUnBlock}
                >
                  <i className="fa-solid fa-unlock"></i>

                  <span>Unblock</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.blockButton}
                  onClick={handleBlock}
                >
                  <i className="fa-solid fa-ban"></i>

                  <span>Block</span>
                </button>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default Navbar;
