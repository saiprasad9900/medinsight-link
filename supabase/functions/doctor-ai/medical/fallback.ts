export const generateMedicalFallbackResponse = (message: string): string => {
  const messageWords = message.toLowerCase().split(/\s+/);
  const messageKeywords = messageWords.filter(word => word.length > 3);
  
  const healthCategories = [
    {
      category: "symptoms",
      keywords: ["symptom", "feel", "pain", "ache", "sore", "hurt", "discomfort", "sick"],
      responses: [
        "I understand you're experiencing some symptoms. While I can provide general information, it's important to consult with a healthcare provider for a proper evaluation, especially if symptoms persist or worsen.",
        "Symptoms can have many different causes. If you're concerned about what you're experiencing, I'd recommend reaching out to a healthcare professional who can assess your specific situation."
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
      const index = message.length % category.responses.length;
      return category.responses[index];
    }
  }
  
  // General fallback responses if no specific health category matches
  const generalResponses = [
    "I'm here to provide general health information. While I aim to be helpful, remember that personalized medical advice should come from healthcare professionals who know your specific situation.",
    "Thank you for your health question. I can offer general information, but for specific medical concerns, it's best to consult with a healthcare provider for personalized advice.",
    "Health topics require individualized attention. While I can share general health information, your healthcare provider can offer guidance tailored to your specific needs and medical history.",
    "I'm happy to discuss general health topics, but remember that this information isn't a substitute for professional medical advice. Regular check-ups with healthcare providers are essential for optimal health.",
    "For general health maintenance, consider regular physical activity, a balanced diet, adequate sleep, stress management, and routine preventive care with your healthcare provider."
  ];
  
  const index = message.length % generalResponses.length;
  return generalResponses[index];
};
