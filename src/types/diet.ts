
export interface DietPlan {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  userStats: {
    gender: string;
    age: number;
    weight: number;
    height: number;
    activityLevel: string;
    goal: string;
  };
  days: DayPlan[];
  notes: string;
}

export interface DayPlan {
  day: number;
  meals: MealPlan[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  shoppingList: {
    proteins: ShoppingItem[];
    produce: ShoppingItem[];
    grains: ShoppingItem[];
    other: ShoppingItem[];
  };
  tips: {
    title: string;
    content: string;
  }[];
}

export interface MealPlan {
  name: string;
  time: string;
  tags: string[];
  items: {
    name: string;
    portion: string;
  }[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  recipe?: string;
}

export interface ShoppingItem {
  name: string;
  amount: string;
}

export interface DietFormData {
  gender: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
  dietaryRestrictions: string[];
  mealPreference: string;
  intensityLevel: number;
}
