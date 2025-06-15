
import { InfoIcon, Shield, ShieldCheck } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatHeaderProps {
  apiKeyMissing?: boolean;
  isWarmingUp?: boolean;
  includeHealthContext?: boolean;
  modelName?: string;
}

const ChatHeader = ({ 
  apiKeyMissing = false, 
  isWarmingUp = false, 
  includeHealthContext = false,
  modelName = "GPT-4o" 
}: ChatHeaderProps) => {
  return (
    <CardHeader className="border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Jarvis</h3>
            <p className="text-xs text-muted-foreground">Personal AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {includeHealthContext && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Health Context</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your health information is being used to personalize responses</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={apiKeyMissing ? "outline" : "secondary"} className={
                  apiKeyMissing 
                    ? "bg-amber-500/10 text-amber-500 gap-1" 
                    : "gap-1"
                }>
                  {apiKeyMissing && <InfoIcon className="h-3 w-3" />}
                  <span>{modelName}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {apiKeyMissing 
                  ? "Running in fallback mode with reliable healthcare responses" 
                  : `Using ${modelName} for AI responses`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {isWarmingUp && (
            <div className="h-3 w-3 bg-amber-500 animate-pulse rounded-full"></div>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;
