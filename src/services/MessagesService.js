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

export function subscribeToMessages(chatId, onSuccess, onError, currentUserId) {
  const q = query(
    collection(db, "Chat", chatId, "messages"),
    orderBy("createdAt", "asc"),
  );

  return onSnapshot(
    q,

    async (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // sent --> delivered

      const updates = snapshot.docs
        .filter(
          (message) =>
            message.data().senderId !== currentUserId &&
            message.data().status === "sent",
        )
        .map((message) =>
          updateDoc(doc(db, "Chat", chatId, "messages", message.id), {
            status: "delivered",
          }),
        );

      await Promise.all(updates);

      onSuccess(messages);
    },

    (error) => {
      onError(error);
    },
  );
}

export async function createMessage(chat, currentUserId, messageText) {
  let chatId = chat.id;

  if (chat.isNew) {
    const newChat = await createChat(currentUserId, chat.userId);

    chatId = newChat.id;
  }

  await addDoc(collection(db, "Chat", chatId, "messages"), {
    text: messageText,

    senderId: currentUserId,

    createdAt: serverTimestamp(),

    status: "sent",
  });

  await updateDoc(doc(db, "Chat", chatId), {
    lastMessage: messageText,
    updatedAt: serverTimestamp(),
  });

  return chatId;
}

// delivered --> seen

export async function markMessagesAsSeen(chatId, userId) {
  const q = query(
    collection(db, "Chat", chatId, "messages"),

    where("status", "==", "delivered"),
  );

  const snapshot = await getDocs(q);

  const updates = snapshot.docs

    .filter((message) => message.data().senderId !== userId)

    .map((message) =>
      updateDoc(
        doc(db, "Chat", chatId, "messages", message.id),

        {
          status: "seen",
        },
      ),
    );

  await Promise.all(updates);
}

export function subscribeToUnreadCount(chatId, userId, onSuccess, onError) {
  const q = query(
    collection(db, "Chat", chatId, "messages"),

    where("status", "in", ["sent", "delivered"]),
  );

  return onSnapshot(
    q,

    (snapshot) => {
      const count = snapshot.docs.filter(
        (message) => message.data().senderId !== userId,
      ).length;

      onSuccess(count);
    },

    (error) => {
      onError(error);
    },
  );
}
