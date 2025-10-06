import { random } from "../utils/helpers.ts";

export const handleGeneralLifeQuestions = (query: string): string | null => {
  const q = query.trim().toLowerCase();

  // Time and Schedule
  if (q.match(/what time is it|current time|time now/)) {
    return random([
      "I'm afraid I don't have access to real-time data, sir. Please check your device's clock for the current time.",
      "Time is relative, as Einstein would say! But for precise timing, I'd suggest checking your local timepiece.",
      "My internal chronometer isn't synced with your timezone, sir. Your device should have the accurate local time."
    ]);
  }

  if (q.match(/what day is it|what's today|today's date/)) {
    return random([
      "I don't have access to today's date, but your device should display the current date accurately, sir.",
      "Time flies when you're having fun! Check your calendar app for today's date.",
      "My calendar functions are offline, but your system clock should tell you exactly what day it is."
    ]);
  }

  // Weather
  if (q.match(/weather|temperature|rain|sunny|cloudy/)) {
    return random([
      "I'm not connected to weather services, sir. I'd recommend checking a reliable weather app or website.",
      "Weather prediction requires real-time data that I currently lack. Try your local weather service!",
      "For accurate weather information, I suggest consulting meteorological services in your area."
    ]);
  }

  // Technology Questions
  if (q.match(/how to use computer|computer basics|pc help/)) {
    return random([
      "Computers are fascinating machines, sir! Start with the basics: power button, mouse, keyboard. The rest follows naturally.",
      "Think of a computer as a very fast filing cabinet. You store, organize, and retrieve information. Practice makes perfect!",
      "Begin with simple tasks: opening programs, creating documents, browsing the internet. Each small step builds confidence."
    ]);
  }

  if (q.match(/internet|wifi|online/)) {
    return random([
      "The internet is humanity's greatest library, sir. It connects billions of devices worldwide for information sharing.",
      "WiFi allows wireless internet access. Ensure you're connected to a secure network for the best experience.",
      "The online world offers endless possibilities - just remember to browse safely and verify information sources!"
    ]);
  }

  if (q.match(/smartphone|mobile phone|cell phone/)) {
    return random([
      "Smartphones are pocket-sized computers, sir. They handle calls, messages, internet, apps, and much more!",
      "Your mobile device is quite powerful - it likely has more computing power than the computers that sent humans to the moon!",
      "Modern phones are digital Swiss Army knives. Take time to explore their features gradually."
    ]);
  }

  if (q.match(/social media|facebook|instagram|twitter/)) {
    return random([
      "Social media connects people globally, sir. Use it wisely - share positively and protect your privacy.",
      "These platforms can be wonderful for staying connected, but remember to take breaks and interact face-to-face too!",
      "Social networks are powerful tools. Be mindful of what you share and always verify information before believing it."
    ]);
  }

  if (q.match(/email|electronic mail/)) {
    return random([
      "Email revolutionized communication, sir. It's like digital postal service - instant, efficient, and global.",
      "Electronic mail allows you to send messages, documents, and media across the world in seconds!",
      "Think of email as your digital mailbox. Organize it well, and it becomes an excellent communication tool."
    ]);
  }

  return null;
};
