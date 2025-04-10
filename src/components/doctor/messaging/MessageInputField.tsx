
import { useState } from "react";
import { PaperclipIcon, SendIcon, Smile, Mic, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MessageInputFieldProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const MessageInputField = ({ onSendMessage, disabled = false }: MessageInputFieldProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
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

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      onSendMessage("🎤 Voice message (0:02)");
    }, 2000);
  };
  
  return (
    <div className={cn(
      "flex gap-2 w-full items-center",
      isRecording ? "bg-red-50 rounded-lg p-1" : ""
    )}>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" disabled={disabled || isRecording} className="h-9 w-9">
          <PaperclipIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" disabled={disabled || isRecording} className="h-9 w-9">
          <ImageIcon className="h-5 w-5" />
        </Button>
      </div>
      
      {isRecording ? (
        <div className="flex-1 flex items-center justify-center text-sm text-red-500 animate-pulse">
          Recording voice message...
        </div>
      ) : (
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 rounded-full"
          disabled={disabled}
        />
      )}
      
      <Button 
        variant="ghost"
        size="icon" 
        className="h-9 w-9"
        disabled={disabled}
        onClick={newMessage.trim() ? handleSendMessage : simulateVoiceRecording}
      >
        {newMessage.trim() ? (
          <SendIcon className="h-5 w-5 text-primary" />
        ) : (
          <Mic className={cn(
            "h-5 w-5",
            isRecording ? "text-red-500 animate-pulse" : ""
          )} />
        )}
      </Button>
    </div>
  );
};
