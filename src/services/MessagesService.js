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
  arrayUnion,
  getDoc,
} from "firebase/firestore";

import { db } from "../config/firebase-config";
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
      const messages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((message) => !message.deletedFor?.includes(currentUserId));
      onSuccess(messages);
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
            deliveredAt: serverTimestamp(),
          }),
        );
      await Promise.all(updates);
    },
    (error) => {
      onError(error);
    },
  );
}

export async function createMessage(chat, currentUserId, messageData) {
  const chatId = chat.id;

  await addDoc(collection(db, "Chat", chatId, "messages"), {
    type: messageData.type,
    text: messageData.text || null,
    fileURL: messageData.fileURL || null,
    senderId: currentUserId,
    createdAt: serverTimestamp(),
    status: "sent",
    deliveredAt: null,
    seenAt: null,
    deletedFor: [],
    deletedForEveryone: false,
  });

  await updateDoc(doc(db, "Chat", chatId), {
    lastMessage:
      messageData.type === "text"
        ? messageData.text
        : messageData.type === "audio"
          ? "🎤 Audio message"
          : messageData.type === "image"
            ? "📷 Image"
            : messageData.type === "video"
              ? "🎥 Video"
              : "📎 File",

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
          seenAt: serverTimestamp(),
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

export async function deleteMessageForMe(chatId, messageId, userId) {
  const messageRef = doc(db, "Chat", chatId, "messages", messageId);
  await updateDoc(messageRef, {
    deletedFor: arrayUnion(userId),
  });
}

export async function deleteMessageForEveryone(chatId, messageId, userId) {
  const messageRef = doc(db, "Chat", chatId, "messages", messageId);
  const snapshot = await getDoc(messageRef);
  if (!snapshot.exists()) {
    throw new Error("Message not found");
  }
  const message = snapshot.data();
  if (message.senderId !== userId) {
    throw new Error("You can only delete your own messages");
  }

  if (message.status === "seen") {
    throw new Error("You can't delete this message for everyone");
  }
  await updateDoc(messageRef, {
    deletedForEveryone: true,
    deletedBy: userId,
    text: null,
    fileURL: null,
  });
}
