import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
import { update } from "firebase/database";

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

  if (diff < 3600) return `Last seen ${Math.floor(diff / 60)} min ago`;

  if (diff < 86400) return `Last seen ${Math.floor(diff / 3600)} hour ago`;

  return `Last seen ${Math.floor(diff / 86400)} day ago`;
}
export async function UpdateUser(userId, data) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    Name: data.name,
    searchName: data.name.toLowerCase(),
    number: data.number,
    photoURL: data.photoURL,
  });
}

export async function blockUser(currentUserId, otherUserId) {
  const currentUserRef = doc(db, "users", currentUserId);
  const otherUserRef = doc(db, "users", otherUserId);

  await updateDoc(currentUserRef, {
    blockedUser: arrayUnion(otherUserId),
  });

  await updateDoc(otherUserRef, {
    blockedBy: arrayUnion(currentUserId),
  });
}

export async function unBlockUser(currentUserId, otherUserId) {
  const currentUserRef = doc(db, "users", currentUserId);
  const otherUserRef = doc(db, "users", otherUserId);

  await updateDoc(currentUserRef, {
    blockedUser: arrayRemove(otherUserId),
  });

  await updateDoc(otherUserRef, {
    blockedBy: arrayRemove(currentUserId),
  });
}
export function subscribeToBlockStatus(
  currentUserId,
  otherUserId,
  onSuccess,
  onError
) {
  const currentUserRef = doc(db, "users", currentUserId);
  return onSnapshot(
    currentUserRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onSuccess({
          blockedByMe: false,
          blockedMe: false,
        });
        return;
      }
      const data = snapshot.data();
      onSuccess({
        blockedByMe:
          data.blockedUser?.includes(otherUserId) || false,
        blockedMe:
          data.blockedBy?.includes(otherUserId) || false,
      });
    },
    (error) => {
      onError(error);
    }
  );
}