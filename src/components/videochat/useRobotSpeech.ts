
import { useRef, useState } from "react";

// Simple hook to speak (TTS) & provide animation state
export function useRobotSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  const speak = (text: string, onEnd?: () => void) => {
    if (!window.speechSynthesis) {
      setSpeaking(false);
      if (onEnd) onEnd();
      return;
    }
    setSpeaking(true);
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utterance.onend = () => {
      setSpeaking(false);
      if (onEnd) onEnd();
    };
    synthRef.current.speak(utterance);
  };

  return { speaking, speak };
}
