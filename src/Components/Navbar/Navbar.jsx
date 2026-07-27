import React from "react";
import styles from "./Navbar.module.css";
import avatar from "../../assets/avatar.webp";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../Context/AuthContext";
import { formatLastSeen } from "../../services/userService";
import { usePresence } from "../../hooks/usePresence";

function Navbar({ selectedChat }) {
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

  if (!selectedChat) {
    return <div className={styles.navHidden}></div>;
  }
  return (
    <div className={styles.nav}>
      <div className={styles.Info}>
        <img src={avatar} />

        <div className={styles.subInfo}>
          <h2>{user?.Name || "Unknown"}</h2>

          <p className={styles.lastSeen}>
            {presence?.state === "online" ? "Online" :  formatLastSeen(presence?.lastChanged)}
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
