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
    answer: {
      type: answer.type,
      sdp: answer.sdp,
    },
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
export async function addIceCandidate(callId, type, candidate) {
  console.log("UPLOAD ICE:", type, candidate.type);
  await addDoc(collection(db, "calls", callId, type), candidate.toJSON());
}
export function listenToCandidates(callId, type, pc) {
  const queue = [];

  const unsubscribe = onSnapshot(
    collection(db, "calls", callId, type),
    async (snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type !== "added") continue;
        if (pc.signalingState === "closed" || pc.connectionState === "closed") {
          console.log("PC CLOSED IGNORE ICE");
          return;
        }
        const candidate = new RTCIceCandidate(change.doc.data());
        console.log("RECEIVED ICE:", candidate.type);
        try {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(candidate);
            console.log("ICE ADDED DIRECT");
          } else {
            queue.push(candidate);
            console.log("ICE QUEUED");
          }
        } catch (err) {
          console.log("ICE ADD ERROR", err.message);
        }
      }
      if (pc.remoteDescription && queue.length) {
        while (queue.length) {
          const candidate = queue.shift();
          try {
            await pc.addIceCandidate(candidate);
          } catch (err) {
            console.log("QUEUED ICE ERROR", err.message);
          }
        }
      }
    },
  );
  return unsubscribe;
}

// listen for answer
export function listenToCallAnswer(callId, pc) {
  const unsubscribe = onSnapshot(doc(db, "calls", callId), async (snapshot) => {
    const data = snapshot.data();
    if (!data?.answer) return;
    if (pc.signalingState === "closed") {
      console.log("PC CLOSED, IGNORE ANSWER");
      return;
    }
    if (pc.currentRemoteDescription) {
      console.log("REMOTE DESCRIPTION ALREADY SET");
      return;
    }
    await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    console.log("REMOTE DESCRIPTION SET");
  });
  return unsubscribe;
}
