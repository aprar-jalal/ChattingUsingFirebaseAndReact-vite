import React, { useState } from "react";
import styles from "./Chat.module.css";
import Navbar from "./../../Components/Navbar/Navbar";
import ChatList from "../../Components/ChatList/ChatList";
import ChatMessages from "../../Components/ChatMessage/ChatMessage";
import { useCall } from "../../hooks/useCall";
import IncomingCall from "../../Components/IncomingCall/IncomingCall";
import { useIncomingCall } from "../../hooks/useIncomingCall";
function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { startCall, acceptCall, hangUp, localStream, remoteStream, calling } =
    useCall();

  const { incomingCall, setIncomingCall } = useIncomingCall();
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
        />
        <ChatMessages
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          searchText={searchText}
        />
        {incomingCall && (
          <IncomingCall
            call={incomingCall}
            onAccept={(call) => {
              acceptCall(call);
              setIncomingCall(null);
            }}
            onDecline={async (callId) => {
              await hangUp(callId);
              setIncomingCall(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
