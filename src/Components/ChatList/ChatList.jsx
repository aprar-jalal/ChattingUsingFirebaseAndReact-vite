import React from "react";
import styles from "./ChatList.module.css";
function ChatList() {
  return (
    <div>
      <div className={styles.head}>
        <i className="fa-solid fa-bars"></i>
        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <div className={styles.Chats}>
        <div className={styles.Info}>
          <img src="src\assets\react.svg" />
          <div className={styles.subInfo}>
            <div className={styles.subInfoHeading}>
              <div className={styles.subInfoSubHeading}>
                <h2>Name</h2>
                <img src="src\assets\verified.png" />
              </div>
              <p>19:48</p>
            </div>
             <div className={styles.MessageInfo}>
                <p className={styles.lastMessage}>last Message</p>
                <p className={styles.MessageCounter}>1</p>
             </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatList;
