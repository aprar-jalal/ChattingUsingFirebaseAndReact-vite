import React, { useState } from 'react'
import styles from"./Chat.module.css"
import Navbar from './../../Components/Navbar/Navbar';
import ChatList from '../../Components/ChatList/ChatList';
import ChatMessages from '../../Components/ChatMessage/ChatMessage';
function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  return (
    <div className={styles.Container}>
      <div>
        <ChatList setSelectedChat={setSelectedChat}/>
      </div>
      <div className={styles.ChatArea}>
        <Navbar selectedChat={selectedChat}/>
        <ChatMessages 
  selectedChat={selectedChat}
  setSelectedChat={setSelectedChat}
/>
        </div>
    </div>
  )
}


export default Chat