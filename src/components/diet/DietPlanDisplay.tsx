
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DietPlan, MealPlan } from "@/types/diet";
import { Download, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";

interface DietPlanDisplayProps {
  plan: DietPlan | null;
}

const DaySelector = ({ currentDay, totalDays, onDayChange }: { currentDay: number; totalDays: number; onDayChange: (day: number) => void }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 flex-nowrap">
      {Array.from({ length: totalDays }, (_, i) => (
        <Button
          key={i}
          variant={currentDay === i + 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onDayChange(i + 1)}
          className="flex-shrink-0"
        >
          Day {i + 1}
        </Button>
      ))}
    </div>
  );
};

const MealCard = ({ meal }: { meal: MealPlan }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{meal.name}</CardTitle>
        <div className="flex gap-2">
          {meal.tags.map((tag, i) => (
            <Badge key={i} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-sm space-y-2">
          {meal.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.name}</span>
              <span className="text-muted-foreground">{item.portion}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-3 text-xs text-center">
          <div>
            <div className="font-medium text-base">{meal.nutrition.calories}</div>
            <div className="text-muted-foreground">Calories</div>
          </div>
          <div>
            <div className="font-medium text-base">{meal.nutrition.protein}g</div>
            <div className="text-muted-foreground">Protein</div>
          </div>
          <div>
            <div className="font-medium text-base">{meal.nutrition.carbs}g</div>
            <div className="text-muted-foreground">Carbs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DietPlanDisplay = ({ plan }: DietPlanDisplayProps) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [activeView, setActiveView] = useState("meals");

  if (!plan) {
    return null;
  }

  const handleDownload = () => {
    // Implementation would go here
    toast.success("Diet plan downloaded");
  };

  const handlePrint = () => {
    window.print();
    toast.success("Printing diet plan");
  };

  const handleShare = () => {
    // Implementation would go here
    toast.success("Diet plan shared");
  };

  const dayPlan = plan.days.find(day => day.day === currentDay) || plan.days[0];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{plan.name}</h2>
          <p className="text-muted-foreground">{plan.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleDownload} title="Download Plan">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrint} title="Print Plan">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare} title="Share Plan">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daily Nutrition Summary</CardTitle>
          <CardDescription>
            Target for {plan.userStats.gender}, {plan.userStats.age} years, {plan.userStats.weight}kg
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-2 bg-green-50 border border-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{dayPlan.totalNutrition.calories}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{dayPlan.totalNutrition.protein}g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{dayPlan.totalNutrition.carbs}g</div>
              <div className="text-xs text-muted-foreground">Carbs</div>
            </div>
            <div className="p-2 bg-purple-50 border border-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{dayPlan.totalNutrition.fat}g</div>
              <div className="text-xs text-muted-foreground">Fat</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <h4 className="text-sm font-medium mb-2">Plan Notes</h4>
          <p className="text-sm text-muted-foreground">{plan.notes}</p>
        </CardFooter>
      </Card>

      <div>
        <h3 className="text-lg font-medium mb-3">7-Day Meal Plan</h3>
        <DaySelector 
          currentDay={currentDay} 
          totalDays={plan.days.length} 
          onDayChange={setCurrentDay} 
        />
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="meals">Meals</TabsTrigger>
          <TabsTrigger value="shopping">Shopping List</TabsTrigger>
          <TabsTrigger value="tips">Day Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="meals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {dayPlan.meals.map((meal, i) => (
              <MealCard key={i} meal={meal} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="shopping">
          <Card>
            <CardHeader>
              <CardTitle>Shopping List - Day {currentDay}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Proteins</h4>
                  <ul className="space-y-1 text-sm">
                    {dayPlan.shoppingList.proteins.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Fruits & Vegetables</h4>
                  <ul className="space-y-1 text-sm">
                    {dayPlan.shoppingList.produce.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Grains & Starches</h4>
                  <ul className="space-y-1 text-sm">
                    {dayPlan.shoppingList.grains.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Other Items</h4>
                  <ul className="space-y-1 text-sm">
                    {dayPlan.shoppingList.other.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>Tips for Day {currentDay}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dayPlan.tips.map((tip, i) => (
                  <div key={i} className="pb-3 border-b last:border-0 last:pb-0">
                    <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DietPlanDisplay;
