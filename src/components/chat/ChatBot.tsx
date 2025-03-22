
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Bot, User, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Dr. MediPredict, your AI health assistant. How can I help you today? Remember, I'm here to provide general health information, but I'm not a replacement for professional medical advice."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setErrorMessage(null);
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      console.log("Sending message to AI:", userMessage);
      
      // Format chat history for the API - only include content and role
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('doctor-ai', {
        body: {
          message: userMessage,
          chatHistory
        }
      });

      console.log("Response from AI:", data);

      if (error) {
        console.error("Error from Edge Function:", error);
        throw new Error(`Error from service: ${error.message}`);
      }

      if (!data) {
        throw new Error("No response received from AI service");
      }

      // Check if we got a fallback response due to missing API key
      if (data.source === "fallback" && !apiKeyMissing) {
        setApiKeyMissing(true);
        console.warn("Using fallback responses due to missing OpenAI API key");
        toast.warning("AI running in limited mode due to configuration issues", {
          description: "Please contact site administrator to set up OpenAI API key for full functionality."
        });
      }

      if (data.error) {
        console.error("Error in AI response:", data.error);
        throw new Error(data.error);
      }

      if (!data.reply) {
        throw new Error("AI response is empty");
      }

      // Add AI response to chat
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error: any) {
      console.error("Error calling AI:", error);
      
      const errorMsg = error.message || "Failed to get a response. Please try again.";
      setErrorMessage(errorMsg);
      
      if (errorMsg.includes("API key")) {
        toast.error("AI service configuration issue", {
          description: "The AI service is missing its API key configuration."
        });
      } else {
        toast.error("Communication error", {
          description: "Failed to get a response from the AI. Please try again."
        });
      }
      
      // Add error message to chat so user knows what happened
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error while processing your request. Please try again or check your connection." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-[calc(100vh-12rem)] flex flex-col shadow-lg">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Dr. MediPredict
          {apiKeyMissing && (
            <span className="text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded-full flex items-center ml-2">
              <Info className="h-3 w-3 mr-1" /> Limited Mode
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3 max-w-[80%]",
              message.role === "user" ? "ml-auto" : ""
            )}
          >
            <div className={cn("order-2", message.role === "user" ? "order-1" : "")}>
              <Avatar className="h-8 w-8">
                {message.role === "assistant" ? (
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
                message.role === "assistant"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground order-2"
              )}
            >
              {message.content.split("\n").map((line, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
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
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t">
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
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={input.trim() === "" || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatBot;
