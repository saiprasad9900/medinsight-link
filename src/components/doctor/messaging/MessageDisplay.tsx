
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface MessageDisplayProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  senderName: string;
  senderAvatar?: string;
}

export const MessageDisplay = ({ 
  content, 
  timestamp, 
  isCurrentUser, 
  senderName, 
  senderAvatar 
}: MessageDisplayProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isCurrentUser ? "ml-auto flex-row-reverse" : ""
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={senderAvatar} />
        <AvatarFallback>
          {senderName.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div
          className={cn(
            "p-3 rounded-lg",
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {content}
        </div>
        <p className="text-xs text-muted-foreground px-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
