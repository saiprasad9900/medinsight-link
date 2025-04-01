
import { useEffect, useRef } from "react";
import { CardContent } from "@/components/ui/card";
import { MessageDisplay } from "./MessageDisplay";
import { Message } from "./types";
import { useAuth } from "@/contexts/AuthContext";

interface ConversationViewProps {
  messages: Message[];
  activePatientName: string;
  activePatientAvatar?: string;
}

export const ConversationView = ({ 
  messages, 
  activePatientName, 
  activePatientAvatar 
}: ConversationViewProps) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  if (!user) return null;
  
  return (
    <CardContent className="p-6 overflow-auto flex-1">
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
    </CardContent>
  );
};
