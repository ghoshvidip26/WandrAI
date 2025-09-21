import { useState, useEffect, useRef } from "react";

export const useRecordVoice = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);

  const chunks = useRef<Blob[]>([]);
  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const initialMediaRecorder = (stream: any) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.onstart = () => {
      chunks.current = [];
    };
    mediaRecorder.ondataavailable = (event) => {
      chunks.current.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      console.log(audioBlob, "audioBlob");
    };
    setMediaRecorder(mediaRecorder);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []);
  return { recording, startRecording, stopRecording };
};
