
import { useEffect, useRef } from "react";
import { CardContent } from "@/components/ui/card";
import { MessageDisplay } from "./MessageDisplay";
import { Message } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircleOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const groupMessagesByDate = (messages: Message[]) => {
    return messages.reduce((groups: { [key: string]: Message[] }, message) => {
      const date = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp);
      const dateStr = date.toDateString();
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(message);
      return groups;
    }, {});
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  };
  
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  if (!user) return null;
  
  const groupedMessages = groupMessagesByDate(messages);
  
  return (
    <CardContent className="p-0 overflow-hidden flex-1">
      <ScrollArea className="h-full px-6 py-4">
        {messages.length === 0 && !isLoading ? (
          <Alert className="bg-secondary/50">
            <MessageCircleOff className="h-4 w-4" />
            <AlertDescription>
              No messages yet. Start the conversation with {activePatientName}.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([dateStr, dateMessages]) => (
              <div key={dateStr} className="space-y-3">
                <div className="flex justify-center">
                  <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
                    {formatDateHeader(dateStr)}
                  </span>
                </div>
                {dateMessages.map(message => (
                  <MessageDisplay
                    key={message.id}
                    content={message.content}
                    timestamp={message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)}
                    isCurrentUser={message.sender_id === user.id}
                    senderName={message.sender_id === user.id ? "Me" : activePatientName}
                    senderAvatar={message.sender_id === user.id ? "" : activePatientAvatar}
                    status={message.sender_id === user.id ? Math.random() > 0.5 ? "read" : "delivered" : undefined}
                  />
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
    </CardContent>
  );
};
