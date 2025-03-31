
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, isLoading, disabled = false }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading || disabled) return;
    
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <Textarea
        placeholder="Ask about health advice, general wellness, or medical information..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        className="flex-1 resize-none"
        rows={1}
        disabled={disabled}
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={input.trim() === "" || isLoading || disabled}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default ChatInput;
