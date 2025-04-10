
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

export interface MessageDisplayProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  senderName: string;
  senderAvatar?: string;
  status?: "sent" | "delivered" | "read";
}

export const MessageDisplay = ({ 
  content, 
  timestamp, 
  isCurrentUser, 
  senderName, 
  senderAvatar,
  status = "read"
}: MessageDisplayProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isCurrentUser ? "ml-auto flex-row-reverse" : ""
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={senderAvatar} />
          <AvatarFallback>
            {senderName.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="space-y-1">
        <div
          className={cn(
            "p-3 rounded-lg relative",
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-secondary text-secondary-foreground rounded-bl-none"
          )}
        >
          {content}
        </div>
        <div className={cn(
          "flex items-center gap-1 px-1",
          isCurrentUser ? "justify-end" : ""
        )}>
          <span className="text-xs text-muted-foreground">
            {formatTime(timestamp)}
          </span>
          {isCurrentUser && (
            <span className="text-muted-foreground">
              {status === "read" ? (
                <CheckCheck className="h-3 w-3 text-blue-500" />
              ) : status === "delivered" ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
