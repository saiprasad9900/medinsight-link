
import { useEffect, useRef, useState } from "react";

interface SpeechRecognitionProps {
  onResult: (text: string) => void;
  disabled?: boolean;
}

export function useSpeechRecognition({ onResult, disabled = false }: SpeechRecognitionProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setListening(false);
    };
    recognitionRef.current.onerror = () => setListening(false);
  }, [onResult]);

  const startListening = () => {
    if (recognitionRef.current && !disabled) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return { listening, startListening, stopListening };
}
