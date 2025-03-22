
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Bot } from "lucide-react";

const ChatLoading = () => {
  return (
    <div className="flex gap-3 max-w-[80%]">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="rounded-lg p-3 bg-secondary text-secondary-foreground flex items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2">Thinking...</span>
      </div>
    </div>
  );
};

export default ChatLoading;
