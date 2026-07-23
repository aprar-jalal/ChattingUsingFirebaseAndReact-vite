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
  // returns users data according to his id
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
    // >= start with the first letter 
    where("searchName", ">=", search),
    // <= start with the first letter and so on
    where("searchName", "<=", search + "\uf8ff"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export function formatLastSeen(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  const diff = Math.floor((Date.now() - timestamp) / 1000);

  if (diff < 60) return "Last seen just now";

  if (diff < 3600)
    return `Last seen ${Math.floor(diff / 60)} min ago`;

  if (diff < 86400)
    return `Last seen ${Math.floor(diff / 3600)} hour ago`;

  return `Last seen ${Math.floor(diff / 86400)} day ago`;
}