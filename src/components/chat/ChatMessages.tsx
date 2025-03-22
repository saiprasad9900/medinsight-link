
import { useRef, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatLoading from "./ChatLoading";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  errorMessage: string | null;
}

const ChatMessages = ({ messages, isLoading, errorMessage }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
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
