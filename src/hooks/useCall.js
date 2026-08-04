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

  // store all firestore listeners
  const listenersRef = useRef([]);

  // ICE generated before call document exists
  const pendingCandidates = useRef([]);

  async function startCall(currentUserId, receiverId) {
    const pc = createPeerConnection(
      async (candidate) => {
        if (callIdRef.current) {
          await addIceCandidate(
            callIdRef.current,
            "callerCandidates",
            candidate,
          );
        } else {
          pendingCandidates.current.push(candidate);
        }
      },

      (stream) => {
        console.log("REMOTE STREAM RECEIVED", stream);

        setRemoteStream(stream);
      },
    );

    peerConnectionRef.current = pc;

    const stream = await getLocalStream();

    setLocalStream(stream);

    addTracks(pc, stream);

    const offer = await pc.createOffer();

    await pc.setLocalDescription(offer);
    pc.getSenders().forEach((sender) => {
      console.log(
        "SENDER",
        sender.track.kind,
        sender.track.readyState,
        sender.track.enabled,
      );
    });

    const id = await createCall(currentUserId, receiverId, {
      type: offer.type,
      sdp: offer.sdp,
    });

    console.log("CALL CREATED:", id);

    callIdRef.current = id;

    // upload pending ICE
    for (const candidate of pendingCandidates.current) {
      await addIceCandidate(id, "callerCandidates", candidate);
    }

    pendingCandidates.current = [];

    setCallId(id);

    const unsubscribeAnswer = listenToCallAnswer(id, pc);

    const unsubscribeCandidates = listenToCandidates(
      id,
      "receiverCandidates",
      pc,
    );

    listenersRef.current.push(unsubscribeAnswer, unsubscribeCandidates);

    setCalling(true);
  }

  async function acceptCall(call) {
    const pc = createPeerConnection(
      async (candidate) => {
        await addIceCandidate(call.id, "receiverCandidates", candidate);
      },

      (stream) => {
        console.log("REMOTE STREAM RECEIVED", stream);

        setRemoteStream(stream);
      },
    );

    peerConnectionRef.current = pc;

    /*
       Start listening ICE
       only once
    */

    await pc.setRemoteDescription(new RTCSessionDescription(call.offer));

    const unsubscribeCandidates = listenToCandidates(
      call.id,
      "callerCandidates",
      pc,
    );

    listenersRef.current.push(unsubscribeCandidates);

    const stream = await getLocalStream();

    setLocalStream(stream);

    addTracks(pc, stream);
    console.log("LOCAL TRACKS", stream.getTracks());

    const answer = await pc.createAnswer();

    await pc.setLocalDescription(answer);

    await answerCall(
      call.id,

      {
        type: pc.localDescription.type,
        sdp: pc.localDescription.sdp,
      },
    );

    console.log("ANSWER SET SUCCESS");

    setCallId(call.id);

    callIdRef.current = call.id;

    setCalling(true);
  }

  async function hangUp() {
    // remove firestore listeners

    listenersRef.current.forEach((unsubscribe) => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });

    listenersRef.current = [];

    if (callIdRef.current) {
      await endCall(callIdRef.current);
    }

    closeConnection();

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    setLocalStream(null);

    setRemoteStream(null);

    setCallId(null);

    callIdRef.current = null;

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
