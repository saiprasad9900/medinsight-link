
import { ExerciseRecommendation } from "@/types/diet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar, Flame, Clock } from "lucide-react";

interface ExercisePlanDisplayProps {
  exercises: ExerciseRecommendation[];
}

const ExercisePlanDisplay = ({ exercises }: ExercisePlanDisplayProps) => {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-center py-8">
        <Dumbbell className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
        <h3 className="text-lg font-medium">No exercise recommendations available</h3>
        <p className="text-muted-foreground">Try adjusting your profile to get personalized exercise suggestions</p>
      </div>
    );
  }

  // Group exercises by category for better organization
  const exercisesByCategory: Record<string, ExerciseRecommendation[]> = {};
  exercises.forEach(exercise => {
    if (!exercisesByCategory[exercise.category]) {
      exercisesByCategory[exercise.category] = [];
    }
    exercisesByCategory[exercise.category].push(exercise);
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Dumbbell className="h-6 w-6 text-primary" />
        Weekly Exercise Plan
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(exercisesByCategory).map(([category, categoryExercises]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-medium">{category} Exercises</h3>
            
            {categoryExercises.map((exercise, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    {exercise.name}
                    <Badge variant={
                      exercise.intensity === "High" ? "destructive" : 
                      exercise.intensity === "Moderate-High" ? "default" :
                      exercise.intensity === "Moderate" ? "secondary" :
                      "outline"
                    }>
                      {exercise.intensity}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground mb-4">{exercise.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{exercise.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span>~{exercise.caloriesBurned} calories</span>
                    </div>
                    <div className="col-span-2 flex items-start gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex flex-wrap gap-1">
                        {exercise.schedule.map((day, i) => (
                          <Badge variant="outline" key={i} className="text-xs">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 text-sm">
                    <strong className="text-xs uppercase text-muted-foreground">Coach's Tip:</strong>
                    <p className="text-xs mt-1">{exercise.tips}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisePlanDisplay;
