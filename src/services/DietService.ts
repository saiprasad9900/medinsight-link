
import { DietFormData, DietPlan } from "@/types/diet";
import { toast } from "sonner";

// Sample plans for different profiles
const dietPlans: DietPlan[] = [
  // Weight loss plan (female)
  {
    id: "diet-plan-1",
    name: "Balanced Weight Loss Plan",
    description: "A calorie-controlled diet focused on whole foods and balanced macronutrients",
    type: "Weight Loss",
    createdAt: "2025-05-10T10:30:00Z",
    userStats: {
      gender: "female",
      age: 35,
      weight: 75,
      height: 165,
      activityLevel: "moderate",
      goal: "lose",
    },
    days: [
      {
        day: 1,
        totalNutrition: {
          calories: 1650,
          protein: 110,
          carbs: 175,
          fat: 55,
          fiber: 30,
        },
        meals: [
          {
            name: "Breakfast",
            time: "7:30 AM",
            tags: ["High Protein", "Low Sugar"],
            items: [
              { name: "Greek yogurt", portion: "200g" },
              { name: "Mixed berries", portion: "100g" },
              { name: "Almonds", portion: "15g" },
              { name: "Cinnamon", portion: "to taste" },
            ],
            nutrition: {
              calories: 350,
              protein: 25,
              carbs: 30,
              fat: 14,
            },
          },
          {
            name: "Morning Snack",
            time: "10:30 AM",
            tags: ["Protein", "Fiber"],
            items: [
              { name: "Apple", portion: "1 medium" },
              { name: "Low-fat string cheese", portion: "1 stick" },
            ],
            nutrition: {
              calories: 150,
              protein: 8,
              carbs: 20,
              fat: 4,
            },
          },
          {
            name: "Lunch",
            time: "1:00 PM",
            tags: ["Lean Protein", "Complex Carbs"],
            items: [
              { name: "Grilled chicken breast", portion: "120g" },
              { name: "Quinoa", portion: "100g cooked" },
              { name: "Roasted vegetables", portion: "150g" },
              { name: "Olive oil", portion: "1 tsp" },
              { name: "Lemon juice", portion: "1 tbsp" },
            ],
            nutrition: {
              calories: 450,
              protein: 35,
              carbs: 45,
              fat: 14,
            },
          },
          {
            name: "Afternoon Snack",
            time: "4:00 PM",
            tags: ["Plant Protein", "Fiber"],
            items: [
              { name: "Hummus", portion: "30g" },
              { name: "Carrot sticks", portion: "100g" },
              { name: "Cucumber slices", portion: "50g" },
            ],
            nutrition: {
              calories: 150,
              protein: 7,
              carbs: 15,
              fat: 7,
            },
          },
          {
            name: "Dinner",
            time: "7:00 PM",
            tags: ["Balanced", "Nutrient-Dense"],
            items: [
              { name: "Baked salmon", portion: "120g" },
              { name: "Sweet potato", portion: "150g" },
              { name: "Steamed broccoli", portion: "100g" },
              { name: "Olive oil", portion: "1 tsp" },
              { name: "Fresh herbs", portion: "to taste" },
            ],
            nutrition: {
              calories: 450,
              protein: 35,
              carbs: 45,
              fat: 16,
            },
          },
          {
            name: "Evening Snack (Optional)",
            time: "9:00 PM",
            tags: ["Protein", "Low Calorie"],
            items: [
              { name: "Cottage cheese", portion: "100g" },
              { name: "Cinnamon", portion: "to taste" },
            ],
            nutrition: {
              calories: 100,
              protein: 15,
              carbs: 5,
              fat: 2,
            },
          },
        ],
        shoppingList: {
          proteins: [
            { name: "Chicken breast", amount: "120g" },
            { name: "Salmon fillet", amount: "120g" },
            { name: "Greek yogurt", amount: "200g" },
            { name: "String cheese", amount: "1 stick" },
            { name: "Cottage cheese", amount: "100g" },
          ],
          produce: [
            { name: "Mixed berries", amount: "100g" },
            { name: "Apple", amount: "1 medium" },
            { name: "Sweet potato", amount: "1 medium" },
            { name: "Broccoli", amount: "100g" },
            { name: "Carrot", amount: "2 medium" },
            { name: "Cucumber", amount: "1 small" },
            { name: "Mixed vegetables for roasting", amount: "150g" },
          ],
          grains: [
            { name: "Quinoa", amount: "50g uncooked" },
          ],
          other: [
            { name: "Almonds", amount: "15g" },
            { name: "Hummus", amount: "30g" },
            { name: "Olive oil", amount: "2 tsp" },
            { name: "Cinnamon", amount: "to taste" },
            { name: "Fresh herbs", amount: "to taste" },
            { name: "Lemon", amount: "1 small" },
          ],
        },
        tips: [
          {
            title: "Hydration",
            content: "Drink at least 2 liters of water throughout the day. Consider herbal teas to provide variety."
          },
          {
            title: "Meal Timing",
            content: "Try to eat your last meal at least 2-3 hours before bedtime to support better digestion and sleep quality."
          },
          {
            title: "Mindful Eating",
            content: "Eat slowly and without distractions to better recognize hunger and fullness cues."
          },
        ],
      },
      // Additional days would be here
    ],
    notes: "This plan is calorie-controlled to support gradual weight loss while maintaining energy for daily activities and workouts. It emphasizes protein to preserve muscle mass and includes plenty of fiber-rich foods for satiety.",
  },
  
  // Maintenance plan (male)
  {
    id: "diet-plan-2",
    name: "Balanced Maintenance Plan",
    description: "A nutrient-dense diet to maintain current weight and support overall health",
    type: "Maintenance",
    createdAt: "2025-05-09T14:20:00Z",
    userStats: {
      gender: "male",
      age: 40,
      weight: 80,
      height: 178,
      activityLevel: "moderate",
      goal: "maintain",
    },
    days: [
      {
        day: 1,
        totalNutrition: {
          calories: 2400,
          protein: 150,
          carbs: 250,
          fat: 80,
          fiber: 35,
        },
        meals: [
          {
            name: "Breakfast",
            time: "7:00 AM",
            tags: ["High Protein", "Fiber"],
            items: [
              { name: "Oatmeal", portion: "80g dry" },
              { name: "Whey protein powder", portion: "30g" },
              { name: "Banana", portion: "1 medium" },
              { name: "Peanut butter", portion: "20g" },
              { name: "Chia seeds", portion: "10g" },
            ],
            nutrition: {
              calories: 550,
              protein: 40,
              carbs: 65,
              fat: 18,
            },
          },
          {
            name: "Morning Snack",
            time: "10:30 AM",
            tags: ["Protein", "Healthy Fats"],
            items: [
              { name: "Greek yogurt", portion: "150g" },
              { name: "Mixed nuts", portion: "30g" },
              { name: "Honey", portion: "1 tsp" },
            ],
            nutrition: {
              calories: 300,
              protein: 20,
              carbs: 15,
              fat: 15,
            },
          },
          {
            name: "Lunch",
            time: "1:00 PM",
            tags: ["Balanced", "Complex Carbs"],
            items: [
              { name: "Grilled steak", portion: "150g" },
              { name: "Brown rice", portion: "150g cooked" },
              { name: "Mixed vegetables", portion: "200g" },
              { name: "Olive oil", portion: "2 tsp" },
              { name: "Fresh herbs", portion: "to taste" },
            ],
            nutrition: {
              calories: 650,
              protein: 45,
              carbs: 70,
              fat: 22,
            },
          },
          {
            name: "Afternoon Snack",
            time: "4:00 PM",
            tags: ["Pre-Workout", "Energy"],
            items: [
              { name: "Apple", portion: "1 medium" },
              { name: "Protein bar", portion: "1 bar" },
            ],
            nutrition: {
              calories: 250,
              protein: 15,
              carbs: 30,
              fat: 8,
            },
          },
          {
            name: "Dinner",
            time: "7:30 PM",
            tags: ["Lean Protein", "Nutrient-Dense"],
            items: [
              { name: "Grilled chicken breast", portion: "180g" },
              { name: "Sweet potato", portion: "200g" },
              { name: "Spinach salad", portion: "100g" },
              { name: "Avocado", portion: "50g" },
              { name: "Balsamic vinaigrette", portion: "2 tbsp" },
            ],
            nutrition: {
              calories: 550,
              protein: 45,
              carbs: 55,
              fat: 18,
            },
          },
          {
            name: "Evening Snack",
            time: "9:30 PM",
            tags: ["Protein", "Slow Digesting"],
            items: [
              { name: "Cottage cheese", portion: "150g" },
              { name: "Mixed berries", portion: "100g" },
            ],
            nutrition: {
              calories: 200,
              protein: 25,
              carbs: 15,
              fat: 4,
            },
          },
        ],
        shoppingList: {
          proteins: [
            { name: "Steak", amount: "150g" },
            { name: "Chicken breast", amount: "180g" },
            { name: "Greek yogurt", amount: "150g" },
            { name: "Whey protein powder", amount: "30g" },
            { name: "Protein bar", amount: "1 bar" },
            { name: "Cottage cheese", amount: "150g" },
          ],
          produce: [
            { name: "Banana", amount: "1 medium" },
            { name: "Apple", amount: "1 medium" },
            { name: "Mixed berries", amount: "100g" },
            { name: "Sweet potato", amount: "1 large" },
            { name: "Mixed vegetables", amount: "200g" },
            { name: "Spinach", amount: "100g" },
            { name: "Avocado", amount: "1/2 medium" },
          ],
          grains: [
            { name: "Oats", amount: "80g" },
            { name: "Brown rice", amount: "75g uncooked" },
          ],
          other: [
            { name: "Peanut butter", amount: "20g" },
            { name: "Chia seeds", amount: "10g" },
            { name: "Mixed nuts", amount: "30g" },
            { name: "Honey", amount: "1 tsp" },
            { name: "Olive oil", amount: "2 tsp" },
            { name: "Fresh herbs", amount: "to taste" },
            { name: "Balsamic vinaigrette", amount: "2 tbsp" },
          ],
        },
        tips: [
          {
            title: "Hydration",
            content: "Aim for 2.5-3 liters of water daily, especially around workouts."
          },
          {
            title: "Protein Distribution",
            content: "Try to distribute your protein intake evenly throughout the day to optimize muscle maintenance and recovery."
          },
          {
            title: "Post-Workout Nutrition",
            content: "Consume a combination of protein and carbohydrates within 1-2 hours after training sessions."
          },
        ],
      },
      // Additional days would be here
    ],
    notes: "This maintenance plan is designed to support an active lifestyle while maintaining current weight. It provides adequate calories from balanced macronutrients to fuel daily activities and workouts while supporting recovery and overall health.",
  },
  
  // Muscle gain plan (male)
  {
    id: "diet-plan-3",
    name: "Muscle Building Plan",
    description: "A high-protein, calorie-surplus diet designed to support muscle growth and recovery",
    type: "Muscle Gain",
    createdAt: "2025-05-08T09:15:00Z",
    userStats: {
      gender: "male",
      age: 28,
      weight: 75,
      height: 180,
      activityLevel: "active",
      goal: "gain",
    },
    days: [
      {
        day: 1,
        totalNutrition: {
          calories: 3000,
          protein: 180,
          carbs: 350,
          fat: 85,
          fiber: 40,
        },
        meals: [
          {
            name: "Breakfast",
            time: "7:00 AM",
            tags: ["High Protein", "Energy"],
            items: [
              { name: "Eggs", portion: "4 whole" },
              { name: "Whole grain toast", portion: "2 slices" },
              { name: "Avocado", portion: "1/2 medium" },
              { name: "Spinach", portion: "50g" },
              { name: "Olive oil", portion: "1 tsp" },
            ],
            nutrition: {
              calories: 550,
              protein: 35,
              carbs: 30,
              fat: 32,
            },
          },
          {
            name: "Morning Snack",
            time: "10:00 AM",
            tags: ["Protein", "Energy"],
            items: [
              { name: "Protein shake", portion: "1 scoop" },
              { name: "Banana", portion: "1 large" },
              { name: "Almond butter", portion: "20g" },
              { name: "Oats", portion: "40g" },
              { name: "Milk", portion: "250ml" },
            ],
            nutrition: {
              calories: 450,
              protein: 30,
              carbs: 60,
              fat: 12,
            },
          },
          {
            name: "Lunch",
            time: "1:00 PM",
            tags: ["High Protein", "Complex Carbs"],
            items: [
              { name: "Grilled chicken breast", portion: "200g" },
              { name: "Brown rice", portion: "200g cooked" },
              { name: "Broccoli", portion: "150g" },
              { name: "Bell peppers", portion: "100g" },
              { name: "Olive oil", portion: "2 tsp" },
            ],
            nutrition: {
              calories: 700,
              protein: 50,
              carbs: 80,
              fat: 15,
            },
          },
          {
            name: "Pre-Workout Snack",
            time: "4:00 PM",
            tags: ["Energy", "Quick Digesting"],
            items: [
              { name: "Rice cakes", portion: "3" },
              { name: "Honey", portion: "1 tbsp" },
              { name: "Whey protein", portion: "1 scoop" },
            ],
            nutrition: {
              calories: 350,
              protein: 25,
              carbs: 45,
              fat: 5,
            },
          },
          {
            name: "Post-Workout",
            time: "6:30 PM",
            tags: ["Recovery", "Fast Absorption"],
            items: [
              { name: "Whey protein", portion: "1 scoop" },
              { name: "Dextrose", portion: "30g" },
              { name: "Creatine", portion: "5g" },
              { name: "Water", portion: "500ml" },
            ],
            nutrition: {
              calories: 200,
              protein: 25,
              carbs: 30,
              fat: 1,
            },
          },
          {
            name: "Dinner",
            time: "7:30 PM",
            tags: ["Protein", "Recovery"],
            items: [
              { name: "Lean beef", portion: "200g" },
              { name: "Sweet potato", portion: "200g" },
              { name: "Mixed vegetables", portion: "200g" },
              { name: "Olive oil", portion: "2 tsp" },
            ],
            nutrition: {
              calories: 600,
              protein: 45,
              carbs: 60,
              fat: 20,
            },
          },
          {
            name: "Evening Snack",
            time: "10:00 PM",
            tags: ["Slow Digesting Protein"],
            items: [
              { name: "Casein protein", portion: "1 scoop" },
              { name: "Greek yogurt", portion: "150g" },
              { name: "Mixed nuts", portion: "15g" },
              { name: "Berries", portion: "50g" },
            ],
            nutrition: {
              calories: 350,
              protein: 40,
              carbs: 20,
              fat: 10,
            },
          },
        ],
        shoppingList: {
          proteins: [
            { name: "Eggs", amount: "1 dozen" },
            { name: "Chicken breast", amount: "200g" },
            { name: "Lean beef", amount: "200g" },
            { name: "Whey protein", amount: "2 scoops" },
            { name: "Casein protein", amount: "1 scoop" },
            { name: "Greek yogurt", amount: "150g" },
            { name: "Milk", amount: "250ml" },
          ],
          produce: [
            { name: "Spinach", amount: "50g" },
            { name: "Banana", amount: "1 large" },
            { name: "Broccoli", amount: "150g" },
            { name: "Bell peppers", amount: "100g" },
            { name: "Sweet potato", amount: "200g" },
            { name: "Mixed vegetables", amount: "200g" },
            { name: "Berries", amount: "50g" },
            { name: "Avocado", amount: "1/2 medium" },
          ],
          grains: [
            { name: "Whole grain bread", amount: "2 slices" },
            { name: "Brown rice", amount: "100g uncooked" },
            { name: "Oats", amount: "40g" },
            { name: "Rice cakes", amount: "3" },
          ],
          other: [
            { name: "Olive oil", amount: "5 tsp" },
            { name: "Almond butter", amount: "20g" },
            { name: "Honey", amount: "1 tbsp" },
            { name: "Dextrose", amount: "30g" },
            { name: "Creatine", amount: "5g" },
            { name: "Mixed nuts", amount: "15g" },
          ],
        },
        tips: [
          {
            title: "Protein Timing",
            content: "Distribute protein intake evenly throughout the day, aiming for 20-40g per meal."
          },
          {
            title: "Calorie Surplus",
            content: "To build muscle, you need to consume more calories than you burn, but focus on quality nutrition."
          },
          {
            title: "Recovery",
            content: "Support your training with adequate sleep (7-9 hours) and consider including anti-inflammatory foods like fatty fish and berries."
          },
          {
            title: "Hydration",
            content: "Aim for 3-4 liters of water daily, especially on training days."
          },
        ],
      },
      // Additional days would be here
    ],
    notes: "This muscle-building plan provides a moderate calorie surplus to support lean muscle growth while minimizing fat gain. It prioritizes protein and nutrient timing around workouts to optimize recovery and adaptation.",
  },
];

