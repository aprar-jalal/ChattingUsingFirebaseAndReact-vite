import React from "react";
import styles from "./IncomingCall.module.css";
import { useAuth } from "../../Context/AuthContext";

function IncomingCall({
  call,
  onAccept,
  onDecline,
}) {

  if (!call) return null;
  const {user}=useAuth()
  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <i className="fa-solid fa-phone-volume"></i>
        <h2 className={styles.headingText}>
          Incoming Call
        </h2>
        <p className={styles.subHeadingText}>
          {user.Name || <p>someone Is Calling...</p>}
        </p>
        <div className={styles.buttons}>
          <button
            className={styles.accept}
            onClick={() => onAccept(call)}
          >
            Accept
          </button>
          <button
            className={styles.decline}
            onClick={() => onDecline(call.id)}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCall;