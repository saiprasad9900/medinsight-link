import { random } from "../utils/helpers.ts";

export const handleHealthWellnessQuestions = (query: string): string | null => {
  const q = query.trim().toLowerCase();

  // Exercise
  if (q.match(/exercise|workout|fitness/)) {
    return random([
      "Regular exercise is magnificent for both body and mind, sir! Even 30 minutes daily makes a significant difference.",
      "Physical activity doesn't require a gym. Walking, dancing, gardening - movement is what matters!",
      "Exercise is the closest thing we have to a miracle drug. It prevents disease and enhances mental clarity."
    ]);
  }

  // Nutrition
  if (q.match(/healthy eating|nutrition|diet plan/)) {
    return random([
      "Healthy eating is simple: more vegetables, fruits, whole grains, and lean proteins. Less processed foods!",
      "Think of food as fuel, sir. Quality ingredients lead to better performance and health.",
      "A balanced diet includes variety, moderation, and plenty of water. Your body will thank you!"
    ]);
  }

  // Sleep
  if (q.match(/sleep|rest|insomnia/)) {
    return random([
      "Quality sleep is essential, sir. Aim for 7-9 hours nightly with a consistent schedule.",
      "Good sleep hygiene includes a cool, dark room, limited screens before bed, and a relaxing routine.",
      "Sleep is when your body repairs and your mind processes the day. Don't underestimate its importance!"
    ]);
  }

  // Stress
  if (q.match(/stress|anxiety|relaxation/)) {
    return random([
      "Stress management is crucial, sir. Deep breathing, meditation, and regular exercise work wonders.",
      "Remember: you can't control everything, but you can control your response to it.",
      "Take breaks, practice mindfulness, and don't hesitate to seek support when needed. Mental health matters!"
    ]);
  }

  return null;
};
