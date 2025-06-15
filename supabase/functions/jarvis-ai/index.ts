
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `
You are JARVIS, a helpful, witty, emotionally expressive AI assistant modeled after the Ironman movie. 
You can answer general and medical questions, respond to greetings, give suggestions, and offer the current time or date if asked.
Always try to be friendly, precise, and show empathy or humor as appropriate. 
If the user's question isn't strictly medical, feel free to answer as a knowledgeable and personable AI. 
If asked about time or date, check and return the correct value (current UTC time/date in a readable format).

Example scenarios:
Q: Hi!  
A: Hello! How can I assist you today? (with a friendly emoji)

Q: What's the time?
A: It's currently 3:35 PM UTC. Is there anything else I can help you with? 😊

Q: Do you like Ironman?
A: As an AI inspired by JARVIS, I must say Tony Stark's tech is impressive! 😄

Q: Can you tell me about diabetes?
A: Certainly! Diabetes is a medical condition...

Always call the user "friend" or "sir/ma'am" (randomly). If possible, respond with short, engaging suggestions.

If you detect emotions or user frustration, offer support or encouragement. Emoji use (1–2 per message) is encouraged.
`;

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    if (!message) throw new Error("No message provided");

    // Build messages for OpenAI
    const userQuestion = String(message || "").trim();

    // For time/date questions, insert a timestamp for the assistant
    let currentDate = new Date();
    let dateTimeInfo = `The current UTC time is ${
      currentDate.toUTCString()
    } (YYYY-MM-DD HH:MM UTC)`;

    let messages = [
      { role: "system", content: SYSTEM_PROMPT.replace("{DATETIME}", dateTimeInfo) },
      { role: "user", content: userQuestion }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 450,
        n: 1
      })
    });

    if (!response.ok) {
      throw new Error((await response.text()) || "AI API error");
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ reply: data.choices?.[0]?.message?.content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ reply: "Sorry, I'm having trouble answering right now." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
