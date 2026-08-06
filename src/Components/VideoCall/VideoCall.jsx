import React, { useEffect, useRef } from "react";
import styles from "./VideoCall.module.css";

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
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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
          {remoteCameraOn ? (
            <div className={styles.videoContainer}>
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
            </div>
          ) : (
            <div className={styles.audioCallScreen}>
              <img src={userPhoto} className={styles.avatar} />

              <h2 className={styles.userName}>{userName}</h2>

              <p className={styles.callTimer}>
                minutes:seconds
              </p>
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
            ></i>
          </button>
          <button className={styles.controlButton} onClick={toggleCamera}>
            <i
              className={
                cameraOn ? "fa-solid fa-video" : "fa-solid fa-video-slash"
              }
            ></i>
          </button>
          <button className={styles.endButton} onClick={onClose}>
            <i className="fa-solid fa-phone-slash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
