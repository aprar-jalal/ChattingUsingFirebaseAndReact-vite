import { useState, useRef } from "react";

import {
  createPeerConnection,
  getLocalStream,
  addTracks,
  closeConnection,
} from "../services/WebRTCService";

import {
  createCall,
  answerCall,
  endCall,
  addIceCandidate,
  listenToCallAnswer,
  listenToCandidates,
} from "../services/CallServices";
export function useCall() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callId, setCallId] = useState(null);
  const [calling, setCalling] = useState(false);
  const peerConnectionRef = useRef(null);
  const callIdRef = useRef(null);
const pendingCandidates = useRef([]);
  async function startCall(currentUserId, receiverId) {
    // 1- create WebRTC connection
  const pc = createPeerConnection(
  async(candidate)=>{

  if(callIdRef.current){

    await addIceCandidate(
      callIdRef.current,
      "callerCandidates",
      candidate
    );

  }else{

    pendingCandidates.current.push(candidate);

  }

}
);
    peerConnectionRef.current = pc;
    // 2- open camera and microphone
    const stream = await getLocalStream(true);
    setLocalStream(stream);
    // 3- add camera and mic to WebRTC
    addTracks(pc, stream);
    // 4- create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    // 5- save call in Firebase
   const id = await createCall(
 currentUserId,
 receiverId,
 offer
);
 console.log(
"CALL CREATED:",
id
);
callIdRef.current = id;
for(const candidate of pendingCandidates.current){

 await addIceCandidate(
   id,
   "callerCandidates",
   candidate
 );

}

pendingCandidates.current = [];
    setCallId(id);

    listenToCallAnswer(id, pc);
    listenToCandidates(
  id,
  "receiverCandidates",
  pc
);
    setCalling(true);
  }


async function acceptCall(call){

const pc = createPeerConnection(

async(candidate)=>{

 await addIceCandidate(
   call.id,
   "receiverCandidates",
   candidate
 );

},

(stream)=>{

console.log(
"REMOTE STREAM RECEIVED",
stream
);

setRemoteStream(stream);

}

);


peerConnectionRef.current = pc;


// 1) ابدأ الاستماع أولاً
listenToCandidates(
 call.id,
 "callerCandidates",
 pc
);
console.log(
"REMOTE DESCRIPTION SET"
);

// 2) ضع offer كـ remote
await pc.setRemoteDescription(
 new RTCSessionDescription(call.offer)
);


const stream = await getLocalStream();

setLocalStream(stream);


addTracks(
 pc,
 stream
);


listenToCandidates(
 call.id,
 "callerCandidates",
 pc
);


// 4) اصنع answer
const answer = await pc.createAnswer();

await pc.setLocalDescription(answer);


// 5) ارفع answer إلى Firebase
await answerCall(
 call.id,
  {
   type: pc.localDescription.type,
   sdp: pc.localDescription.sdp
 }
);


setCallId(call.id);
setCalling(true);

}

  async function hangUp() {
    if (callId) {
      await endCall(callId);
    }
    closeConnection();
    setLocalStream(null);
    setRemoteStream(null);
    setCallId(null);
    setCalling(false);
  }

  return {
    startCall,
    acceptCall,
    hangUp,
    localStream,
    remoteStream,
    calling,
  };
}
