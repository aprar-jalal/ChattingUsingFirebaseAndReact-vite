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
  //for users cam and mic stream
  const [localStream, setLocalStream] = useState(null);
  //for the other user cam and mic stream
  const [remoteStream, setRemoteStream] = useState(null);
  //knows if there is a call or not
  const [calling, setCalling] = useState(false);

  const peerConnectionRef = useRef(null);
  // stores the call id from the firebase
  const callIdRef = useRef(null);
  // to stop the firebase listner like snapshot when the call is ended
  const listenersRef = useRef([]);
  // to store candidates untile the call is created in firebase
  const pendingCandidates = useRef([]);

  /**************************Start Call***************************************/
  async function startCall(currentUserId, receiverId) {
    //returns RTCPeerConnection
    const pc = createPeerConnection(
      async (candidate) => {
        // do we have and callId? if yes add ice to the firebase
        if (callIdRef.current) {
          await addIceCandidate(
            callIdRef.current,
            "callerCandidates",
            candidate,
          );
        }
        // the ice came fast before the documnet is created in the firebase so we store it temproray
        else {
          pendingCandidates.current.push(candidate);
        }
      },
      // receves the other user stream
      (stream) => {
        setRemoteStream(stream);
      },
    );
    peerConnectionRef.current = pc;
    // to have the premition to the mic and cam
    const stream = await getLocalStream();
    setLocalStream(stream);
    //we add the cam and mic to the webRTC connection
    addTracks(pc, stream);

    // the user says i want to make connection so webRTC makes the connection description as object
    const offer = await pc.createOffer();
    //here we give the RTCPeerConnection the call descreption
    await pc.setLocalDescription(offer);

    // here we make a call in firebase
    const id = await createCall(currentUserId, receiverId, {
      type: offer.type,
      sdp: offer.sdp,
    });
    callIdRef.current = id;

    // this is for adding the ice that came fast in firebase
    for (const candidate of pendingCandidates.current) {
      await addIceCandidate(id, "callerCandidates", candidate);
    }
    pendingCandidates.current = [];
    // listenToCallAnswer isten to this call if it has an answer tell me  and it tells WebRTC this is the
    //other user data store it
    const unsubscribeAnswer = listenToCallAnswer(id, pc);
    //liten to the other user candidate if it changes so that ther webRTC can fined the connection path
    const unsubscribeCandidates = listenToCandidates(
      id,
      "receiverCandidates",
      pc,
    );
    listenersRef.current.push(unsubscribeAnswer, unsubscribeCandidates);
    setCalling(true);
  }

  /**************************Accept Call***************************************/
  async function acceptCall(call) {
    const pc = createPeerConnection(
      //the recver finds connection pathes and pushs his candidate to the firebase so its from reciver to sender
      async (candidate) => {
        await addIceCandidate(call.id, "receiverCandidates", candidate);
      },
      //receves the audio and cam from the other user
      (stream) => {
        setRemoteStream(stream);
      },
    );
    peerConnectionRef.current = pc;
    //here it tell's the webRTC this the offer save it
    await pc.setRemoteDescription(new RTCSessionDescription(call.offer));
    // we read the other user candidate and make webRTC save it
    const unsubscribeCandidates = listenToCandidates(
      call.id,
      "callerCandidates",
      pc,
    );
    listenersRef.current.push(unsubscribeCandidates);

    const stream = await getLocalStream();
    setLocalStream(stream);
    addTracks(pc, stream);

    // this tells that im ready to answer
    const answer = await pc.createAnswer();
    // save the asnswer loacaly
    await pc.setLocalDescription(answer);
    // sending the answer to ther firebase
    await answerCall(call.id, {
      type: pc.localDescription.type,
      sdp: pc.localDescription.sdp,
    });
    callIdRef.current = call.id;
    setCalling(true);
  }

  /**************************Stop Call***************************************/
  async function hangUp() {
    // remove firestore listeners
    listenersRef.current.forEach((unsubscribe) => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });
    listenersRef.current = [];
    if (callIdRef.current) {
      //changes the statuse on firebase
      await endCall(callIdRef.current);
    }
    //closes the webRTC connection
    closeConnection(peerConnectionRef.current);

    peerConnectionRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
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
