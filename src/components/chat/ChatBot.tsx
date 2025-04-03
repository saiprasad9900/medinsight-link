
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface Message {
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
}

const ChatBot = ({ isWarmingUp = false, includeHealthContext = false, userContext }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Dr. MediPredict, your AI health assistant. How can I help you today? Remember, I'm here to provide general health information, but I'm not a replacement for professional medical advice."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Track if this is the first message to send health context
  const firstMessageSentRef = useRef(false);

  const handleSendMessage = async (userMessage: string) => {
    if (isWarmingUp) {
      toast.warning("AI system is still warming up. Please try again in a moment.");
      return;
    }
    
    setErrorMessage(null);
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      console.log("Sending message to AI:", userMessage);
      
      // Format chat history for the API - only include content and role
      let chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // If this is the first message and we have health context, add it as system message
      if (includeHealthContext && userContext && !firstMessageSentRef.current) {
        firstMessageSentRef.current = true;
        
        // Create a system message with the user's health context
        const healthContextMsg = {
          role: "system" as const,
          content: `User context: ${userContext.age ? `Age: ${userContext.age}. ` : ''}${userContext.gender ? `Gender: ${userContext.gender}. ` : ''}${userContext.conditions?.length ? `Medical conditions: ${userContext.conditions.join(', ')}. ` : ''}${userContext.medications?.length ? `Medications: ${userContext.medications.join(', ')}.` : ''}`
        };
        
        // Add it to the beginning of the chat history
        chatHistory = [healthContextMsg, ...chatHistory];
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
      <ChatHeader apiKeyMissing={apiKeyMissing} isWarmingUp={isWarmingUp} includeHealthContext={includeHealthContext} />
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading} 
          errorMessage={errorMessage} 
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
