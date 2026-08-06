import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
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
    callerCameraOn: false,
    receiverCameraOn: false,
    // cuz the other user didnt answer yet
    answer: null,
    connectedAt: serverTimestamp()
  });
  //retrun the id of the calls collection
  return callRef.id;
}

// this for the other user to always listen to the firebase so if any user creats a call it will appear dirctly
export function listenToIncomingCalls(userId, onSuccess) {
  const q = query(collection(db, "calls"), where("receiverId", "==", userId), where("status","==","ringing"));
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

export async function endCall(callId,userId) {
  console.log("Ending call:", {
  callId,
  userId
});
  const callRef = doc(db, "calls", callId);
  await updateDoc(callRef, {
    status: "ended",
    endedBy:userId,
    endedAt: serverTimestamp(),
  });
}

// for the caller to add it's candidate to the firebase
export async function addIceCandidate(callId, type, candidate) {
  // and it's a subcollection cuz there so many candidate can be produced
  await addDoc(collection(db, "calls", callId, type), candidate.toJSON());
}

// for the reciver
export function listenToCandidates(callId, type, pc) {
  // the ice may come faster than the answer or offer so we need to store them temp
  const queue = [];
  return onSnapshot(collection(db, "calls", callId, type), async (snapshot) => {
    for (const change of snapshot.docChanges()) {
      if (change.type === "added") {
        //retrun  WebRTC object
        const candidate = new RTCIceCandidate(change.doc.data());
        // if the connection
        if (pc.remoteDescription) {
          //is ready add the candidate
          await pc.addIceCandidate(candidate);
        } else {
          // is not ready sotore it in queue
          queue.push(candidate);
        }
      }
    }
    //if the connection is ready and there is candidate waiting in queue
    if (pc.remoteDescription && queue.length) {
      for (const candidate of queue) {
        if (
          pc.connectionState !== "failed" &&
          pc.connectionState !== "closed"
        ) {
          await pc.addIceCandidate(candidate);
        }
      }
      queue.length = 0;
    }
  });
}

// this is for the caller only
export function listenToCallAnswer(callId, pc,onConnected) {
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
    onConnected();
    console.log("REMOTE DESCRIPTION SET");
  });
  return unsubscribe;
}

export function listenToCallStatus(callId, currentUserId, onEnded) {
  return onSnapshot(doc(db, "calls", callId), (snapshot) => {
    const data = snapshot.data();
    if (!data) return;
    if (data.status === "ended" && data.endedBy !== currentUserId) {
      onEnded(data.endedBy);
    }
  });
}

export async function updateCameraStatus(callId, field, value) {
  const callRef = doc(db, "calls", callId);
  await updateDoc(callRef, { [field]: value });
}

export function listenToCameraStatus(callId, isCaller, onChange) {
  return onSnapshot(doc(db, "calls", callId), (snapshot) => {
    const data = snapshot.data();
    if (!data) return;
    const remoteField = isCaller ? "receiverCameraOn" : "callerCameraOn";
    onChange(!!data[remoteField]);
  });
}
export function listenToConnectedAt(callId, onConnected) {
  return onSnapshot(doc(db, "calls", callId), (snapshot) => {
    const data = snapshot.data();
    if (data?.connectedAt) {
      onConnected(data.connectedAt.toDate());
    }
  });
}