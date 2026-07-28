import { useRef, useState } from "react";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  async function startRecording() {
    //it asks the browser for premistion to use audio
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // makes the recorder mediaRecorder dose:
      //Start recording
      //Stop recording
      //Receive audio data
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      //before each recored we empty up the chunks
      audioChunksRef.current = [];
      // the audio comes on chunks (parts)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      //when stoping the audio make a Blob
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        setAudioBlob(blob);
        //closing mic
        stream.getTracks().forEach((track) => track.stop());
      };
      // here the recording actually starts
      mediaRecorder.start();

      setIsRecording(true);
    } catch (error) {
      console.log("Microphone error:", error);
    }
  }

  function stopRecording() {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }
   function clearAudio() {
    setAudioBlob(null);
  }
  return {
    startRecording,
    stopRecording,
    isRecording,
    audioBlob,
    clearAudio,
  };
}
