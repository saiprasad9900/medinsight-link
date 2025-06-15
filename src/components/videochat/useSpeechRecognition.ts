
import { useEffect, useRef, useState } from "react";

interface SpeechRecognitionProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function useSpeechRecognition({ onResult, onError, disabled = false }: SpeechRecognitionProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      onError?.("Speech recognition is not supported by your browser.");
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

    recognitionRef.current.onerror = (event: any) => {
      if (onError) {
        let errorMessage = `Speech recognition error: ${event.error}.`;
        if (event.error === 'not-allowed') {
          errorMessage = "Microphone access denied. Please allow microphone access in your browser settings.";
        } else if (event.error === 'no-speech') {
          errorMessage = "No speech was detected. Please try again.";
        }
        onError(errorMessage);
      }
      setListening(false);
    };
  }, [onResult, onError]);

  const startListening = () => {
    if (recognitionRef.current && !disabled) {
      setListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        setListening(false);
        onError?.("Could not start speech recognition. Is the microphone connected?");
      }
    } else if (!recognitionRef.current) {
        onError?.("Speech recognition is not available.");
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