/**
 * Generates a personalized diet plan based on user inputs
 */
export const generateDietPlan = async (formData: DietFormData): Promise<DietPlan> => {
  // In a real app, this would call an API endpoint or run a complex algorithm
  // For demo purposes, we'll select a sample plan based on the user's goal and modify it
  
  try {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let selectedPlanIndex = 0;
    
    // Select base plan template based on goal
    if (formData.goal === "lose") {
      selectedPlanIndex = 0; // Weight loss plan
    } else if (formData.goal === "maintain") {
      selectedPlanIndex = 1; // Maintenance plan
    } else if (formData.goal === "gain") {
      selectedPlanIndex = 2; // Muscle gain plan
    }
    
    // Get base plan
    const basePlan = { ...dietPlans[selectedPlanIndex] };
    
    // Generate a unique ID
    basePlan.id = `diet-plan-${Date.now()}`;
    basePlan.createdAt = new Date().toISOString();
    
    // Customize plan based on user data
    basePlan.name = generatePlanName(formData);
    
    // Update user stats
    basePlan.userStats = {
      gender: formData.gender,
      age: formData.age,
      weight: formData.weight,
      height: formData.height,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
    };
    
    // Adjust calories based on user data and intensity level
    if (formData.gender === "female") {
      // Adjust calories for female users
      for (const day of basePlan.days) {
        const intensityAdjustment = (formData.intensityLevel - 3) * 50;
        day.totalNutrition.calories = Math.max(1200, day.totalNutrition.calories - 300 + intensityAdjustment);
        
        // Adjust macros proportionally
        const calorieRatio = day.totalNutrition.calories / dietPlans[selectedPlanIndex].days[0].totalNutrition.calories;
        day.totalNutrition.protein = Math.round(day.totalNutrition.protein * calorieRatio);
        day.totalNutrition.carbs = Math.round(day.totalNutrition.carbs * calorieRatio);
        day.totalNutrition.fat = Math.round(day.totalNutrition.fat * calorieRatio);
        
        // Adjust each meal's calories and macros
        for (const meal of day.meals) {
          meal.nutrition.calories = Math.round(meal.nutrition.calories * calorieRatio);
          meal.nutrition.protein = Math.round(meal.nutrition.protein * calorieRatio);
          meal.nutrition.carbs = Math.round(meal.nutrition.carbs * calorieRatio);
          meal.nutrition.fat = Math.round(meal.nutrition.fat * calorieRatio);
        }
      }
    }
    
    // Adjust meal frequency based on preference
    if (formData.mealPreference !== "3meals") {
      adjustMealFrequency(basePlan, formData.mealPreference);
    }
    
    // Apply dietary restrictions if any
    if (formData.dietaryRestrictions.length > 0) {
      applyDietaryRestrictions(basePlan, formData.dietaryRestrictions);
    }
    
    // Generate personalized notes
    basePlan.notes = generatePersonalizedNotes(formData);
    
    return basePlan;
    
  } catch (error) {
    console.error("Error generating diet plan:", error);
    toast.error("Failed to generate diet plan");
    throw error;
  }
};

