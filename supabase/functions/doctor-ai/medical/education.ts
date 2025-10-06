export const generateHealthEducationMessage = (topic: string): string => {
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
