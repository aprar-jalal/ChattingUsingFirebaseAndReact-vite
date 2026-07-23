import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { rtdb } from "../config/firebase-config";

import {
  ref,
  set,
  onDisconnect,
} from "firebase/database";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) return;
      try {
        const statusRef = ref(rtdb, `status/${currentUser.uid}`);
        await set(statusRef, {
          state: "online",
          lastChanged: Date.now(),
        });
        onDisconnect(statusRef).set({
          state: "offline",
          lastChanged: Date.now(),
        });
      } catch (err) {
        console.log(err);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}