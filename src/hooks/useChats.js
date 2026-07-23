import { useEffect, useState } from "react";
import { subscribeToUserChats } from "../services/ChatServices";

export function useChats(uid){
  const [chats,setChats] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  useEffect(()=>{
    if(!uid) return;
    const unsubscribe = subscribeToUserChats(
      uid,
      (data)=>{
        setChats(data);
        setLoading(false);
      },
      (error)=>{
        setError(error);
        setLoading(false);
      }
    );
    //its a listner so we need to terminate it by the return
    return unsubscribe;
  },[uid]);
  return {
    chats,
    loading,
    error
  };
}

