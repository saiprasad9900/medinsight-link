import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

import { corsHeaders } from "./utils/helpers.ts";
import { handleConversationalTidbits } from "./knowledge/index.ts";
import { detectMedicalEmergency, generateEmergencyWarning } from "./medical/emergency.ts";
import { generateMedicalFallbackResponse } from "./medical/fallback.ts";
import { generateHealthEducationMessage } from "./medical/education.ts";
import { getSystemMessage } from "./config/systemPrompt.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request:", req.method);
    const requestData = await req.json();
    const { message, chatHistory } = requestData;
    
    console.log("Message received:", message);
    console.log("Chat history length:", chatHistory?.length || 0);
    
    // Handle simple conversational tidbits first
    const conversationalReply = handleConversationalTidbits(message);
    if (conversationalReply) {
      console.log("Replying with a conversational tidbit.");
      return new Response(JSON.stringify({ 
        reply: conversationalReply,
        source: "conversational-handler"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check for medical emergency keywords
    if (detectMedicalEmergency(message)) {
      console.log("DETECTED POTENTIAL MEDICAL EMERGENCY");
      return new Response(JSON.stringify({ 
        reply: generateEmergencyWarning(),
        source: "emergency-detection"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Access your OpenAI API key from environment variables
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!apiKey || apiKey.trim() === '') {
      console.log("Missing OpenAI API key - using medical education response system");
      
      // Generate a medical education response
      const educationResponse = generateHealthEducationMessage(message);
      
      return new Response(JSON.stringify({ 
        reply: educationResponse,
        source: "health-education" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Construct the conversation with system message and history
    const messages = [getSystemMessage()];

    // Add chat history if it exists and is not empty
    if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      messages.push(...chatHistory);
    }
    
    // Add the current user message
    messages.push({
      role: "user",
      content: message
    });

    console.log("Sending request to OpenAI API");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7,
          max_tokens: 800
        })
      });

      console.log("OpenAI response status:", response.status);
      
      if (!response.ok) {
        console.error("OpenAI API response status:", response.status);
        console.error("OpenAI API response status text:", response.statusText);
        
        // Try to get error message
        let errorMessage = "Unknown error occurred";
        try {
          const errorData = await response.json();
          console.error("OpenAI API error:", JSON.stringify(errorData));
          errorMessage = errorData.error?.message || response.statusText;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        
        // Check for rate limiting or quota errors and provide a medical-specific fallback
        if (response.status === 429 || errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
          console.log("Rate limit or quota exceeded - using medical fallback response");
          const medicalFallback = generateMedicalFallbackResponse(message);
          
          return new Response(JSON.stringify({ 
            reply: medicalFallback,
            source: "fallback",
            error: errorMessage
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        throw new Error(`OpenAI API error: ${errorMessage}`);
      }

      const data = await response.json();
      console.log("OpenAI response received:", data ? "yes" : "no");
      
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected response format from OpenAI:", JSON.stringify(data));
        throw new Error("Received invalid response format from OpenAI");
      }
      
      const aiResponse = data.choices[0].message.content;
      console.log("AI response first 100 chars:", aiResponse.substring(0, 100));

      return new Response(JSON.stringify({ 
        reply: aiResponse,
        source: "openai" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      
      // Generate a medical-specific fallback response in case of API errors
      const medicalFallback = generateMedicalFallbackResponse(message);
      
      return new Response(JSON.stringify({ 
        reply: medicalFallback,
        source: "fallback",
        error: fetchError.message
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Error in doctor-ai function:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "An error occurred while processing your request",
      reply: "I apologize, but I encountered a technical issue. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
