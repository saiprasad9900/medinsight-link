
import { Bot, Info, Loader2 } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ChatHeaderProps {
  apiKeyMissing: boolean;
  isWarmingUp?: boolean;
}

const ChatHeader = ({ apiKeyMissing, isWarmingUp = false }: ChatHeaderProps) => {
  return (
    <CardHeader className="bg-primary/5 border-b">
      <CardTitle className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        Dr. MediPredict
        {apiKeyMissing && (
          <span className="text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded-full flex items-center ml-2">
            <Info className="h-3 w-3 mr-1" /> Limited Mode
          </span>
        )}
        {isWarmingUp && (
          <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full flex items-center ml-2">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Warming Up
          </span>
        )}
      </CardTitle>
    </CardHeader>
  );
};

export default ChatHeader;
