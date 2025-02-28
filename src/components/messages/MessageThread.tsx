
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface MessageThreadProps {
  contact: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: "online" | "offline";
  };
}

const MessageThread = ({ contact }: MessageThreadProps) => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: {
        id: "1",
        name: "Dr. Rebecca Lee",
        avatar: "",
        isCurrentUser: true,
      },
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.content}
              </div>
              <p className="text-xs text-muted-foreground px-1">
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            variant="default" 
            size="icon" 
            className="flex-shrink-0" 
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ""}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
