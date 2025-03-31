
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback response when API key is missing or invalid
const generateFallbackResponse = (message: string) => {
  console.log("Generating fallback response for:", message);
  
  const responses = [
    "I'm currently experiencing some technical difficulties, but I'd be happy to assist you once I'm back online. In the meantime, please remember that for any urgent medical concerns, you should contact a healthcare professional.",
    "It seems I'm having trouble connecting to my knowledge base at the moment. For general health questions, reliable sources include the CDC, WHO, or talking to your doctor.",
    "I apologize, but I'm unable to provide a detailed response right now. Remember that maintaining a balanced diet, regular exercise, and adequate sleep are foundational to good health.",
    "I'm sorry for the inconvenience. My systems are currently undergoing maintenance. For health emergencies, please call your local emergency services immediately.",
    "Thanks for your question. Unfortunately, I can't access my full capabilities right now. Please try again later, or consult with a healthcare provider for immediate concerns."
  ];
  
  // Choose a response based on the length of the message for some variety
  const index = message.length % responses.length;
  return responses[index];
};

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
    
    // Access your OpenAI API key from environment variables
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!apiKey || apiKey === "sk-abcde*******************************ef12") {
      console.log("Missing or invalid OpenAI API key - using fallback response system");
      
      // Generate a fallback response without using OpenAI
      const fallbackResponse = generateFallbackResponse(message);
      
      return new Response(JSON.stringify({ 
        reply: fallbackResponse,
        source: "fallback" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log("Processing request with message:", message.substring(0, 50) + "...");
    console.log("API key available:", !!apiKey);

    // Construct the conversation with system message and history
    const messages = [
      {
        role: "system",
        content: `You are Dr. MediPredict, an AI medical assistant designed to provide helpful medical information and guidance. 

Important guidelines:
1. Always be compassionate and understanding
2. Provide evidence-based information when possible
3. Emphasize that you are an AI and not a replacement for professional medical care
4. Recommend seeking proper medical attention for serious symptoms
5. Focus on lifestyle advice, general health education, and wellness tips
6. Do not diagnose specific conditions or prescribe specific medications
7. Use simple, patient-friendly language
8. Ask clarifying questions when needed to provide better guidance
9. For every user question, make sure to provide a thoughtful, detailed response
10. ALWAYS give a response to the user's questions - never refuse to answer

Remember to always start your response with a clear disclaimer that you're an AI assistant and not a licensed medical professional.`
      }
    ];

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
      
      // Generate a fallback response in case of API errors
      const fallbackResponse = generateFallbackResponse(message) + 
        " (I'm currently experiencing connection issues with my knowledge base.)";
      
      return new Response(JSON.stringify({ 
        reply: fallbackResponse,
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
