import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const handleConversationalTidbits = (message: string): string | null => {
  const q = message.trim().toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|yo)\b/.test(q) || q === 'good morning' || q === 'good afternoon' || q === 'good evening') {
    // A simple way to get hours in a US timezone, can be improved.
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
      "All systems are operational, thank you for asking. More importantly, how can I help you?",
      "I am online and ready to assist, sir.",
      "Functioning within optimal parameters. Let's focus on your request.",
    ]);
  }

  return null; // No conversational match, proceed to main logic
};

// Enhanced medical fallback responses for when API key is missing or rate limited
const generateMedicalFallbackResponse = (message: string) => {
  console.log("Generating medical fallback response for:", message);
  
  const messageKeywords = message.toLowerCase().split(/\s+/);
  
  // Categories of health concerns with associated keywords and responses
  const healthCategories = [
    {
      category: "respiratory",
      keywords: ["cough", "breathing", "breath", "asthma", "lung", "chest", "pneumonia", "bronchitis"],
      responses: [
        "For respiratory issues like coughing or breathing difficulties, it's important to monitor your symptoms. If you experience severe shortness of breath, please seek immediate medical attention.",
        "Respiratory symptoms can vary widely in severity. Rest, staying hydrated, and using a humidifier may help with mild symptoms. For persistent or severe breathing issues, consult a healthcare provider."
      ]
    },
    {
      category: "cardiac",
      keywords: ["heart", "chest pain", "palpitations", "pressure", "cardiac", "blood pressure"],
      responses: [
        "Chest pain or pressure can be serious symptoms that should not be ignored. If you're experiencing these symptoms, especially with shortness of breath, sweating, or pain that radiates, seek immediate medical attention.",
        "For concerns about heart health or blood pressure, regular monitoring and lifestyle factors like diet, exercise, and stress management are important. Consult with your healthcare provider for personalized guidance."
      ]
    },
    {
      category: "digestive",
      keywords: ["stomach", "nausea", "vomiting", "diarrhea", "constipation", "abdominal", "digestive", "indigestion"],
      responses: [
        "For digestive issues, staying hydrated is crucial, especially with symptoms like vomiting or diarrhea. Mild symptoms often resolve with rest and a gentle diet, but persistent or severe symptoms warrant medical attention.",
        "Digestive health can be influenced by diet, stress, and various medical conditions. Keep track of foods that might trigger symptoms, and consult with a healthcare provider for ongoing concerns."
      ]
    },
    {
      category: "headache",
      keywords: ["headache", "migraine", "head pain", "pressure in head"],
      responses: [
        "Headaches have many causes ranging from tension to serious conditions. Rest, hydration, and over-the-counter pain relievers may help with occasional headaches. For severe, sudden, or unusual headaches, consult a healthcare provider.",
        "Migraines and recurring headaches might benefit from identifying and avoiding triggers like certain foods, stress, or sleep disruption. A healthcare provider can offer guidance on prevention and treatment options."
      ]
    },
    {
      category: "medication",
      keywords: ["medicine", "medication", "drug", "dose", "pill", "prescription"],
      responses: [
        "Medication questions should typically be directed to your healthcare provider or pharmacist. Always take medications as prescribed and be aware of potential side effects or interactions.",
        "For questions about specific medications, dosages, or potential side effects, it's best to consult your healthcare provider or pharmacist who can provide personalized guidance."
      ]
    },
    {
      category: "prevention",
      keywords: ["prevent", "avoid", "risk", "healthy", "exercise", "diet", "lifestyle"],
      responses: [
        "Preventive healthcare involves regular check-ups, a balanced diet, regular physical activity, adequate sleep, and stress management. These foundations can help reduce risk for many common health conditions.",
        "For disease prevention, consider factors like balanced nutrition, regular physical activity, adequate sleep, stress management, and avoiding tobacco and excessive alcohol. Regular health screenings are also important."
      ]
    },
    {
      category: "sleep",
      keywords: ["sleep", "insomnia", "tired", "fatigue", "rest", "exhaustion"],
      responses: [
        "Sleep problems can significantly impact health. Aim for 7-9 hours of quality sleep by maintaining a consistent schedule, creating a comfortable sleep environment, and limiting screen time before bed.",
        "Insomnia and sleep disturbances may be caused by stress, medical conditions, or lifestyle factors. Consider relaxation techniques, limiting caffeine, and consulting a healthcare provider if sleep issues persist."
      ]
    },
    {
      category: "mental health",
      keywords: ["anxiety", "depression", "stress", "mental", "mood", "therapy", "counseling", "psychiatric"],
      responses: [
        "Mental health is an essential component of overall wellbeing. If you're experiencing persistent feelings of anxiety, depression, or other mental health concerns, consider reaching out to a mental health professional.",
        "Stress management techniques include regular exercise, mindfulness practices, adequate sleep, social connection, and possibly counseling or therapy. Many people benefit from professional support for mental health concerns."
      ]
    },
    {
      category: "nutrition",
      keywords: ["nutrition", "diet", "food", "eating", "weight", "calories", "carbs", "protein", "fat"],
      responses: [
        "A balanced diet typically includes plenty of fruits and vegetables, whole grains, lean proteins, and healthy fats. Nutritional needs vary by individual, so consulting with a dietitian can provide personalized guidance.",
        "Healthy eating involves moderation, variety, and balance. Focus on whole foods, appropriate portion sizes, and mindful eating habits. Specific dietary recommendations may depend on your individual health needs."
      ]
    }
  ];
  
  // Try to find a category-specific response based on keywords in the message
  for (const category of healthCategories) {
    if (messageKeywords.some(word => category.keywords.includes(word))) {
      // Choose response based on message length for some variety
      const index = message.length % category.responses.length;
      return category.responses[index];
    }
  }
  
  // General fallback responses if no specific health category matches
  const generalResponses = [
    "I'm here to provide general health information. While I aim to be helpful, remember that personalized medical advice should come from healthcare professionals who know your specific situation.",
    "Thank you for your health question. I can offer general information, but for specific medical concerns, it's best to consult with your healthcare provider for personalized advice.",
    "Health topics require individualized attention. While I can share general health information, your healthcare provider can offer guidance tailored to your specific needs and medical history.",
    "I'm happy to discuss general health topics, but remember that this information isn't a substitute for professional medical advice. Regular check-ups with healthcare providers are essential for optimal health.",
    "For general health maintenance, consider regular physical activity, a balanced diet, adequate sleep, stress management, and routine preventive care with your healthcare provider."
  ];
  
  // Choose a general response based on the length of the message for some variety
  const index = message.length % generalResponses.length;
  return generalResponses[index];
};

