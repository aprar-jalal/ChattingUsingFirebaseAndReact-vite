import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../config/firebase-config";

export function usePresence(uid) {
  const [presence, setPresence] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const statusRef = ref(rtdb, `status/${uid}`);
   // the onValue listner is like onSnapshot for the real time db
    const unsubscribe = onValue(statusRef, (snapshot) => {
      setPresence(snapshot.val());
    });

    return () => unsubscribe();
  }, [uid]);
  // presence is the status of the user online or offline
  return presence;
}
