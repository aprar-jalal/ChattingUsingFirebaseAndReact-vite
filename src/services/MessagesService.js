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
import { createChat } from "./ChatServices";
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

export async function createMessage(chat, currentUserId, messageText) {
  let chatId = chat.id;

  // إذا أول رسالة
  if (chat.isNew) {
    const newChat = await createChat(currentUserId, chat.userId);

    chatId = newChat.id;
  }

  // إضافة الرسالة
  await addDoc(collection(db, "Chat", chatId, "messages"), {
    text: messageText,
    senderId: currentUserId,
    createdAt: serverTimestamp(),
    seen: false,
    verified: false,
  });

  // تحديث معلومات الشات
  await updateDoc(doc(db, "Chat", chatId), {
    lastMessage: messageText,
    updatedAt: serverTimestamp(),
  });

  return chatId;
}

export async function markMessagesAsSeen(chatId, userId) {
  const q = query(
    collection(db, "Chat", chatId, "messages"),
    where("seen", "==", false),
  );

  const snapshot = await getDocs(q);

  const updates = snapshot.docs
    .filter((message) => message.data().senderId !== userId)
    .map((message) =>
      updateDoc(doc(db, "Chat", chatId, "messages", message.id), {
        seen: true,
      }),
    );

  await Promise.all(updates);
}
export function subscribeToUnreadCount(chatId, userId, onSuccess, onError) {
  const q = query(
    collection(db, "Chat", chatId, "messages"),
    where("seen", "==", false),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const unread = snapshot.docs.filter(
        (doc) => doc.data().senderId !== userId,
      ).length;

      onSuccess(unread);
    },

    (error) => {
      onError(error);
    },
  );
}
