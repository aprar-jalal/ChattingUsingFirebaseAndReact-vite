import React from 'react'
import styles from"./Chat.module.css"
import Navbar from './../../Components/Navbar/Navbar';
import ChatList from '../../Components/ChatList/ChatList';
import ChatMessages from '../../Components/ChatMessage/ChatMessage';
function Chat() {
  
  return (
    <div className={styles.Container}>
      <div>
        <ChatList/>
      </div>
      <div className={styles.ChatArea}>
        <Navbar />
        <ChatMessages/>
        </div>
    </div>
  )
}


export default Chat