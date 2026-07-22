import React from "react";
import styles from "./Navbar.module.css";
import avatar from "../../assets/avatar.webp";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../Context/AuthContext";

function Navbar({ selectedChat }) {
  const { user: currentUser } = useAuth();

  const otherUserId = selectedChat?.members?.find(
    (id) => id !== currentUser?.uid,
  );

  const { user: firestoreUser } = useUser(otherUserId);

  const user = selectedChat?.user || firestoreUser;

  if (!selectedChat) {
    return <div className={styles.nav}>Select Chat</div>;
  }
console.log("selectedChat", selectedChat);
console.log("user", user);
  return (
    <div className={styles.nav}>
      <div className={styles.Info}>
        <img src={ avatar} />

        <div className={styles.subInfo}>
          <h2>{user?.Name || "Unknown"}</h2>

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
