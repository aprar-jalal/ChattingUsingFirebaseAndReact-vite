import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";

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

export async function searchUserByName(name) {
  const search = name.toLowerCase();

  const q = query(
    collection(db, "users"),
    where("searchName", ">=", search),
    where("searchName", "<=", search + "\uf8ff"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
