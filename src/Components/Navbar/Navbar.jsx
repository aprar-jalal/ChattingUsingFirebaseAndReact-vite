import React from "react";
import styles from "./Navbar.module.css";
function Navbar() {
  return (
    <div className={styles.nav}>
      <div className={styles.Info}>
        <img src="src\assets\react.svg" />
        <div className={styles.subInfo}>
          <h2>Name</h2>
          <p className={styles.lastSeen}>last seen</p>
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
