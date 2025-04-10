
import { useState } from "react";
import { PaperclipIcon, SendIcon, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface MessageInputFieldProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const MessageInputField = ({ onSendMessage, disabled = false }: MessageInputFieldProps) => {
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
      <Button variant="ghost" size="icon" disabled={disabled}>
        <PaperclipIcon className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" disabled={disabled}>
        <Smile className="h-5 w-5" />
      </Button>
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1"
        disabled={disabled}
      />
      <Button 
        size="icon" 
        onClick={handleSendMessage}
        disabled={disabled || !newMessage.trim()}
      >
        <SendIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
