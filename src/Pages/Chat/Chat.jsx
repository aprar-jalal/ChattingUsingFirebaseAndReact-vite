import React, { useState } from "react";
import styles from "./Chat.module.css";
import Navbar from "./../../Components/Navbar/Navbar";
import ChatList from "../../Components/ChatList/ChatList";
import ChatMessages from "../../Components/ChatMessage/ChatMessage";
import { useCall } from "../../hooks/useCall";
import IncomingCall from "../../Components/IncomingCall/IncomingCall";
import { useIncomingCall } from "../../hooks/useIncomingCall";
import VideoCall from "../../Components/VideoCall/VideoCall";
function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showCall, setShowCall] = useState(false);
  const { incomingCall, setIncomingCall } = useIncomingCall();
  const { startCall, acceptCall, hangUp, localStream, remoteStream, calling } =
    useCall();

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
          calling={calling}
          localStream={localStream}
          remoteStream={remoteStream}
          hangUp={hangUp}
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
            call={incomingCall}
            onAccept={async (call) => {
              await acceptCall(call);
              setIncomingCall(null);
              setShowCall(true);
            }}
            onDecline={async (callId) => {
              await hangUp(callId);
              setIncomingCall(null);
            }}
          />
        )}
        {showCall && (
          <VideoCall
            localStream={localStream}
            remoteStream={remoteStream}
            onClose={() => {
              hangUp();
              setShowCall(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
