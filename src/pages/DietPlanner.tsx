
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AppleIcon, Salad, UtensilsCrossed, Weight, Dumbbell } from "lucide-react";
import DietForm from "@/components/diet/DietForm";
import DietPlanDisplay from "@/components/diet/DietPlanDisplay";
import RecentDietPlans from "@/components/diet/RecentDietPlans";
import NutritionTips from "@/components/diet/NutritionTips";
import { DietPlan } from "@/types/diet";
import { toast } from "sonner";

const DietPlanner = () => {
  const [currentPlan, setCurrentPlan] = useState<DietPlan | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleGenerateDietPlan = (plan: DietPlan) => {
    setCurrentPlan(plan);
    setFormSubmitted(true);
    toast.success("Diet and exercise plan generated successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Diet & Exercise Planner</h1>
        <p className="text-muted-foreground">
          Generate personalized diet and exercise plans based on your health profile and goals
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Plan</span>
                  <span className="sm:hidden">Create</span>
                </TabsTrigger>
                <TabsTrigger value="view" className="flex items-center gap-2">
                  <Salad className="h-4 w-4" />
                  <span className="hidden sm:inline">Current Plan</span>
                  <span className="sm:hidden">Current</span>
                </TabsTrigger>
                <TabsTrigger value="exercises" className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4" />
                  <span className="hidden sm:inline">Exercises</span>
                  <span className="sm:hidden">Workouts</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <AppleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Recent Plans</span>
                  <span className="sm:hidden">Recent</span>
                </TabsTrigger>
                <TabsTrigger value="tips" className="flex items-center gap-2">
                  <Weight className="h-4 w-4" />
                  <span className="hidden sm:inline">Nutrition Tips</span>
                  <span className="sm:hidden">Tips</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="scale-in">
                <DietForm onSubmit={handleGenerateDietPlan} />
              </TabsContent>
              
              <TabsContent value="view" className="scale-in">
                {formSubmitted ? (
                  <DietPlanDisplay plan={currentPlan} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Salad className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No active diet plan</h3>
                    <p className="text-muted-foreground mt-2">
                      Create a new diet plan to get started
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="exercises" className="scale-in">
                {formSubmitted && currentPlan?.exerciseRecommendations ? (
                  <div className="py-2">
                    <h3 className="text-xl font-semibold mb-4">Your Exercise Recommendations</h3>
                    <div className="mt-2">
                      {currentPlan.exerciseRecommendations.length > 0 ? (
                        <div className="space-y-6">
                          {currentPlan.exerciseRecommendations.map((exercise, i) => (
                            <Card key={i} className="overflow-hidden">
                              <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <Dumbbell className="h-5 w-5 text-primary" />
                                  <h3 className="font-medium">{exercise.name}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Category:</span> {exercise.category}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Duration:</span> {exercise.duration}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Intensity:</span> {exercise.intensity}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p>No exercise recommendations available. Create a diet plan first.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No exercise recommendations</h3>
                    <p className="text-muted-foreground mt-2">
                      Generate a diet plan to get exercise recommendations based on your goals
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="scale-in">
                <RecentDietPlans onSelectPlan={setCurrentPlan} />
              </TabsContent>
              
              <TabsContent value="tips" className="scale-in">
                <NutritionTips />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DietPlanner;
