
import { useState } from "react";
import { PaperclipIcon, SendIcon, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputFieldProps {
  onSendMessage: (message: string) => void;
}

export const MessageInputField = ({ onSendMessage }: MessageInputFieldProps) => {
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex gap-2 w-full">
      <Button variant="ghost" size="icon">
        <PaperclipIcon className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <Smile className="h-5 w-5" />
      </Button>
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1"
      />
      <Button 
        size="icon" 
        onClick={handleSendMessage}
        disabled={!newMessage.trim()}
      >
        <SendIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
