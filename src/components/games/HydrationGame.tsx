
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface HydrationGameProps {
  onComplete: (score: number) => void;
}

const HydrationGame = ({ onComplete }: HydrationGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal] = useState(8); // 8 glasses
  const [timeLeft, setTimeLeft] = useState(480); // 8 hours in minutes
  const [reminders, setReminders] = useState(0);
  const [lastDrink, setLastDrink] = useState(0);

  const startGame = () => {
    setGameState("playing");
    setWaterIntake(0);
    setTimeLeft(480);
    setReminders(0);
    setLastDrink(0);
  };

  const drinkWater = () => {
    setWaterIntake(prev => prev + 1);
    setLastDrink(0);
    
    if (waterIntake + 1 >= dailyGoal) {
      setGameState("complete");
      onComplete(dailyGoal);
    }
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState("complete");
          onComplete(waterIntake);
          return 0;
        }
        return prev - 1;
      });
      
      setLastDrink(prev => prev + 1);
      
      // Send reminder every 60 minutes
      if (timeLeft % 60 === 0 && timeLeft < 480) {
        setReminders(prev => prev + 1);
      }
    }, 1000); // Using seconds for demo, would be minutes in real app

    return () => clearInterval(timer);
  }, [gameState, timeLeft, waterIntake]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getHydrationLevel = () => {
    const percentage = (waterIntake / dailyGoal) * 100;
    if (percentage < 25) return { level: "Low", color: "text-red-500" };
    if (percentage < 50) return { level: "Fair", color: "text-orange-500" };
    if (percentage < 75) return { level: "Good", color: "text-yellow-500" };
    return { level: "Excellent", color: "text-green-500" };
  };

  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Hydration Tracker</h3>
        <p className="text-muted-foreground">
          Stay hydrated throughout your day. Aim for 8 glasses of water!
        </p>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={startGame} size="lg">Start Hydration Challenge</Button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline">Water: {waterIntake}/{dailyGoal}</Badge>
            <Badge variant="outline">Time: {formatTime(timeLeft)}</Badge>
            <Badge variant="outline" className={getHydrationLevel().color}>
              {getHydrationLevel().level}
            </Badge>
          </div>

          <Card className="p-6 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-2">💧</div>
              <h3 className="text-2xl font-bold mb-2">Water Intake</h3>
              <Progress value={(waterIntake / dailyGoal) * 100} className="w-full mb-2" />
              <p className="text-sm text-muted-foreground">{waterIntake} of {dailyGoal} glasses</p>
            </div>
            
            <Button onClick={drinkWater} size="lg" className="w-full">
              Drink Water 🥤
            </Button>
            
            {lastDrink > 60 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 Reminder: You haven't had water in {Math.floor(lastDrink / 60)} minutes!
                </p>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold">{reminders}</div>
                <div className="text-sm text-muted-foreground">Reminders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold">{Math.round((waterIntake / dailyGoal) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Goal Progress</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Day Complete!</h3>
          <p className="text-lg">Water Consumed: {waterIntake}/{dailyGoal} glasses</p>
          <p className="text-sm text-muted-foreground">
            {waterIntake >= dailyGoal ? "Excellent hydration!" : "Try to drink more water tomorrow!"}
          </p>
          <Button onClick={startGame}>New Day</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Health Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Maintains proper body fluid balance</li>
            <li>Improves cognitive function and concentration</li>
            <li>Supports kidney function and detoxification</li>
            <li>Helps maintain healthy skin and energy levels</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HydrationGame;
