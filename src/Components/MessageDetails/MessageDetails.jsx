import React from "react";
import styles from "./MessageDetails.module.css";
import { formatFullDate } from "../../hooks/useFormatMessageDate";

function MessageDetails({ message, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>Message details</h3>

          <button onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className={styles.details}>
          <div className={`${styles.detail} ${styles.sent}`}>
            <i className="fa-solid fa-paper-plane"></i>

            <div>
              <span className={styles.sent}>Sent</span>
              <p>{formatFullDate(message.createdAt)}</p>
            </div>
          </div>

          {message.deliveredAt && (
            <div className={`${styles.detail} ${styles.delevired}`}>
              <i className="fa-solid fa-check-double"></i>

              <div>
                <span className={styles.delevired}>Delivered</span>
                <p>{formatFullDate(message.deliveredAt)}</p>
              </div>
            </div>
          )}

          {message.seenAt && (
            <div className={`${styles.detail} ${styles.seen}`}>
              <i className="fa-solid fa-eye"></i>

              <div>
                <span className={styles.seen}>Seen</span>
                <p>{formatFullDate(message.seenAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageDetails;