
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface BalanceGameProps {
  onComplete: (score: number) => void;
}

const BalanceGame = ({ onComplete }: BalanceGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [position, setPosition] = useState(50);
  const [target, setTarget] = useState(50);
  const [stabilityPoints, setStabilityPoints] = useState(0);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(30);
    setPosition(50);
    setTarget(50);
    setStabilityPoints(0);
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

    const gameLoop = setInterval(() => {
      // Calculate distance from target
      const distance = Math.abs(position - target);
      if (distance <= 5) {
        setStabilityPoints(prev => prev + 1);
        if (stabilityPoints > 10) {
          setScore(prev => prev + 1);
          setStabilityPoints(0);
          // Move target to new position
          setTarget(Math.random() * 80 + 10);
        }
      } else {
        setStabilityPoints(0);
      }
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(gameLoop);
    };
  }, [gameState, position, target, stabilityPoints, score]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameState !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, newPosition)));
  };

  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Balance & Stability Test</h3>
        <p className="text-muted-foreground">
          Keep the blue circle in the target zone to improve your balance and coordination.
        </p>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={startGame} size="lg">Start Balance Game</Button>
        </div>
      )}

      {gameState !== "idle" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant="outline">Time: {timeLeft}s</Badge>
            <Badge variant="outline">Stability: {stabilityPoints}/10</Badge>
          </div>

          <div 
            className="relative h-20 bg-gray-200 rounded-lg cursor-crosshair"
            onMouseMove={handleMouseMove}
          >
            {/* Target zone */}
            <div 
              className="absolute top-0 h-full w-10 bg-green-200 rounded transition-all duration-300"
              style={{ left: `${target - 5}%` }}
            />
            {/* Player position */}
            <div 
              className="absolute top-1/2 w-6 h-6 bg-blue-500 rounded-full transform -translate-y-1/2 transition-all duration-100"
              style={{ left: `${position - 3}%` }}
            />
          </div>

          <Progress value={(timeLeft / 30) * 100} className="w-full" />
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Game Complete!</h3>
          <p className="text-lg">Final Score: {score}</p>
          <Button onClick={startGame}>Play Again</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Health Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Improves hand-eye coordination</li>
            <li>Enhances motor control and precision</li>
            <li>Helps with balance and stability</li>
            <li>Useful for rehabilitation exercises</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceGame;
