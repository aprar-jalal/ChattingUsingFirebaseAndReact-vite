import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase-config";

export function subscribeToMessages(chatId, onSuccess, onError) {
  const q = query(
    collection(db, "Chat", chatId, "messages"),

    orderBy("createdAt", "asc"),
  );

  return onSnapshot(
    q,

    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      onSuccess(messages);
    },

    (error) => {
      onError(error);
    },
  );
}

export async function createMessage(chatId, messageData) {
  const messageRef = await addDoc(
    collection(db, "Chat", chatId, "messages"),

    {
      ...messageData,
      createdAt: serverTimestamp(),
    },
  );

  await updateDoc(
    doc(db, "Chat", chatId),

    {
      lastMessage: messageData.text,
      updatedAt: serverTimestamp(),
    },
  );

  return messageRef;
}

export async function markMessagesAsSeen(chatId, userId) {
  const q = query(
    collection(db, "Chat", chatId, "messages"),

    where("seen", "==", false),

    where("senderId", "!=", userId),
  );

  const snapshot = await getDocs(q);

  const updates = snapshot.docs.map((message) => {
    return updateDoc(
      doc(db, "Chat", chatId, "messages", message.id),

      {
        seen: true,
      },
    );
  });

  await Promise.all(updates);
}
export function subscribeToUnreadCount(chatId, userId, onSuccess, onError) {
  const q = query(
    collection(db, "Chat", chatId, "messages"),

    where("seen", "==", false),

    where("senderId", "!=", userId),
  );

  return onSnapshot(
    q,

    (snapshot) => {
      onSuccess(snapshot.size);
    },

    (error) => {
      onError(error);
    },
  );
}
