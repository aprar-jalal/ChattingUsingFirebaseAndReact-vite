import React from "react";
import styles from "./Navbar.module.css";
import { doc } from "firebase/firestore";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../Context/AuthContext";
function Navbar({ selectedChat }) {
 const { user: currentUser } = useAuth();
  const otherUserId = selectedChat?.members?.find(
    (id) => id !== currentUser?.uid,
  );

  const {
    user,
    loading
  } = useUser(otherUserId);

  if (!selectedChat) {
    return <div className={styles.nav}>Select Chat</div>;
  }

  return (
    <div className={styles.nav}>
      <div className={styles.Info}>
        <img src={user?.photoURL || "src/assets/avatar.webp"} />

        <div className={styles.subInfo}>
          <h2>{user?.Name || "Select Chat"}</h2>

          <p className={styles.lastSeen}>
            {user?.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className={styles.icons}>
        <i className="fa-solid fa-magnifying-glass"></i>

        <i className="fa-solid fa-phone"></i>

        <i className="fa-solid fa-ellipsis-vertical"></i>
      </div>
    </div>
  );
}

export default Navbar;
