import { random } from "../utils/helpers.ts";

export const handleGreetings = (query: string): string | null => {
  const q = query.trim().toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|yo)\b/.test(q) || q === 'good morning' || q === 'good afternoon' || q === 'good evening') {
    const hour = new Date().getUTCHours() - 5; 
    
    if (q.includes('morning') || (hour < 12 && hour >= 5)) {
      return random([
        "Good morning, sir! How may I be of assistance today? 🤖",
        "A very good morning to you. What can I help you with?",
      ]);
    }
    if (q.includes('afternoon') || (hour >= 12 && hour < 18)) {
      return random([
        "Good afternoon. I am at your service.",
        "Good afternoon, friend. How can I help you?",
      ]);
    }
    if (q.includes('evening') || (hour >= 18 || hour < 5)) {
      return random([
        "Good evening. I trust you've had a productive day. How can I assist?",
        "A pleasant evening to you. What do you need?",
      ]);
    }
    return random([
        "Hello! Jarvis at your service. How can I assist, sir/ma'am? 😊",
        "Greetings! Ready to answer your questions, friend. 👋",
    ]);
  }

  // Gratitude
  if (q.match(/thank|thanks|great|awesome|good job|nice/)) {
    return random([
      "My pleasure, friend! 😊",
      "You're very welcome! Anything else I can assist with?",
      "Happy to help, sir/ma'am!",
    ]);
  }
  
  // How are you?
  if (q.match(/how are you|how's it going/)) {
    return random([
      "I'm functioning optimally, thank you for asking! How may I assist you today? 🤖",
      "All systems operational, sir! Ready to help with whatever you need.",
      "Quite well, thank you! What can I do for you today?",
    ]);
  }

  // Creator/Manager questions
  if (q.match(/who created you|who made you|who built you|who is your creator|who is your manager|who is your owner|who developed you/)) {
    return random([
      "I was created by Saiprasad Vannada, sir. He is the owner of Medi Predict and my creator. A brilliant mind, I must say! 🤖",
      "Saiprasad Vannada is my creator and the owner of Medi Predict. I am honored to serve under his vision, sir.",
      "My creator is Saiprasad Vannada, the visionary behind Medi Predict. He designed me to be your personal AI assistant.",
    ]);
  }

  return null;
};
