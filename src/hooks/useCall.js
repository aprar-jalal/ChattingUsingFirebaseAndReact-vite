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
  listenToCallAnswer
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
      (candidate) => {
        pendingCandidates.current.push(candidate);
      },
      (stream) => {
        setRemoteStream(stream);
      },
    );
    peerConnectionRef.current = pc;
    // 2- open camera and microphone
    const stream = await getLocalStream(true);
    setLocalStream(stream);
    // 3- add camera and mic to WebRTC
    addTracks(stream);
    // 4- create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    // 5- save call in Firebase
    const id = await createCall(currentUserId, receiverId, offer);
    listenToCallAnswer(id, pc);
    setCallId(id);
    callIdRef.current = id;
    for (const candidate of pendingCandidates.current) {
      await addIceCandidate(id, "callerCandidates", candidate);
    }
    pendingCandidates.current = [];
    setCalling(true);
  }

  async function acceptCall(call) {

  const pc = createPeerConnection(
    async (candidate) => {
      await addIceCandidate(
        call.id,
        "receiverCandidates",
        candidate
      );
    },

    (stream) => {
      console.log("REMOTE STREAM RECEIVED", stream);
      setRemoteStream(stream);
    }
  );


  peerConnectionRef.current = pc;


  // 1- set caller offer first
  await pc.setRemoteDescription(
    new RTCSessionDescription(call.offer)
  );


  // 2- open camera and mic
  const stream = await getLocalStream(true);

  setLocalStream(stream);


  // 3- send your tracks
  stream.getTracks().forEach(track=>{
    pc.addTrack(track, stream);
  });


  // 4- create answer
  const answer = await pc.createAnswer();

  await pc.setLocalDescription(answer);


  // 5- save answer in firebase
  await answerCall(
    call.id,
    answer
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