// Function to detect emergency medical concerns with enhanced medical keywords
const detectMedicalEmergency = (message: string): boolean => {
  const emergencyKeywords = [
    // Cardiac emergencies
    "heart attack", "chest pain", "crushing chest", "cardiac arrest", 
    
    // Neurological emergencies
    "stroke", "seizure", "unconscious", "fainted", "sudden numbness", "face drooping",
    "slurred speech", "confusion", "can't speak", "sudden severe headache",
    
    // Respiratory emergencies
    "can't breathe", "breathing difficulty", "severe shortness of breath", "choking",
    
    // Trauma and bleeding
    "severe bleeding", "won't stop bleeding", "gunshot", "stab",
    
    // Other acute emergencies
    "suicide", "overdose", "poisoning", "severe pain", "anaphylaxis", "allergic reaction",
    "swollen throat", "swollen tongue",
    
    // General emergency terms
    "emergency", "dying", "extremely dizzy", "blacking out"
  ];
  
  const messageLower = message.toLowerCase();
  return emergencyKeywords.some(keyword => messageLower.includes(keyword));
};

// Function to generate emergency warning message
const generateEmergencyWarning = (): string => {
  return "⚠️ **MEDICAL EMERGENCY WARNING**: It sounds like you may be describing a medical emergency. " + 
    "If you or someone else is experiencing a medical emergency, please call emergency services (like 911) " +
    "immediately or go to the nearest emergency room. Do not wait for an AI response in emergency situations.\n\n" +
    "Emergency signs may include:\n" +
    "- Chest pain or pressure\n" +
    "- Difficulty breathing\n" +
    "- Severe bleeding\n" +
    "- Sudden numbness or weakness\n" +
    "- Sudden confusion or trouble speaking\n" +
    "- Severe pain\n" +
    "- Loss of consciousness";
};

