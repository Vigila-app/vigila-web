"use client";

import { Button } from "@/components";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeechRecognitionComponent = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () => SpeechRecognition.startListening({
    continuous: true,
  });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <div className="flex gap-2 my-2">
      <Button action={startListening} isLoading={listening} label="Start" />
      <Button action={SpeechRecognition.stopListening} disabled={!listening} secondary label="Stop" />
      <Button action={resetTranscript} label="Reset" disabled={!transcript} />
      </div>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechRecognitionComponent;
