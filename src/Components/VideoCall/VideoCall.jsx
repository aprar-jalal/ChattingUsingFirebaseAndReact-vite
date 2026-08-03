import React, { useEffect, useRef } from "react";
import styles from "./VideoCall.module.css";

function VideoCall({
  onClose,
  localStream,
  remoteStream
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  // عرض فيديو الكاميرا الخاصة فيك
  useEffect(() => {
    if(localStream && localVideoRef.current){
      localVideoRef.current.srcObject = localStream;
    }
  },[localStream]);

useEffect(() => {

  if(remoteStream && remoteVideoRef.current){

    remoteVideoRef.current.srcObject = remoteStream;

    remoteVideoRef.current
      .play()
      .catch(err => console.log("play error",err));

  }
  if(remoteStream){

   console.log(
    "REMOTE VIDEO TRACKS",
    remoteStream.getVideoTracks()
   );}

},[remoteStream]);

  return (
    <div className={styles.overlay}>
      <div className={styles.callContainer}>
        <div className={styles.videoContainer}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={styles.remoteVideo}
          />
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={styles.localVideo}
          />
        </div>
        <div className={styles.controls}>
          <button
            className={styles.endButton}
            onClick={onClose}
          >
            <i className="fa-solid fa-phone-slash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}


export default VideoCall;