/**
 * Fetches recent diet plans for the current user
 */
export const fetchRecentDietPlans = async (): Promise<DietPlan[]> => {
  // In a real app, this would fetch from an API or database
  // For demo purposes, return sample plans
  
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return sample plans
  return dietPlans;
};

// Helper functions

const generatePlanName = (formData: DietFormData): string => {
  const goalNames = {
    lose: "Weight Loss",
    maintain: "Maintenance",
    gain: "Muscle Building"
  };
  
  const intensityNames = [
    "Gentle",
    "Moderate",
    "Standard",
    "Advanced",
    "Intensive"
  ];
  
  const goalName = goalNames[formData.goal as keyof typeof goalNames];
  const intensityName = intensityNames[formData.intensityLevel - 1];
  
  return `${intensityName} ${goalName} Plan`;
};

const adjustMealFrequency = (plan: DietPlan, preference: string): void => {
  // Implementation would adjust the number of meals while maintaining total calories
  // This is a simplified version for demonstration
  
  const numMeals = parseInt(preference.replace("meals", ""));
  
  for (const day of plan.days) {
    // If current meal count doesn't match preference
    if (day.meals.length !== numMeals) {
      // In a real implementation, this would intelligently redistribute meals
      // For demo purposes, we'll just add or remove snack meals
      
      const currentMeals = [...day.meals];
      day.meals = [];
      
      if (numMeals > currentMeals.length) {
        // Need to add meals
        day.meals = [...currentMeals];
        
        // Add extra snacks as needed
        for (let i = currentMeals.length; i < numMeals; i++) {
          day.meals.push({
            name: `Snack ${i}`,
            time: `${12 + i}:00 PM`,
            tags: ["Added Snack"],
            items: [
              { name: "Protein bar", portion: "1 bar" }
            ],
            nutrition: {
              calories: 150,
              protein: 10,
              carbs: 15,
              fat: 5
            }
          });
        }
      } else {
        // Need to remove meals - keep main meals and essential snacks
        const mainMeals = currentMeals.filter(meal => 
          meal.name.includes("Breakfast") || 
          meal.name.includes("Lunch") || 
          meal.name.includes("Dinner")
        );
        
        const snacks = currentMeals.filter(meal => 
          !mainMeals.includes(meal)
        );
        
        // Always keep main meals
        day.meals = [...mainMeals];
        
        // Add snacks until we reach desired meal count
        const snacksToAdd = numMeals - mainMeals.length;
        if (snacksToAdd > 0) {
          day.meals = [...mainMeals, ...snacks.slice(0, snacksToAdd)];
        }
      }
    }
  }
};

