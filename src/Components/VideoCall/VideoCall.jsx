import React, { useEffect, useRef } from "react";
import styles from "./VideoCall.module.css";

function VideoCall({ onClose, localStream, remoteStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      console.log("SETTING LOCAL VIDEO");

      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      console.log("REMOTE VIDEO SET", remoteStream.getTracks());

      remoteVideoRef.current.srcObject = remoteStream;

      remoteVideoRef.current
        .play()
        .then(() => {
          console.log("REMOTE PLAY SUCCESS");
        })
        .catch((err) => {
          console.log("REMOTE PLAY ERROR", err);
        });
    }
  }, [remoteStream]);
  useEffect(()=>{

 if(remoteStream){

   const videoTrack =
    remoteStream.getVideoTracks()[0];


   if(videoTrack){

     console.log(
       "VIDEO TRACK STATE",
       videoTrack.readyState,
       videoTrack.enabled,
       videoTrack.muted
     );


     videoTrack.onunmute=()=>{

       console.log(
        "VIDEO TRACK UNMUTED"
       );

     };

   }

 }

},[remoteStream]);

  return (
    <div className={styles.overlay}>
      <div className={styles.callContainer}>
        <div className={styles.videoContainer}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
muted
            className={styles.remoteVideo}
          />

          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={styles.localVideo}
          />
        </div>

        <div className={styles.controls}>
          <button className={styles.endButton} onClick={onClose}>
            <i className="fa-solid fa-phone-slash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
