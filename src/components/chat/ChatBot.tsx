
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

// Define a ChatMessage interface that's compatible with what ChatMessages expects
interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

// Define a separate interface for API communication that includes system messages
interface ApiMessage {
  role: "assistant" | "user" | "system";
  content: string;
}

interface ChatBotProps {
  isWarmingUp?: boolean;
  includeHealthContext?: boolean;
  userContext?: {
    age?: number;
    gender?: string;
    conditions?: string[];
    medications?: string[];
  };
  modelName?: string;
}

const ChatBot = ({ 
  isWarmingUp = false, 
  includeHealthContext = false, 
  userContext,
  modelName = "GPT-4o"
}: ChatBotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Greetings. I am Jarvis, your personal AI assistant. How may I help you today? Remember, for medical concerns, I provide information, not official advice."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Track if this is the first message to send health context
  const firstMessageSentRef = useRef(false);

  const handleSendMessage = async (userMessage: string) => {
    if (isWarmingUp) {
      toast.warning("AI system is still warming up. Please try again in a moment.");
      return;
    }
    
    setErrorMessage(null);
    
    // Simple intent detection for UI feedback
    const intentKeywords = {
      "symptoms": ["symptom", "feeling", "pain", "ache", "sore", "hurt"],
      "diagnosis": ["diagnose", "what is", "do I have", "could it be"],
      "treatment": ["treatment", "medicine", "remedy", "cure", "how to treat"],
      "prevention": ["prevent", "avoid", "risk", "chances"]
    };
    
    // Very basic intent detection for UI purposes
    const messageLower = userMessage.toLowerCase();
    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        setDetectedIntent(intent);
        break;
      }
    }
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      console.log("Sending message to AI:", userMessage);
      
      // Format chat history for the API - only include content and role
      // Convert our ChatMessages to ApiMessages for backend communication
      const chatHistory: ApiMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // If this is the first message and we have health context, add it as system message
      if (includeHealthContext && userContext && !firstMessageSentRef.current) {
        firstMessageSentRef.current = true;
        
        // Create a system message with the user's health context
        const healthContextMsg: ApiMessage = {
          role: "system",
          content: `User context: ${userContext.age ? `Age: ${userContext.age}. ` : ''}${userContext.gender ? `Gender: ${userContext.gender}. ` : ''}${userContext.conditions?.length ? `Medical conditions: ${userContext.conditions.join(', ')}. ` : ''}${userContext.medications?.length ? `Medications: ${userContext.medications.join(', ')}.` : ''}`
        };
        
        // Add it to the beginning of the chat history
        chatHistory.unshift(healthContextMsg);
      }

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
        console.warn("Using fallback responses due to missing or rate-limited OpenAI API key");
        toast.warning("AI running in limited mode", {
          description: "Using reliable fallback responses as OpenAI API is currently unavailable."
        });
      }

      if (data.error) {
        console.error("Error in AI response:", data.error);
        // If we have a specific error, try again with a slightly different system prompt
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          // Try again with the fallback system
          console.log(`Retrying request (attempt ${retryCount + 1}/${maxRetries})`);
          
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Try again with the same request but don't increment retry count again
          await handleRetryRequest(userMessage, chatHistory);
          return;
        }
        throw new Error(data.error);
      }

      if (!data.reply) {
        throw new Error("AI response is empty");
      }

      // Reset retry count on success
      setRetryCount(0);

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
  
  // Helper function to retry requests
  const handleRetryRequest = async (userMessage: string, chatHistory: ApiMessage[]) => {
    try {
      const { data } = await supabase.functions.invoke('doctor-ai', {
        body: {
          message: userMessage,
          chatHistory,
          retry: true
        }
      });
      
      if (data && data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error("Still no valid AI response after retry");
      }
    } catch (retryError) {
      console.error("Retry failed:", retryError);
      // Don't add another error message to the chat, the original error handler will do that
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-[calc(100vh-12rem)] flex flex-col shadow-lg">
      <ChatHeader 
        apiKeyMissing={apiKeyMissing} 
        isWarmingUp={isWarmingUp} 
        includeHealthContext={includeHealthContext}
        modelName={apiKeyMissing ? "Fallback Mode" : modelName} 
      />
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading} 
          errorMessage={errorMessage}
          detectedIntent={detectedIntent}
        />
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          disabled={isWarmingUp}
        />
      </CardFooter>
    </Card>
  );
};

export default ChatBot;
