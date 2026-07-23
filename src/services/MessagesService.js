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
  //this query returns the messages between the 2 users
  const q = query(
    collection(db, "Chat", chatId, "messages"),
    orderBy("createdAt", "asc"),
  );
  // here if the user sends a message there is no need to refresh cuz there is a listner
  return onSnapshot(
    q,
    async (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // sent --> delivered
      //if the message is sent to user mark it as delevered
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
  await addDoc(collection(db, "Chat", chatId, "messages"), {
    text: messageText,
    senderId: currentUserId,
    createdAt: serverTimestamp(),
    status: "sent",
  });
  // to update the last message to the newly sent message
  await updateDoc(doc(db, "Chat", chatId), {
    lastMessage: messageText,
    updatedAt: serverTimestamp(),
  });

  return chatId;
}

// delivered --> seen
export async function markMessagesAsSeen(chatId, userId) {
  // we want the messages that are delivered
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
        // update the message status into seen
        {
          status: "seen",
        },
      ),
    );
  await Promise.all(updates);
}

export function subscribeToUnreadCount(chatId, userId, onSuccess, onError) {
  // query on the messages that are in the delivered or sent status
  const q = query(
    collection(db, "Chat", chatId, "messages"),
    where("status", "!=", "seen"),
  );
  // returns the length of the seen messages
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
