
import { useEffect, useRef } from "react";
import { CardContent } from "@/components/ui/card";
import { MessageDisplay } from "./MessageDisplay";
import { Message } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircleOff } from "lucide-react";

interface ConversationViewProps {
  messages: Message[];
  activePatientName: string;
  activePatientAvatar?: string;
  isLoading?: boolean;
}

export const ConversationView = ({ 
  messages, 
  activePatientName, 
  activePatientAvatar,
  isLoading = false
}: ConversationViewProps) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  if (!user) return null;
  
  return (
    <CardContent className="p-6 overflow-auto flex-1">
      {messages.length === 0 && !isLoading ? (
        <Alert className="bg-secondary/50">
          <MessageCircleOff className="h-4 w-4" />
          <AlertDescription>
            No messages yet. Start the conversation with {activePatientName}.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {messages.map(message => (
            <MessageDisplay
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isCurrentUser={message.sender_id === user.id}
              senderName={message.sender_id === user.id ? "Me" : activePatientName}
              senderAvatar={message.sender_id === user.id ? "" : activePatientAvatar}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </CardContent>
  );
};
