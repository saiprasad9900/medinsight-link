
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AppleIcon, Salad, UtensilsCrossed, Weight } from "lucide-react";
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
    toast.success("Diet plan generated successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Diet Planner</h1>
        <p className="text-muted-foreground">
          Generate personalized diet plans based on your health profile and goals
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
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