const applyDietaryRestrictions = (plan: DietPlan, restrictions: string[]): void => {
  // In a real implementation, this would substitute restricted foods
  // This is a simplified version for demonstration purposes
  
  const substitutions: Record<string, Record<string, string>> = {
    vegetarian: {
      "Chicken breast": "Tofu",
      "Beef": "Seitan",
      "Salmon": "Tempeh",
      "Steak": "Portobello mushrooms",
      "Lean beef": "Lentils"
    },
    vegan: {
      "Greek yogurt": "Coconut yogurt",
      "Eggs": "Tofu scramble",
      "Cheese": "Nutritional yeast",
      "Milk": "Almond milk",
      "Whey protein": "Pea protein"
    },
    gluten_free: {
      "Whole grain bread": "Gluten-free bread",
      "Pasta": "Rice pasta",
      "Oats": "Certified gluten-free oats",
      "Wheat tortilla": "Corn tortilla"
    },
    dairy_free: {
      "Greek yogurt": "Coconut yogurt",
      "Cheese": "Dairy-free cheese",
      "Milk": "Almond milk",
      "Whey protein": "Pea protein",
      "Cottage cheese": "Silken tofu"
    }
  };
  
  // Apply substitutions for each restriction
  for (const restriction of restrictions) {
    if (substitutions[restriction]) {
      // For each day in the plan
      for (const day of plan.days) {
        // For each meal
        for (const meal of day.meals) {
          // For each item in the meal
          for (let i = 0; i < meal.items.length; i++) {
            const itemName = meal.items[i].name;
            
            // If the item has a substitution, replace it
            for (const [original, substitute] of Object.entries(substitutions[restriction])) {
              if (itemName.includes(original)) {
                meal.items[i].name = substitute;
              }
            }
          }
        }
        
        // Update shopping list
        const categories = ["proteins", "produce", "grains", "other"];
        for (const category of categories) {
          for (let i = 0; i < day.shoppingList[category as keyof typeof day.shoppingList].length; i++) {
            const itemName = day.shoppingList[category as keyof typeof day.shoppingList][i].name;
            
            // If the item has a substitution, replace it
            for (const [original, substitute] of Object.entries(substitutions[restriction])) {
              if (itemName.includes(original)) {
                day.shoppingList[category as keyof typeof day.shoppingList][i].name = substitute;
              }
            }
          }
        }
      }
    }
  }
  
  // Add appropriate tags to the plan
  for (const day of plan.days) {
    for (const meal of day.meals) {
      for (const restriction of restrictions) {
        const tagName = restriction
          .split("_")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join("-");
        
        if (!meal.tags.includes(tagName)) {
          meal.tags.push(tagName);
        }
      }
    }
  }
};

