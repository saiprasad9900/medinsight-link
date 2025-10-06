export const detectMedicalEmergency = (message: string): boolean => {
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

export const generateEmergencyWarning = (): string => {
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
