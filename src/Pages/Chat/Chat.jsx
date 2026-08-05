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
  const [showCall, setShowCall] = useState(false);
  const { incomingCall, setIncomingCall } = useIncomingCall();
  const {
    startCall,
    acceptCall,
    hangUp,
    declineCall,
    localStream,
    remoteStream,
    calling,
    callMessage,
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
          setShowCall={setShowCall}
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
              setShowCall(true);
            }}
            onDecline={async (callId) => {
              await declineCall(callId, user.uid);
              setIncomingCall(null);
            }}
          />
        )}
        {(showCall || calling) && (
          <VideoCall
            localStream={localStream}
            remoteStream={remoteStream}
            onClose={() => {
              hangUp(user.uid);
              setShowCall(false);
            }}
          />
        )}
        
      </div>
    </div>
  );
}

export default Chat;
