
import { useRef, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Brain, Stethoscope, Pill, ShieldCheck } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatLoading from "./ChatLoading";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  errorMessage: string | null;
  detectedIntent?: string | null;
}

const ChatMessages = ({ messages, isLoading, errorMessage, detectedIntent }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case "symptoms":
        return <Stethoscope className="h-3 w-3 mr-1" />;
      case "diagnosis":
        return <Brain className="h-3 w-3 mr-1" />;
      case "treatment":
        return <Pill className="h-3 w-3 mr-1" />;
      case "prevention":
        return <ShieldCheck className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {detectedIntent && (
        <div className="flex justify-center mb-2">
          <Badge variant="outline" className="bg-secondary/50">
            {getIntentIcon(detectedIntent)}
            <span className="capitalize">{detectedIntent} Query Detected</span>
          </Badge>
        </div>
      )}
      
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      
      {isLoading && <ChatLoading />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
