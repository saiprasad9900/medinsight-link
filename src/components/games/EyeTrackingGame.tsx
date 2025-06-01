
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EyeTrackingGameProps {
  onComplete: (score: number) => void;
}

const EyeTrackingGame = ({ onComplete }: EyeTrackingGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [score, setScore] = useState(0);
  const [currentTarget, setCurrentTarget] = useState({ x: 50, y: 50 });
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setRound(0);
    setTimeLeft(60);
    generateNewTarget();
  };

  const generateNewTarget = () => {
    setCurrentTarget({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    });
    setRound(prev => prev + 1);
  };

  const handleTargetClick = () => {
    if (gameState !== "playing") return;
    setScore(prev => prev + 1);
    generateNewTarget();
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState("complete");
          onComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const targetTimer = setInterval(() => {
      generateNewTarget();
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(targetTimer);
    };
  }, [gameState, score]);

  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Eye Tracking Exercise</h3>
        <p className="text-muted-foreground">
          Follow and click on the moving targets to improve eye movement and visual tracking.
        </p>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={startGame} size="lg">Start Eye Tracking</Button>
        </div>
      )}

      {gameState !== "idle" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant="outline">Round: {round}</Badge>
            <Badge variant="outline">Time: {timeLeft}s</Badge>
          </div>

          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300">
            <div
              className="absolute w-8 h-8 bg-red-500 rounded-full cursor-pointer animate-pulse hover:scale-110 transition-transform"
              style={{
                left: `${currentTarget.x}%`,
                top: `${currentTarget.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={handleTargetClick}
            />
          </div>
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Exercise Complete!</h3>
          <p className="text-lg">Targets Hit: {score}</p>
          <Button onClick={startGame}>Try Again</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Health Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Improves eye movement coordination</li>
            <li>Enhances visual tracking abilities</li>
            <li>Helps with focus and concentration</li>
            <li>Beneficial for vision therapy</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EyeTrackingGame;
