import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../config/firebase-config";

// create new call
export async function createCall(callerId, receiverId, offer) {
  const callRef = await addDoc(collection(db, "calls"), {
    callerId,
    receiverId,
    offer,
    type: "video",
    status: "ringing",
    answer: null,
    createdAt: serverTimestamp(),
  });
  //retrun the id of the calls collection
  return callRef.id;
}
export function listenToIncomingCalls(userId, onSuccess) {
  const q = collection(db, "calls");
  return onSnapshot(q, (snapshot) => {
    const calls = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const incoming = calls.filter((call) => {
      return call.receiverId === userId && call.status === "ringing";
    });
    onSuccess(incoming);
  });
}

export async function answerCall(callId, answer) {
  const callRef = doc(db, "calls", callId);
  await updateDoc(callRef, {
    answer,
    status: "connected",
  });
}

export async function endCall(callId) {
  const callRef = doc(db, "calls", callId);
  await updateDoc(callRef, {
    status: "ended",
    endedAt: serverTimestamp(),
  });
}

export function listenToCandidates(callId, type, pc) {
  return onSnapshot(
    collection(db, "calls", callId, type),

    (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          await pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        }
      });
    },
  );
}
export async function addIceCandidate(callId, type, candidate) {
  await addDoc(collection(db, "calls", callId, type), candidate.toJSON());
}



// listen for answer
export function listenToCallAnswer(callId, pc) {
  return onSnapshot(doc(db, "calls", callId), async (snapshot) => {
    const data = snapshot.data();
    if (data?.answer && !pc.currentRemoteDescription) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  });
}
