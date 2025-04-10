
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Lock, Image, Smile, Mic, CheckCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    isCurrentUser: boolean;
  };
  content: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

interface MessageThreadProps {
  contact: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: "online" | "offline";
  };
  onSendMessage?: (message: string) => void;
}

const MessageThread = ({ contact, onSendMessage }: MessageThreadProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: {
        id: "2",
        name: contact.name,
        avatar: contact.avatar,
        isCurrentUser: false,
      },
      content: "I've reviewed the lab results for Emma Thompson. The cardiac enzyme levels are concerning, can you take a look?",
      timestamp: "10:32 AM",
      status: "read"
    },
    {
      id: "2",
      sender: {
        id: "1",
        name: "Dr. Rebecca Lee",
        avatar: "",
        isCurrentUser: true,
      },
      content: "I'll review them right away. Has she been experiencing any chest pain or shortness of breath?",
      timestamp: "10:35 AM",
      status: "read"
    },
    {
      id: "3",
      sender: {
        id: "2",
        name: contact.name,
        avatar: contact.avatar,
        isCurrentUser: false,
      },
      content: "Yes, she reported mild chest discomfort and shortness of breath during her morning walk. Her ECG showed some ST-segment changes as well.",
      timestamp: "10:38 AM",
    },
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: {
        id: "1",
        name: user?.email || "Dr. Rebecca Lee",
        avatar: "",
        isCurrentUser: true,
      },
      content: newMessage.trim(),
      timestamp: formatTime(),
      status: "sent"
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    if (onSendMessage) {
      onSendMessage(newMessage.trim());
    }
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg
      ));
      
      // Simulate response after delay if contact is online
      if (contact.status === "online") {
        setTimeout(() => {
          const responseMessages = [
            "I'll check on that right away.",
            "Thank you for letting me know. I'll follow up with the patient.",
            "Got it. Let's discuss this at the next staff meeting too.",
            "I've made a note in the system. We should monitor this closely.",
            "I appreciate your attention to this case.",
          ];
          
          const response = responseMessages[Math.floor(Math.random() * responseMessages.length)];
          
          // Update the sent message to "read" first
          setMessages(prev => prev.map(msg => 
            msg.id === newMsg.id ? { ...msg, status: "read" } : msg
          ));
          
          // Add response message
          const responseMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: {
              id: "2",
              name: contact.name,
              avatar: contact.avatar,
              isCurrentUser: false,
            },
            content: response,
            timestamp: formatTime(),
          };
          
          setMessages(prev => [...prev, responseMsg]);
        }, 1500 + Math.random() * 2000);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: {
          id: "1",
          name: user?.email || "Dr. Rebecca Lee",
          avatar: "",
          isCurrentUser: true,
        },
        content: "🎤 Voice message (0:02)",
        timestamp: formatTime(),
        status: "sent"
      };
      
      setMessages([...messages, newMsg]);
      
      if (onSendMessage) {
        onSendMessage("Voice message");
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={contact.avatar} />
              <AvatarFallback>
                {contact.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            {contact.status === "online" && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
            )}
          </div>
          <div>
            <h3 className="font-medium">{contact.name}</h3>
            <p className="text-xs text-muted-foreground">{contact.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>End-to-end encrypted</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div className="flex justify-center">
            <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
              Today
            </span>
          </div>
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                message.sender.isCurrentUser ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.sender.avatar} />
                <AvatarFallback>
                  {message.sender.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    message.sender.isCurrentUser
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-secondary-foreground rounded-bl-none"
                  )}
                >
                  {message.content}
                </div>
                <div className={cn(
                  "flex items-center gap-1 px-1",
                  message.sender.isCurrentUser ? "justify-end" : ""
                )}>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                  {message.sender.isCurrentUser && message.status && (
                    <span className="text-muted-foreground">
                      {message.status === "read" ? (
                        <CheckCheck className="h-3 w-3 text-blue-500" />
                      ) : message.status === "delivered" ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex gap-2 items-center rounded-lg",
          isRecording ? "bg-red-50 p-1" : ""
        )}>
          {isRecording ? (
            <div className="flex-1 flex items-center justify-center text-sm text-red-500 animate-pulse">
              Recording voice message...
            </div>
          ) : (
            <>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Image className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 rounded-full"
              />
            </>
          )}
          <Button 
            variant="ghost"
            size="icon" 
            className="h-9 w-9"
            onClick={newMessage.trim() ? handleSendMessage : simulateVoiceRecording}
          >
            {newMessage.trim() ? (
              <Send className="h-5 w-5 text-primary" />
            ) : (
              <Mic className={cn(
                "h-5 w-5",
                isRecording ? "text-red-500 animate-pulse" : ""
              )} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
