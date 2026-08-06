export function createPeerConnection(onIceCandidate, onRemoteStream) {
  const remoteStream = new MediaStream();
   const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: [
          "turn:free.expressturn.com:3478?transport=udp",
          "turn:free.expressturn.com:3478?transport=tcp",
        ],
        username: "000000002101206120",
        credential: "bwOSLe/rWBzzjJNZbculr/vdwcY=",
      },
    ],
    iceTransportPolicy: "all",
  });
 
  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
    onRemoteStream(remoteStream);
  };
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };
  return peerConnection;
}

export async function getLocalStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: {
    width: 640,
    height: 480,
  },
});
stream.getVideoTracks().forEach(track=>{
    track.enabled = false;
});
return stream;
}

export function addTracks(pc, stream) {
  // take all the tracks vedio audio and add it to the peer to peer connection
  stream.getTracks().forEach((track) => {
    pc.addTrack(track, stream);
  });
}

export function closeConnection(pc) {
 if (!pc) return;
  pc.getSenders().forEach(sender => {
    sender.track?.stop();
  });
  pc.close();
}
