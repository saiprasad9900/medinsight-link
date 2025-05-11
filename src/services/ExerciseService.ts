
import { DietFormData, ExerciseRecommendation } from "@/types/diet";

/**
 * Generates personalized exercise recommendations based on user profile and goals
 */
export const generateExercises = async (formData: DietFormData): Promise<ExerciseRecommendation[]> => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Base exercises for different goals
  const exercisesByGoal: Record<string, ExerciseRecommendation[]> = {
    lose: [
      {
        name: "HIIT Cardio",
        description: "High intensity interval training to maximize calorie burn and improve cardiovascular health.",
        category: "Cardio",
        duration: "20-30 minutes",
        intensity: "High",
        caloriesBurned: 300,
        schedule: ["Monday", "Wednesday", "Friday"],
        tips: "Focus on giving 100% during work intervals and completely recovering during rest periods."
      },
      {
        name: "Strength Circuit",
        description: "Full body resistance training using weights or bodyweight to maintain muscle while losing fat.",
        category: "Strength",
        duration: "40-45 minutes",
        intensity: "Moderate",
        caloriesBurned: 250,
        schedule: ["Tuesday", "Thursday", "Saturday"],
        tips: "Use compound movements like squats, push-ups and rows to engage multiple muscle groups."
      },
      {
        name: "Steady State Cardio",
        description: "Low intensity sustained cardio to burn additional calories and improve recovery.",
        category: "Cardio",
        duration: "45-60 minutes",
        intensity: "Low",
        caloriesBurned: 350,
        schedule: ["Sunday"],
        tips: "Keep your heart rate in the fat-burning zone (about 65-70% of max heart rate)."
      }
    ],
    maintain: [
      {
        name: "Mixed Cardio",
        description: "Combination of moderate intensity steady state and interval training for overall fitness.",
        category: "Cardio",
        duration: "30 minutes",
        intensity: "Moderate",
        caloriesBurned: 250,
        schedule: ["Monday", "Thursday"],
        tips: "Vary your cardio activities to keep things interesting and challenge different muscle groups."
      },
      {
        name: "Full Body Resistance",
        description: "Full body strength training to maintain muscle mass and overall body composition.",
        category: "Strength",
        duration: "45 minutes",
        intensity: "Moderate",
        caloriesBurned: 200,
        schedule: ["Tuesday", "Friday"],
        tips: "Focus on form and controlled movements rather than lifting heavy weights."
      },
      {
        name: "Active Recovery",
        description: "Light activity like yoga, swimming or walking to promote recovery and flexibility.",
        category: "Flexibility",
        duration: "30-45 minutes",
        intensity: "Low",
        caloriesBurned: 150,
        schedule: ["Wednesday", "Saturday"],
        tips: "Use this time to focus on mobility and areas that feel tight or restricted."
      },
      {
        name: "Rest Day",
        description: "Complete rest or very light activity to allow your body to recover fully.",
        category: "Recovery",
        duration: "0 minutes",
        intensity: "Very Low",
        caloriesBurned: 0,
        schedule: ["Sunday"],
        tips: "Rest is essential for progress - use this day to recharge mentally and physically."
      }
    ],
    gain: [
      {
        name: "Heavy Compound Lifting",
        description: "Focus on major compound lifts like squats, deadlifts and bench press to stimulate maximum muscle growth.",
        category: "Strength",
        duration: "60 minutes",
        intensity: "High",
        caloriesBurned: 300,
        schedule: ["Monday", "Thursday"],
        tips: "Work in the 6-10 rep range with heavy weights and proper form."
      },
      {
        name: "Hypertrophy Training",
        description: "Moderate weight, higher rep training focused on specific muscle groups for growth.",
        category: "Hypertrophy",
        duration: "50-60 minutes",
        intensity: "Moderate-High",
        caloriesBurned: 250,
        schedule: ["Tuesday", "Friday"],
        tips: "Focus on mind-muscle connection and proper time under tension for each set."
      },
      {
        name: "Light Cardio",
        description: "Brief cardio sessions to maintain cardiovascular health without burning excess calories.",
        category: "Cardio",
        duration: "20-30 minutes",
        intensity: "Low-Moderate",
        caloriesBurned: 150,
        schedule: ["Wednesday", "Saturday"],
        tips: "Keep your heart rate moderate to avoid interfering with recovery and muscle growth."
      },
      {
        name: "Complete Rest",
        description: "Full rest day to maximize recovery and muscle protein synthesis.",
        category: "Recovery",
        duration: "0 minutes",
        intensity: "None",
        caloriesBurned: 0,
        schedule: ["Sunday"],
        tips: "Ensure you're getting 7-9 hours of quality sleep to optimize recovery and growth."
      }
    ]
  };

  // Select base exercises based on goal
  const baseExercises = exercisesByGoal[formData.goal] || exercisesByGoal.maintain;
  
  // Adjust exercises based on user profile
  const personalizedExercises = baseExercises.map(exercise => {
    const adjusted = { ...exercise };
    
    // Adjust based on gender (subtle differences)
    if (formData.gender === "female") {
      if (exercise.category === "Strength") {
        adjusted.tips = exercise.tips + " Consider focusing on glutes, hamstrings and core strength which can help with overall body composition.";
      }
    }
    
    // Adjust based on age
    if (formData.age > 50) {
      adjusted.intensity = exercise.intensity === "High" ? "Moderate-High" : exercise.intensity;
      adjusted.tips = exercise.tips + " Take extra time to warm up properly and consider adding joint mobility work.";
    }
    
    // Adjust based on intensity preference
    if (formData.intensityLevel <= 2) {
      // Lower intensity
      adjusted.intensity = exercise.intensity === "High" ? "Moderate" : exercise.intensity;
      adjusted.duration = exercise.category === "Cardio" ? "20-30 minutes" : exercise.duration;
    } else if (formData.intensityLevel >= 4) {
      // Higher intensity
      if (exercise.intensity !== "None") {
        adjusted.intensity = exercise.intensity === "Low" ? "Moderate" : "High";
        adjusted.duration = exercise.category === "Cardio" ? "30-45 minutes" : exercise.duration;
      }
    }
    
    return adjusted;
  });
  
  return personalizedExercises;
};