const generatePersonalizedNotes = (formData: DietFormData): string => {
  // Generate personalized notes based on user data
  
  const baseNotes = "This plan is personalized based on your profile and preferences. ";
  
  let goalNote = "";
  if (formData.goal === "lose") {
    goalNote = "It creates a moderate calorie deficit to support sustainable weight loss while maintaining energy for daily activities. ";
  } else if (formData.goal === "maintain") {
    goalNote = "It provides a balanced calorie intake to maintain your current weight while supporting your activity level. ";
  } else if (formData.goal === "gain") {
    goalNote = "It provides a calorie surplus focused on quality nutrition to support muscle growth while minimizing fat gain. ";
  }
  
  let dietaryNote = "";
  if (formData.dietaryRestrictions.length > 0) {
    const restrictionNames = formData.dietaryRestrictions.map(r => {
      return r.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-");
    });
    
    dietaryNote = `The plan accommodates your ${restrictionNames.join(", ")} dietary preferences while ensuring nutritional adequacy. `;
  }
  
  let activityNote = "";
  if (formData.activityLevel === "very_active" || formData.activityLevel === "active") {
    activityNote = "It includes strategic meal timing around workouts to support performance and recovery. ";
  }
  
  return baseNotes + goalNote + dietaryNote + activityNote;
};
