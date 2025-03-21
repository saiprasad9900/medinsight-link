
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();
    
    // Access your OpenAI API key from environment variables
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!apiKey) {
      throw new Error("Missing OpenAI API key");
    }

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
      },
      ...chatHistory,
      {
        role: "user",
        content: message
      }
    ];

    console.log("Sending request to OpenAI with message:", message);
    console.log("Chat history length:", chatHistory.length);

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

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(data.error.message);
    }

    console.log("Received response from OpenAI");
    const aiResponse = data.choices[0].message.content;
    console.log("AI response first 100 chars:", aiResponse.substring(0, 100));

    return new Response(JSON.stringify({ 
      reply: aiResponse 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in doctor-ai function:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "An error occurred while processing your request" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
