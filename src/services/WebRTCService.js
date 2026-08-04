let peerConnection = null;

export function createPeerConnection(onIceCandidate, onRemoteStream) {
  const remoteStream = new MediaStream();

  peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: ["stun:stun.relay.metered.ca:80"],
      },

      {
        urls: [
          "turn:standard.relay.metered.ca:80",
          "turn:standard.relay.metered.ca:80?transport=tcp",
          "turn:standard.relay.metered.ca:443",
          "turns:standard.relay.metered.ca:443?transport=tcp",
        ],

        username: "000000002101206120",
        credential: "bwOSLe/rWBzzjJNZbculr/vdwcY=",
      },
      
    ],
     iceTransportPolicy:"relay"

  });

  peerConnection.ontrack=(event)=>{

 console.log(
  "REMOTE TRACK:",
  event.track.kind
 );


 event.track.onunmute=()=>{

   console.log(
    "TRACK UNMUTED:",
    event.track.kind
   );

 };


 event.track.onmute=()=>{

   console.log(
    "TRACK MUTED:",
    event.track.kind
   );

 };


 remoteStream.addTrack(event.track);


 onRemoteStream(remoteStream);

};

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("LOCAL ICE", event.candidate.type);

      onIceCandidate(event.candidate);
    }
  };

  peerConnection.onconnectionstatechange = () => {
    console.log("CONNECTION:", peerConnection.connectionState);
  };

  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE:", peerConnection.iceConnectionState);
  };

  return peerConnection;
}

export async function getLocalStream() {
  return await navigator.mediaDevices.getUserMedia({
    video: {
      width: 1280,
      height: 720,
    },

    audio: true,
  });
}

export function addTracks(pc, stream) {
  stream.getTracks().forEach((track) => {
    console.log("ADDING TRACK", track.kind);

    pc.addTrack(track, stream);
  });
}

export function closeConnection() {
  if (peerConnection) {
    peerConnection.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.stop();
      }
    });

    peerConnection.close();

    peerConnection = null;
  }
}
