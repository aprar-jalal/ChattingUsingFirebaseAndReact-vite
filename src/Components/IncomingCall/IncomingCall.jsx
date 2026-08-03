import React from "react";
import styles from "./IncomingCall.module.css";

function IncomingCall({
  call,
  onAccept,
  onDecline,
}) {

  if (!call) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <i className="fa-solid fa-phone-volume"></i>
        <h2>
          Incoming Call
        </h2>
        <p>
          Someone is calling you...
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