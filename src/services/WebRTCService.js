let peerConnection = null;

export function createPeerConnection(onIceCandidate, onRemoteStream) {
  //creates the connection when the user clicks the call button
  peerConnection = new RTCPeerConnection({
    // shows the webRTC how to connect to the other user STUN
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  });
  peerConnection.onicecandidate = (event) => {
    // نرسلها للطرف الثاني عن طريق Firebase
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };
  peerConnection.ontrack = (event) => {
    const stream = event.streams[0];
    onRemoteStream(stream);
  };

  return peerConnection;
}

export async function getLocalStream(video = true) {
  //Gets the premition to the mic and cam
  const stream = await navigator.mediaDevices.getUserMedia({
    video,
    audio: true,
  });
  //data about the cam and mic
  return stream;
}

export function addTracks(stream) {
  // sends ur data to the other user
  //steam has 2 tracks vedioTrack and AudioTrack it sends them one by one in the loop to the other user
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
}

export function closeConnection() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
}
