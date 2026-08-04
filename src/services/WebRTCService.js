let peerConnection = null;

export function createPeerConnection(onIceCandidate, onRemoteStream) {
  peerConnection = new RTCPeerConnection({
    sdpSemantics:"unified-plan",
    iceCandidatePoolSize: 10,
    iceTransportPolicy:"relay",
    iceServers: [
     {
 urls:[
  "turn:free.expressturn.com:3478"
 ],
username:"000000002101206120",
credential:"bwOSLe/rWBzzjJNZbculr/vdwcY="
},

    ],
  });
  peerConnection.oniceconnectionstatechange = async () => {

console.log(
 "ICE STATE:",
 peerConnection.iceConnectionState
);


if(
 peerConnection.iceConnectionState === "failed"
){

const stats =
await peerConnection.getStats();


stats.forEach(report=>{

if(
report.type==="candidate-pair"
){

console.log(
"CANDIDATE PAIR",
report
);

}

});


}

};
  return peerConnection;
}
export async function getLocalStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  return stream;
}
export function addTracks(pc, stream) {
  stream.getTracks().forEach((track) => {
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
