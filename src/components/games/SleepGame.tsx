
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SleepGameProps {
  onComplete: (score: number) => void;
}

const SleepGame = ({ onComplete }: SleepGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "tracking" | "bedtime" | "complete">("idle");
  const [sleepScore, setSleepScore] = useState(0);
  const [bedtimeGoal, setBedtimeGoal] = useState("22:00");
  const [wakeTimeGoal, setWakeTimeGoal] = useState("07:00");
  const [currentSleepTime, setCurrentSleepTime] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [daysTracked, setDaysTracked] = useState(0);

  const startTracking = () => {
    setGameState("tracking");
    setSleepScore(0);
    setCurrentSleepTime(0);
    setDaysTracked(0);
  };

  const logSleep = (hours: number, quality: number) => {
    setCurrentSleepTime(hours);
    setSleepQuality(quality);
    
    // Calculate sleep score based on hours and quality
    let score = 0;
    if (hours >= 7 && hours <= 9) score += 30;
    else if (hours >= 6 && hours <= 10) score += 20;
    else score += 10;
    
    score += quality * 7; // Quality contributes up to 70 points
    
    setSleepScore(prev => Math.round((prev * daysTracked + score) / (daysTracked + 1)));
    setDaysTracked(prev => prev + 1);
    
    if (daysTracked >= 6) {
      setGameState("complete");
      onComplete(sleepScore);
    }
  };

  const getSleepRating = (hours: number) => {
    if (hours >= 7 && hours <= 9) return { rating: "Optimal", color: "text-green-500" };
    if (hours >= 6 && hours <= 10) return { rating: "Good", color: "text-yellow-500" };
    return { rating: "Poor", color: "text-red-500" };
  };

  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Sleep Quality Tracker</h3>
        <p className="text-muted-foreground">
          Track your sleep patterns and improve your sleep hygiene for better health.
        </p>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={startTracking} size="lg">Start Sleep Tracking</Button>
        </div>
      )}

      {gameState === "tracking" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline">Day: {daysTracked + 1}/7</Badge>
            <Badge variant="outline">Sleep Score: {sleepScore}</Badge>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Log Today's Sleep</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Hours of Sleep</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((hours) => (
                    <Button
                      key={hours}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentSleepTime(hours)}
                      className={currentSleepTime === hours ? "bg-primary text-primary-foreground" : ""}
                    >
                      {hours}h
                    </Button>
                  ))}
                </div>
                {currentSleepTime > 0 && (
                  <p className={`text-sm mt-2 ${getSleepRating(currentSleepTime).color}`}>
                    {getSleepRating(currentSleepTime).rating} sleep duration
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Sleep Quality (1-10)</label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((quality) => (
                    <Button
                      key={quality}
                      variant="outline"
                      size="sm"
                      onClick={() => setSleepQuality(quality)}
                      className={sleepQuality === quality ? "bg-primary text-primary-foreground" : ""}
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => logSleep(currentSleepTime, sleepQuality)}
                disabled={currentSleepTime === 0}
                className="w-full"
              >
                Log Sleep
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Sleep Goals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Bedtime Goal</label>
                <input 
                  type="time" 
                  value={bedtimeGoal}
                  onChange={(e) => setBedtimeGoal(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Wake Time Goal</label>
                <input 
                  type="time" 
                  value={wakeTimeGoal}
                  onChange={(e) => setWakeTimeGoal(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
            </div>
          </Card>

          {daysTracked > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Progress</h3>
              <Progress value={(daysTracked / 7) * 100} className="w-full mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                {daysTracked}/7 days tracked
              </p>
            </Card>
          )}
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Week Complete!</h3>
          <p className="text-lg">Average Sleep Score: {sleepScore}/100</p>
          <p className="text-sm text-muted-foreground">
            {sleepScore >= 80 ? "Excellent sleep habits!" : sleepScore >= 60 ? "Good progress, keep improving!" : "Focus on better sleep hygiene"}
          </p>
          <Button onClick={startTracking}>New Week</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Health Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Improves immune system function</li>
            <li>Enhances memory and cognitive performance</li>
            <li>Supports emotional regulation and mental health</li>
            <li>Promotes physical recovery and growth</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepGame;
