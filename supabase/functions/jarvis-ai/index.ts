
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function jarvisRespond(userQuestion: string) {
  const q = userQuestion.trim().toLowerCase();

  // Greetings
  if (
    /^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(q)
  ) {
    return random([
      "Hello friend! How can I help you today? 🤖",
      "Hey! Jarvis is at your service. How can I assist, sir/ma'am? 😊",
      "Greetings! Ready to answer your questions, friend. 👋",
    ]);
  }

  // Time/Date
  if (q.includes("time")) {
    const d = new Date();
    return `It's currently ${d.toUTCString()}. Anything else I can help with? 🕒`;
  }
  if (q.includes("date")) {
    const d = new Date();
    return `Today's date is ${d.toDateString()}. Need something else, friend? 📅`;
  }

  // Ironman questions
  if (q.match(/ironman|tony|stark|jarvis/)) {
    return random([
      "As an AI inspired by Jarvis, Tony Stark is my prototype! 😄",
      "Tony Stark's technology is impressive—sometimes even more than my code!",
      "I may not have my own Iron Suit, but I'm here to help you, sir/ma'am! 🤖",
    ]);
  }

  // Medical sample - diabetes
  if (q.includes("diabetes")) {
    return "Certainly friend! Diabetes is a chronic medical condition that affects how your body turns food into energy. Let me know if you want more details or advice! 💙";
  }
  if (q.includes("headache")) {
    return "Headaches can be caused by many reasons—stress, dehydration, or even screen time. Try to rest, stay hydrated, and contact a doctor if it gets severe. 😊";
  }
  if (q.includes("covid")) {
    return "COVID-19 is a viral disease with symptoms like fever, cough, and fatigue. If you're feeling unwell, please seek medical advice and stay safe. 🦠";
  }
  if (q.includes("fever")) {
    return "Fever is your body's response to infection. Rest, hydrate, and monitor symptoms. If fever is high or persistent, contact a doctor. 🌡️";
  }

  // Emotional support
  if (q.match(/sad|lonely|depressed|worried|anxious/)) {
    return "Sorry to hear you're feeling this way, friend! Remember, you're not alone—I'm here to talk, and it's always okay to seek help from others. 💙";
  }
  if (q.match(/thank|thanks|great|awesome|good job|nice/)) {
    return random([
      "My pleasure, friend! 😊",
      "You're very welcome! Anything else I can assist with?",
      "Happy to help, sir/ma'am!",
    ]);
  }

  // Fallback for unknown questions
  return random([
    "I'm Jarvis, your helpful assistant! Please ask about health, time, or anything else. 😊",
    "I'm not a doctor, but I'm happy to provide information or answer general questions, friend!",
    "Can you rephrase or ask another question? I'm here to help with your needs! 🤖",
  ]);
}

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    if (!message) throw new Error("No message provided");

    const reply = jarvisRespond(String(message || ""));

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ reply: "Sorry, I'm having trouble answering right now." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
