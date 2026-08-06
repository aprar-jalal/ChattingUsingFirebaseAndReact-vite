import React, { useEffect, useRef, useState } from "react";
import styles from "./VideoCall.module.css";
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
  remoteUserId,
  connectedAt,
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  console.log("remote tracks", remoteStream?.getVideoTracks());
  const { user: otherUser } = useUser(remoteUserId);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!connectedAt) return;

    const tick = () => {
      const seconds = Math.floor((Date.now() - connectedAt.getTime()) / 1000);
      setElapsed(seconds > 0 ? seconds : 0);
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [connectedAt]);

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  // Set local video stream
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set remote video stream
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;

      remoteVideoRef.current
        .play()
        .catch((err) => console.log("Remote video error:", err));
    }
  }, [remoteStream]);

  return (
    <div className={styles.overlay}>
      <div className={styles.callContainer}>
        <div className={styles.videoContainer}>
          {remoteCameraOn ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={styles.remoteVideo}
            />
          ) : (
            <div className={styles.audioCallScreen}>
              <img
                src={otherUser?.photoURL || "/avatar.png"}
                className={styles.avatar}
                alt="user"
              />
              <h2 className={styles.userName}>{otherUser?.Name || "User"}</h2>
              <p className={styles.callTimer}>{formatTime(elapsed)}</p>
            </div>
          )}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={cameraOn ? styles.localVideo : styles.hiddenLocalVideo}
          />
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
