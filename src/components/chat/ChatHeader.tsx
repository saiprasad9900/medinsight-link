
import { Bot, Info, Loader2, Brain, Sparkles, Shield } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  apiKeyMissing: boolean;
  isWarmingUp?: boolean;
  includeHealthContext?: boolean;
  modelName?: string;
}

const ChatHeader = ({ 
  apiKeyMissing, 
  isWarmingUp = false, 
  includeHealthContext = false,
  modelName = "GPT-4o"
}: ChatHeaderProps) => {
  return (
    <CardHeader className="bg-primary/5 border-b">
      <CardTitle className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        Dr. MediPredict
        {apiKeyMissing && (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 ml-2">
            <Info className="h-3 w-3 mr-1" /> Limited Mode
          </Badge>
        )}
        {isWarmingUp && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 ml-2">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Warming Up
          </Badge>
        )}
        {includeHealthContext && (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 ml-2">
            <Brain className="h-3 w-3 mr-1" /> Personalized
          </Badge>
        )}
        {!apiKeyMissing && !isWarmingUp && (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 ml-2">
            <Sparkles className="h-3 w-3 mr-1" /> Powered by {modelName}
          </Badge>
        )}
      </CardTitle>
      <CardDescription className="mt-2 text-sm">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span>
            Ask about symptoms, treatments, or general health information. 
            This AI assistant uses advanced NLP to provide context-aware medical guidance, but is not a replacement for professional medical advice.
          </span>
        </div>
      </CardDescription>
    </CardHeader>
  );
};

export default ChatHeader;
