import React, { useState, useRef } from "react";
import RobotAvatar from "@/components/videochat/RobotAvatar";
import { useSpeechRecognition } from "@/components/videochat/useSpeechRecognition";
import { useRobotSpeech } from "@/components/videochat/useRobotSpeech";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Loader2, Video, AlertTriangle } from "lucide-react";
import MedicalDisclaimer from "@/components/doctor/MedicalDisclaimer";

const AiVideoChat: React.FC = () => {
  const [userMediaAllowed, setUserMediaAllowed] = useState(false);
  const [userVideoUrl, setUserVideoUrl] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { speaking, speak } = useRobotSpeech();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Start webcam on load & cleanup
  React.useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setUserMediaAllowed(true);
        }
        // For snapshot fallback if needed:
        setUserVideoUrl(null);
      })
      .catch(() => {
        setUserMediaAllowed(false);
        setUserVideoUrl(null);
      });
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  // Speech Recognition Hook
  const onSpeechResult = (text: string) => {
    setQuestion(text);
    handleAskAI(text);
  };
  const { listening, startListening } = useSpeechRecognition({ onResult: onSpeechResult });

  // --- UPDATED: Use 'jarvis-ai' for all questions, expects JARVIS-like, emotional/human responses ---
  const handleAskAI = async (userQuestion: string) => {
    setError(null);
    setIsThinking(true);
    setAnswer(null);

    try {
      const { data, error } = await supabase.functions.invoke('jarvis-ai', {
        body: { message: userQuestion }
      });

      if (error || !data?.reply) {
        setError("Sorry, I couldn't get a reply. Try again.");
        toast.error("AI unavailable, please retry.");
        setIsThinking(false);
        return;
      }
      setAnswer(data.reply);
      speak(data.reply);
    } catch (err) {
      setError("Service unavailable.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background animate-fade-in pt-4 px-2">
      <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        AI Doctor Video Chat
      </h1>
      <p className="text-muted-foreground mb-4 text-center max-w-lg">
        Talk to Dr. MediPredict (JARVIS)! Ask your health, general, or random questions—get spoken, friendly answers.
      </p>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 pt-6 pb-2">
        {/* User Video */}
        <div>
          <div className="flex flex-col items-center justify-center p-3">
            <div className="text-base mb-2 font-semibold flex items-center gap-1">
              <Video className="h-4 w-4" /> {userMediaAllowed ? "Your Video" : "Webcam Unavailable"}
            </div>
            <div className="rounded-lg overflow-hidden border shadow-md bg-gray-100 w-[180px] h-[140px] flex items-center justify-center">
              {userMediaAllowed ? (
                <video ref={videoRef} autoPlay muted playsInline width={180} height={140} className="rounded-sm" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Mic className="h-6 w-6 mb-2" />
                  <span className="text-xs">No camera detected</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Robot Doctor/JARVIS Avatar */}
        <div>
          <div className="flex flex-col items-center justify-center p-3">
            <span className="text-base mb-2 font-semibold flex items-center gap-1 text-primary">
              <RobotAvatar speaking={speaking || isThinking} />
            </span>
            <div className="mt-2"/>
          </div>
        </div>
      </div>
      {/* Controls & Status */}
      <div className="w-full max-w-lg flex flex-col items-center gap-2">
        <MedicalDisclaimer />
        {error && (
          <Alert variant="destructive" className="mb-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {/* Ask/Listen */}
        <Button
          onClick={startListening}
          className="mb-2"
          disabled={listening || isThinking || speaking}
          variant={listening ? "secondary" : "default"}
          size="lg"
        >
          {listening ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Listening... Speak your question
            </>
          ) :
            (<><Mic className="h-5 w-5 mr-2" /> Ask your question by voice</>)
          }
        </Button>
        {/* Show transcript */}
        {question && (
          <div className="text-center mt-2">
            <span className="font-semibold">You:</span> {question}
          </div>
        )}
        {/* Show answer */}
        {answer && (
          <div className="bg-muted p-4 rounded-md mt-2 shadow text-center w-full max-w-md animate-fade-in">
            <span className="font-semibold">JARVIS:</span>
            <div className="mt-2">{answer}</div>
          </div>
        )}
      </div>
      <div className="mt-auto mb-6 opacity-60 text-xs">Powered by OpenAI via JARVIS-like assistant – info & empathy, not a substitute for professional advice.</div>
    </div>
  );
};

export default AiVideoChat;
