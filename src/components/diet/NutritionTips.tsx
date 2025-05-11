
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const NutritionTips = () => {
  const nutritionTips = [
    {
      category: "general",
      tips: [
        {
          title: "Eat a Rainbow",
          description: "Include a variety of colorful vegetables and fruits in your diet to ensure you get a wide range of nutrients and antioxidants.",
          details: "Different colors in fruits and vegetables indicate different phytonutrients. For example, red foods like tomatoes contain lycopene, while orange/yellow foods contain carotenoids, and green vegetables are rich in folate and other vitamins."
        },
        {
          title: "Stay Hydrated",
          description: "Drink at least 8 glasses of water daily to maintain proper hydration, which is essential for all bodily functions.",
          details: "Water helps regulate body temperature, lubricates joints, transports nutrients, and removes waste products. Proper hydration can also help control hunger, as thirst is often mistaken for hunger."
        },
        {
          title: "Portion Control",
          description: "Be mindful of portion sizes to avoid overeating, even when consuming healthy foods.",
          details: "Using smaller plates, measuring portions, and eating slowly can help control portions. Remember that a serving of meat should be about the size of your palm, and a serving of grains should be about the size of your fist."
        },
        {
          title: "Limit Processed Foods",
          description: "Minimize consumption of ultra-processed foods, which often contain excessive sugar, unhealthy fats, and sodium.",
          details: "Processed foods typically contain additives, preservatives, and artificial ingredients that can contribute to inflammation and other health issues. Focus on whole foods that don't come in packages with long ingredient lists."
        }
      ]
    },
    {
      category: "weightLoss",
      tips: [
        {
          title: "Create a Calorie Deficit",
          description: "To lose weight, you need to consume fewer calories than you burn. Aim for a moderate deficit of 500-750 calories per day for sustainable weight loss.",
          details: "This deficit will lead to approximately 1-1.5 pounds of weight loss per week, which is considered a healthy and sustainable rate that minimizes muscle loss and metabolic adaptation."
        },
        {
          title: "Focus on Protein",
          description: "Include protein in every meal to help preserve muscle mass and increase satiety while in a calorie deficit.",
          details: "Protein has a higher thermic effect than carbs or fats, meaning your body burns more calories digesting it. Aim for 1.6-2.2g of protein per kg of body weight when trying to lose weight while preserving muscle."
        },
        {
          title: "Fiber-Rich Foods",
          description: "Incorporate high-fiber foods to stay fuller longer and support digestive health.",
          details: "Fiber adds bulk to your diet without adding calories, helping you feel satisfied with fewer calories. Good sources include vegetables, fruits, legumes, and whole grains."
        },
        {
          title: "Strategic Meal Timing",
          description: "Consider eating larger meals earlier in the day and smaller meals in the evening.",
          details: "Some research suggests that front-loading your calories can support weight loss by aligning food intake with your circadian rhythm. This may help improve insulin sensitivity and metabolic health."
        }
      ]
    },
    {
      category: "muscleGain",
      tips: [
        {
          title: "Calorie Surplus",
          description: "Consume 250-500 calories above your maintenance level to support muscle growth without excessive fat gain.",
          details: "A moderate surplus provides the extra energy needed for muscle growth while minimizing fat accumulation. Your body can only build so much muscle at once, so excessive calories beyond what's needed will be stored as fat."
        },
        {
          title: "Prioritize Protein Quality",
          description: "Choose complete protein sources that provide all essential amino acids, such as animal products, soy, and quinoa.",
          details: "Complete proteins contain all nine essential amino acids in the proportions needed for muscle protein synthesis. For plant-based eaters, combining different plant proteins can create complete protein profiles."
        },
        {
          title: "Post-Workout Nutrition",
          description: "Consume protein and carbohydrates within 1-2 hours after training to optimize recovery and muscle growth.",
          details: "After exercise, your muscles are particularly receptive to nutrients. Consuming 20-40g of protein along with carbohydrates helps replenish glycogen stores and provides the amino acids needed for muscle repair and growth."
        },
        {
          title: "Progressive Overload",
          description: "Gradually increase training volume and intensity alongside proper nutrition to stimulate continuous muscle development.",
          details: "No matter how perfect your diet is, muscle won't grow without the stimulus provided by progressive resistance training. Your nutrition should support your training program by providing the building blocks and energy needed for adaptation."
        }
      ]
    },
    {
      category: "performance",
      tips: [
        {
          title: "Carb Timing",
          description: "Consume most carbohydrates around training sessions to fuel performance and recovery.",
          details: "Carbohydrates are your body's preferred source of energy during high-intensity exercise. Consuming carbs 1-3 hours before training provides readily available glucose, while post-workout carbs help replenish glycogen stores."
        },
        {
          title: "Intra-Workout Nutrition",
          description: "For sessions lasting longer than 90 minutes, consider consuming easily digestible carbohydrates during training.",
          details: "During prolonged exercise, consuming 30-60g of carbohydrates per hour can help maintain blood glucose levels and delay fatigue. Options include sports drinks, gels, or easily digestible foods like bananas."
        },
        {
          title: "Electrolyte Balance",
          description: "Replace electrolytes lost through sweat, especially during intense or prolonged exercise in hot conditions.",
          details: "Sodium, potassium, calcium, and magnesium are crucial for muscle contractions and nerve function. Heavy sweaters may need additional sodium supplementation to prevent cramping and maintain performance."
        },
        {
          title: "Periodize Nutrition",
          description: "Adjust your nutrition based on training phases, increasing calories during high-volume periods and reducing them during deloads.",
          details: "Just as training follows cycles of intensity and volume, nutrition should be periodized to match energy demands. This approach optimizes body composition and performance while preventing plateaus and overtraining."
        }
      ]
    }
  ];

  return (
    <div>
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="weightLoss">Weight Loss</TabsTrigger>
          <TabsTrigger value="muscleGain">Muscle Gain</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        {nutritionTips.map((category) => (
          <TabsContent key={category.category} value={category.category}>
            <div className="grid gap-4 sm:grid-cols-2">
              {category.tips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                    <CardDescription>{tip.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-20">
                      <p className="text-sm text-muted-foreground">{tip.details}</p>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NutritionTips;
