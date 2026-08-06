import React, { useState } from "react";
import styles from "./Chat.module.css";
import Navbar from "./../../Components/Navbar/Navbar";
import ChatList from "../../Components/ChatList/ChatList";
import ChatMessages from "../../Components/ChatMessage/ChatMessage";
import { useCall } from "../../hooks/useCall";
import IncomingCall from "../../Components/IncomingCall/IncomingCall";
import { useIncomingCall } from "../../hooks/useIncomingCall";
import VideoCall from "../../Components/VideoCall/VideoCall";
import { useAuth } from "../../Context/AuthContext";
function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { incomingCall, setIncomingCall } = useIncomingCall();
  const {
    startCall,
    acceptCall,
    hangUp,
    declineCall,
    toggleCamera,
    toggleMic,
    isMuted,
    cameraOn,
    remoteCameraOn,
    callMessage,
    localStream,
    remoteStream,
    calling,
    remoteUserId,
    connectedAt
  } = useCall();
  const { user } = useAuth();

  return (
    <div className={styles.Container}>
      <div>
        <ChatList setSelectedChat={setSelectedChat} />
      </div>
      <div className={styles.ChatArea}>
        <Navbar
          selectedChat={selectedChat}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          searchText={searchText}
          setSearchText={setSearchText}
          startCall={startCall}
        />
        <ChatMessages
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          searchText={searchText}
        />
        {incomingCall && (
          <IncomingCall
            call={incomingCall}
            onAccept={async (call) => {
              await acceptCall(call, user.uid);
              setIncomingCall(null);
            }}
            onDecline={async (callId) => {
              await declineCall(callId, user.uid);
              setIncomingCall(null);
            }}
          />
        )}
        {calling && (
          <VideoCall
            localStream={localStream}
            remoteStream={remoteStream}
            onClose={() => {
              hangUp(user.uid);
            }}
            remoteUserId={remoteUserId}
            toggleCamera={toggleCamera}
            toggleMic={toggleMic}
            cameraOn={cameraOn}
            isMuted={isMuted}
            remoteCameraOn={remoteCameraOn}
            connectedAt={connectedAt}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
