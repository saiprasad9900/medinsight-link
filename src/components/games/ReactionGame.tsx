
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReactionGameProps {
  onComplete: (time: number) => void;
}

const ReactionGame = ({ onComplete }: ReactionGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "clicked" | "failed">("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [countdownTime, setCountdownTime] = useState(3);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  const startGame = () => {
    setGameState("waiting");
    setReactionTime(null);
    setCountdownTime(3);
    
    // Countdown
    const countdownInterval = setInterval(() => {
      setCountdownTime(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          waitForReady();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const waitForReady = () => {
    // Random wait between 1-5 seconds before showing the target
    const randomDelay = Math.floor(Math.random() * 4000) + 1000;
    
    timeoutRef.current = window.setTimeout(() => {
      setGameState("ready");
      startTimeRef.current = Date.now();
    }, randomDelay);
  };
  
  const handleClick = () => {
    if (gameState === "waiting") {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState("failed");
    } else if (gameState === "ready") {
      // Good click
      const endTime = Date.now();
      const time = startTimeRef.current ? endTime - startTimeRef.current : 0;
      setReactionTime(time);
      setAttempts(prev => prev + 1);
      
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }
      
      setGameState("clicked");
      
      if (attempts >= 4) {
        // Game complete after 5 attempts
        onComplete(bestTime || time);
      }
    } else if (gameState === "clicked" || gameState === "failed") {
      // Start next round
      startGame();
    }
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const getBackgroundColor = () => {
    if (gameState === "waiting") return "bg-yellow-100 dark:bg-yellow-900/30";
    if (gameState === "ready") return "bg-green-100 dark:bg-green-900/30";
    if (gameState === "clicked") return "bg-blue-100 dark:bg-blue-900/30";
    if (gameState === "failed") return "bg-red-100 dark:bg-red-900/30";
    return "bg-slate-100 dark:bg-slate-900/30";
  };
  
  const getInstructions = () => {
    if (gameState === "idle") return "Test your reaction time. Click to start!";
    if (gameState === "waiting") return countdownTime > 0 ? `Get ready in ${countdownTime}...` : "Wait for the green screen...";
    if (gameState === "ready") return "CLICK NOW!";
    if (gameState === "clicked") return `Your time: ${reactionTime}ms`;
    if (gameState === "failed") return "Too early! Try again.";
    return "";
  };
  
  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Reaction Time Test</h3>
        <p className="text-muted-foreground">
          Test your reaction speed. Wait for the green screen, then click as quickly as possible.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="px-3 py-1">
          Attempt: {attempts}/5
        </Badge>
        {bestTime && (
          <Badge variant="outline" className="px-3 py-1">
            Best time: {bestTime}ms
          </Badge>
        )}
      </div>
      
      <Card 
        className={`w-full aspect-video cursor-pointer transition-colors ${getBackgroundColor()}`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              {gameState === "clicked" 
                ? `${reactionTime}ms` 
                : gameState === "waiting" && countdownTime > 0
                  ? countdownTime
                  : gameState === "ready" 
                    ? "NOW!" 
                    : gameState === "failed"
                      ? "Too early!"
                      : "Click to start"}
            </h2>
            <p className="text-lg">{getInstructions()}</p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Wait for the yellow screen to turn green</li>
              <li>Click as fast as you can when it turns green</li>
              <li>Try to beat your best time</li>
              <li>Complete 5 attempts to finish the game</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Health benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Improves cognitive reaction time</li>
              <li>Helps with coordination and reflexes</li>
              <li>Trains focus and attention</li>
              <li>Can help detect cognitive changes over time</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReactionGame;
