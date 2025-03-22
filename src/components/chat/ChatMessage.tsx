
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[80%]",
        isUser ? "ml-auto" : ""
      )}
    >
      <div className={cn("order-2", isUser ? "order-1" : "")}>
        <Avatar className="h-8 w-8">
          {!isUser ? (
            <>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-secondary/50">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </div>
      <div
        className={cn(
          "rounded-lg p-3 order-1",
          isUser
            ? "bg-primary text-primary-foreground order-2"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ChatMessage;
