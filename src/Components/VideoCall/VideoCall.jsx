import React, { useEffect, useRef } from "react";
import styles from "./VideoCall.module.css";
import { useAuth } from "../../Context/AuthContext";
import { useUser } from "../../hooks/useUser";

function VideoCall({
  onClose,
  localStream,
  remoteStream,
  toggleCamera,
  toggleMic,
  isMuted,
  cameraOn,
  remoteCameraOn,
  userPhoto,
  userName,
  selectedChat
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
   const { user: currentUser } = useAuth();
    // the other user id
    const otherUserId = selectedChat?.members?.find(
      (id) => id !== currentUser?.uid,
    );
   const { user: otherUser } = useUser(otherUserId);
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play();
    }
  }, [remoteStream]);
  return (
    <div className={styles.overlay}>
      <div className={styles.callContainer}>
        <div className={styles.videoContainer}>
          {remoteCameraOn && remoteStream ? (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={styles.remoteVideo}
              />

              {cameraOn && (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  className={styles.localVideo}
                />
              )}
            </>
          ) : (
            <div className={styles.audioCallScreen}>
              <img src={otherUser.photoURL || "/avatar.png"} className={styles.avatar} />

              <h2 className={styles.userName}>{otherUser.Name}</h2>

              <p className={styles.callTimer}>00:00</p>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <button className={styles.controlButton} onClick={toggleMic}>
            <i
              className={
                isMuted
                  ? "fa-solid fa-microphone-slash"
                  : "fa-solid fa-microphone"
              }
            />
          </button>

          <button className={styles.controlButton} onClick={toggleCamera}>
            <i
              className={
                cameraOn ? "fa-solid fa-video" : "fa-solid fa-video-slash"
              }
            />
          </button>

          <button className={styles.endButton} onClick={onClose}>
            <i className="fa-solid fa-phone-slash" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
