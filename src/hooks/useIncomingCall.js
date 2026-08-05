import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { listenToIncomingCalls } from "../services/CallServices";

export function useIncomingCall() {
  const [incomingCall, setIncomingCall] = useState(null);
  const { user: currentUser } = useAuth();
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = listenToIncomingCalls(currentUser.uid, (calls) => {
      // if there si calls 
      if (calls.length > 0) {
        // take the first call
        setIncomingCall(calls[0]);
      }
    });
    return unsubscribe;
  }, [currentUser]);
  return {
   incomingCall,
   setIncomingCall
  }
}
