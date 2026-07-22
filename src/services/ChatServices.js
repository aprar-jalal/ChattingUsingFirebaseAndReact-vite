import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
export function subscribeToUserChats(uid, onSuccess, onError) {
  const q = query(
    collection(db, "Chat"),
    // the chats for the user with this id only
    where("members", "array-contains", uid),
    orderBy("updatedAt", "desc"),
  );
  //for real time messaging
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onSuccess(chats);
    },
    (error) => {
      onError(error);
    },
  );
  return unsubscribe;
}
export async function createChat(currentUserId, otherUserId) {
  const chatsRef = collection(db, "Chat");

  const q = query(chatsRef, where("members", "array-contains", currentUserId));

  const snapshot = await getDocs(q);

  const existingChat = snapshot.docs.find((doc) => {
    const members = doc.data().members;

    return members.includes(otherUserId);
  });

  if (existingChat) {
    return {
      id: existingChat.id,
      ...existingChat.data(),
    };
  }

  const newChat = await addDoc(chatsRef, {
    members: [currentUserId, otherUserId],
    lastMessage: "",
    updatedAt: serverTimestamp(),
  });

  return {
    id: newChat.id,
    members: [currentUserId, otherUserId],
    lastMessage: "",
  };
}
