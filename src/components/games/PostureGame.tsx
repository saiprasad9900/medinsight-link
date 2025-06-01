
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PostureGameProps {
  onComplete: (score: number) => void;
}

const PostureGame = ({ onComplete }: PostureGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "monitoring" | "break" | "complete">("idle");
  const [postureScore, setPostureScore] = useState(100);
  const [sessionTime, setSessionTime] = useState(1800); // 30 minutes
  const [goodPostureTime, setGoodPostureTime] = useState(0);
  const [remindersSent, setRemindersSent] = useState(0);
  const [isGoodPosture, setIsGoodPosture] = useState(true);

  const startMonitoring = () => {
    setGameState("monitoring");
    setPostureScore(100);
    setSessionTime(1800);
    setGoodPostureTime(0);
    setRemindersSent(0);
    setIsGoodPosture(true);
  };

  const reportPosture = (good: boolean) => {
    setIsGoodPosture(good);
    if (!good && isGoodPosture) {
      setRemindersSent(prev => prev + 1);
      setPostureScore(prev => Math.max(0, prev - 5));
    }
  };

  const takeBreak = () => {
    setGameState("break");
    setTimeout(() => {
      setGameState("monitoring");
      setPostureScore(prev => Math.min(100, prev + 10));
    }, 30000); // 30 second break
  };

  useEffect(() => {
    if (gameState !== "monitoring") return;

    const timer = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1) {
          setGameState("complete");
          onComplete(Math.round((goodPostureTime / 1800) * 100));
          return 0;
        }
        return prev - 1;
      });

      if (isGoodPosture) {
        setGoodPostureTime(prev => prev + 1);
      } else {
        setPostureScore(prev => Math.max(0, prev - 0.1));
      }

      // Simulate posture changes
      if (Math.random() < 0.1) {
        const newPosture = Math.random() > 0.3;
        reportPosture(newPosture);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isGoodPosture]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Posture Monitor</h3>
        <p className="text-muted-foreground">
          Maintain good posture throughout your work session. Get reminders and track your progress.
        </p>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={startMonitoring} size="lg">Start Posture Monitoring</Button>
        </div>
      )}

      {gameState === "monitoring" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline">Time: {formatTime(sessionTime)}</Badge>
            <Badge variant="outline">Score: {Math.round(postureScore)}/100</Badge>
            <Badge variant={isGoodPosture ? "default" : "destructive"}>
              {isGoodPosture ? "Good Posture" : "Poor Posture"}
            </Badge>
          </div>

          <Card className="p-6 text-center">
            <div className="text-6xl mb-4">
              {isGoodPosture ? "🪑" : "⚠️"}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {isGoodPosture ? "Excellent Posture!" : "Check Your Posture"}
            </h3>
            <Progress value={postureScore} className="w-full mb-4" />
            
            <div className="flex justify-center space-x-4 mt-4">
              <Button 
                variant={isGoodPosture ? "default" : "outline"}
                onClick={() => reportPosture(true)}
              >
                Good Posture ✅
              </Button>
              <Button 
                variant={!isGoodPosture ? "destructive" : "outline"}
                onClick={() => reportPosture(false)}
              >
                Poor Posture ❌
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-xl font-bold">{remindersSent}</div>
                <div className="text-xs text-muted-foreground">Reminders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-xl font-bold">{Math.round((goodPostureTime / (1800 - sessionTime)) * 100) || 0}%</div>
                <div className="text-xs text-muted-foreground">Good Posture</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Button variant="outline" size="sm" onClick={takeBreak}>
                  Take Break
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {gameState === "break" && (
        <Card className="p-8 text-center bg-blue-50">
          <h3 className="text-xl font-bold mb-4">Break Time! 🧘‍♀️</h3>
          <p className="text-lg mb-4">Stand up, stretch, and reset your posture</p>
          <div className="text-sm text-muted-foreground">Returning to monitoring in 30 seconds...</div>
        </Card>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Session Complete!</h3>
          <p className="text-lg">Good Posture: {Math.round((goodPostureTime / 1800) * 100)}% of time</p>
          <p className="text-sm text-muted-foreground">
            {goodPostureTime > 1350 ? "Excellent posture maintenance!" : "Try to maintain better posture next time!"}
          </p>
          <Button onClick={startMonitoring}>New Session</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Health Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Prevents back and neck pain</li>
            <li>Improves breathing and circulation</li>
            <li>Reduces muscle strain and fatigue</li>
            <li>Enhances confidence and energy levels</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostureGame;