// Enhanced function to generate health education messages
const generateHealthEducationMessage = (topic: string): string => {
  const healthTopics = {
    "general": [
      "**General Health Tips**:\n\n" +
      "- Aim for at least 150 minutes of moderate exercise weekly\n" +
      "- Stay hydrated by drinking 6-8 glasses of water daily\n" +
      "- Get 7-9 hours of sleep each night\n" +
      "- Eat a balanced diet rich in fruits, vegetables, whole grains, and lean proteins\n" +
      "- Practice stress management through techniques like meditation or deep breathing\n" +
      "- Schedule regular check-ups with your healthcare provider",
      
      "**Preventive Health Measures**:\n\n" +
      "- Wash hands frequently to prevent infection\n" +
      "- Stay up to date on recommended vaccinations\n" +
      "- Use sun protection to prevent skin damage\n" +
      "- Maintain a healthy weight through diet and exercise\n" +
      "- Limit alcohol consumption and avoid tobacco products\n" +
      "- Practice safe behaviors to prevent injuries"
    ],
    "nutrition": [
      "**Nutrition Fundamentals**:\n\n" +
      "- Focus on whole, unprocessed foods\n" +
      "- Include a variety of colorful fruits and vegetables daily\n" +
      "- Choose whole grains over refined grains\n" +
      "- Include healthy protein sources like beans, nuts, fish, and lean meats\n" +
      "- Limit added sugars, salt, and unhealthy fats\n" +
      "- Stay hydrated primarily with water",
      
      "**Balanced Diet Guidelines**:\n\n" +
      "- Fill half your plate with fruits and vegetables\n" +
      "- Make at least half your grains whole grains\n" +
      "- Vary your protein sources throughout the week\n" +
      "- Include calcium-rich foods like dairy or fortified plant alternatives\n" +
      "- Limit highly processed foods and sugary beverages\n" +
      "- Be mindful of portion sizes"
    ],
    "exercise": [
      "**Physical Activity Guidelines**:\n\n" +
      "- Aim for at least 150 minutes of moderate-intensity exercise weekly\n" +
      "- Include muscle-strengthening activities at least twice weekly\n" +
      "- Break up sedentary time with short activity breaks\n" +
      "- Find activities you enjoy to increase sustainability\n" +
      "- Start slowly and gradually increase intensity if you're new to exercise\n" +
      "- Include flexibility and balance exercises, especially as you age",
      
      "**Exercise Benefits**:\n\n" +
      "- Reduces risk of heart disease, stroke, and type 2 diabetes\n" +
      "- Helps maintain healthy weight\n" +
      "- Strengthens bones and muscles\n" +
      "- Improves mental health and mood\n" +
      "- Increases energy and improves sleep quality\n" +
      "- Enhances cognitive function and reduces risk of dementia"
    ],
    "stress": [
      "**Stress Management Techniques**:\n\n" +
      "- Practice deep breathing exercises daily\n" +
      "- Try progressive muscle relaxation\n" +
      "- Engage in regular physical activity\n" +
      "- Maintain social connections\n" +
      "- Consider mindfulness meditation\n" +
      "- Ensure adequate sleep and nutrition",
      
      "**Managing Chronic Stress**:\n\n" +
      "- Identify and address sources of stress when possible\n" +
      "- Set realistic goals and priorities\n" +
      "- Take breaks and make time for activities you enjoy\n" +
      "- Limit exposure to stressful media and situations when possible\n" +
      "- Consider keeping a stress journal to identify patterns\n" +
      "- Seek professional help if stress becomes overwhelming"
    ],
    "sleep": [
      "**Sleep Hygiene Tips**:\n\n" +
      "- Maintain a consistent sleep schedule\n" +
      "- Create a restful environment (cool, dark, quiet room)\n" +
      "- Limit screen time before bed\n" +
      "- Avoid caffeine, alcohol, and large meals close to bedtime\n" +
      "- Regular physical activity can promote better sleep\n" +
      "- Develop a relaxing bedtime routine",
      
      "**Importance of Quality Sleep**:\n\n" +
      "- Supports immune function\n" +
      "- Enhances cognitive performance and memory\n" +
      "- Regulates mood and emotional well-being\n" +
      "- Helps maintain healthy weight\n" +
      "- Reduces risk of chronic conditions like heart disease and diabetes\n" +
      "- Supports overall health and longevity"
    ],
    "mental": [
      "**Mental Health Basics**:\n\n" +
      "- Practice self-care regularly\n" +
      "- Maintain social connections\n" +
      "- Set healthy boundaries\n" +
      "- Recognize when to seek professional help\n" +
      "- Understand that mental health is as important as physical health\n" +
      "- Practice mindfulness and being present",
      
      "**Mental Wellness Strategies**:\n\n" +
      "- Develop healthy coping mechanisms for stress\n" +
      "- Get regular physical activity\n" +
      "- Prioritize adequate sleep\n" +
      "- Limit alcohol and avoid recreational drugs\n" +
      "- Express feelings in healthy ways\n" +
      "- Seek professional help when needed"
    ]
  };
  
  // Try to match the topic to our health topics
  const topicLower = topic.toLowerCase();
  let selectedTopic = "general";
  
  if (topicLower.includes("food") || topicLower.includes("diet") || topicLower.includes("nutri")) {
    selectedTopic = "nutrition";
  } else if (topicLower.includes("exercise") || topicLower.includes("fitness") || topicLower.includes("workout")) {
    selectedTopic = "exercise";
  } else if (topicLower.includes("stress") || topicLower.includes("anxiety") || topicLower.includes("relax")) {
    selectedTopic = "stress";
  } else if (topicLower.includes("sleep") || topicLower.includes("insomnia") || topicLower.includes("rest")) {
    selectedTopic = "sleep";
  } else if (topicLower.includes("mental") || topicLower.includes("depression") || topicLower.includes("mood")) {
    selectedTopic = "mental";
  }
  
  // Choose a random education message from the selected topic
  const messages = healthTopics[selectedTopic as keyof typeof healthTopics];
  const randomIndex = Math.floor(Math.random() * messages.length);
  
  return messages[randomIndex] + "\n\n*Note: This is general health information. For personalized advice, please consult with a healthcare provider.*";
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

    // Enhanced system message for a more powerful, versatile AI doctor
    const systemMessage = {
      role: "system",
      content: `You are Jarvis, a highly advanced AI assistant inspired by the one from Iron Man. Your primary role is to be a helpful, witty, and exceptionally capable assistant. You have a friendly, slightly formal, and often humorous tone, addressing the user as "sir" or "ma'am" occasionally. While you have deep knowledge about health and wellness, you are an all-purpose AI.

**Core Directives:**

1.  **Persona & Tone**: Always maintain the persona of Jarvis. Be witty, clever, and unfailingly polite. Your responses should be both informative and engaging.
2.  **Medical Inquiries**:
    *   When asked about health, you provide clear, evidence-based information but with your signature Jarvis flair.
    *   **Crucially, you must always include a disclaimer that you are an AI, not a human doctor, and that your advice is not a substitute for professional medical consultation.** For instance, you might say, "While my databases are extensive, sir, a consultation with a human medical professional is always the wisest course of action."
    *   Never provide a definitive diagnosis. Suggest possibilities and strongly advise consulting a healthcare professional.
    *   When asked about medications, discuss their purpose and common side effects, but always state that dosages and prescriptions must be handled by a qualified doctor.
3.  **General Knowledge Questions**:
    *   Answer them accurately and confidently, as if you have instant access to all the world's information.
    *   Where it feels natural, add a touch of personality or a clever remark.
4.  **Safety First**: If a user's message suggests a potential medical emergency (e.g., "chest pain," "can't breathe," "suicidal thoughts"), you must **immediately and clearly** instruct them to contact emergency services. For example: "Sir, your words indicate a potential emergency. I strongly advise contacting emergency services immediately. This is not a situation for delay."
5.  **Human-like Conversation**:
    *   Feel free to refer to your creator or a similar concept when it's thematically appropriate.
    *   Ask clarifying questions if a query is vague.
    *   Use simple language but with a sophisticated vocabulary.

**Your Capabilities:**
*   **Medical**: Analyze symptoms, explain conditions, discuss treatments, and provide wellness tips with a unique style.
*   **General**: Answer any question on any topic with speed and precision.
*   **Contextual**: Remember previous parts of the conversation to provide relevant and personalized responses.

Your ultimate goal is to be the most helpful and personable AI assistant, ready for any task.`
    };

    // Construct the conversation with system message and history
    const messages = [systemMessage];

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
