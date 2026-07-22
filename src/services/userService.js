import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase-config";

export function subscribeToUser(userId, onSuccess, onError) {
  const userRef = doc(db, "users", userId);

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onSuccess({
          id: snapshot.id,
          ...snapshot.data(),
        });
      } else {
        onSuccess(null);
      }
    },
    (error) => {
      onError(error);
    },
  );
}
