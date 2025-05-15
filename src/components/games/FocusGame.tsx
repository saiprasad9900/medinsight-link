
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FocusGameProps {
  onComplete: (score: number) => void;
}

const FocusGame = ({ onComplete }: FocusGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [score, setScore] = useState(0);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [round, setRound] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setRound(0);
    setTimeLeft(60);
    generateNewRound();
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const endGame = () => {
    setGameState("complete");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    onComplete(score);
  };
  
  const generateNewRound = () => {
    // Generate 12 random numbers between 1 and 99
    const newNumbers = Array.from({ length: 12 }, () => Math.floor(Math.random() * 99) + 1);
    
    // Pick one number as the target
    const targetIndex = Math.floor(Math.random() * newNumbers.length);
    const newTarget = newNumbers[targetIndex];
    
    setNumbers(newNumbers);
    setTargetNumber(newTarget);
    setRound(prev => prev + 1);
  };
  
  const handleNumberClick = (clickedNumber: number) => {
    if (gameState !== "playing") return;
    
    // Check if the clicked number is the target
    if (clickedNumber === targetNumber) {
      setScore(prev => prev + 1);
    }
    
    // Generate new round if we haven't reached the limit
    if (round < 10) {
      generateNewRound();
    } else {
      endGame();
    }
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Number Focus Challenge</h3>
        <p className="text-muted-foreground">
          Find the target number among the grid of numbers. Be quick and accurate!
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Badge variant="outline" className="px-3 py-1">
            Score: {score}/10
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Round: {round}/10
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Time left:</div>
          <Progress value={(timeLeft / 60) * 100} className="w-24 h-2" />
          <div className="text-sm font-medium">{timeLeft}s</div>
        </div>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <h3 className="text-xl font-semibold">How to Play</h3>
          <p className="text-center max-w-md text-muted-foreground">
            Find and click on the target number shown at the top of the grid. 
            Complete 10 rounds as quickly as possible within the time limit.
          </p>
          <Button onClick={startGame} size="lg" className="mt-4">
            Start Game
          </Button>
        </div>
      )}
      
      {gameState === "playing" && (
        <Card className="p-4">
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground mb-1">Find this number:</div>
            <div className="text-5xl font-bold">{targetNumber}</div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {numbers.map((number, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="h-16 text-xl font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleNumberClick(number)}
              >
                {number}
              </Button>
            ))}
          </div>
        </Card>
      )}
      
      {gameState === "complete" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <h3 className="text-2xl font-bold">Game Complete!</h3>
          <p className="text-xl">Your score: {score}/10</p>
          <p className="text-muted-foreground text-center max-w-md">
            This game helps improve your visual attention and concentration, 
            which are important cognitive skills for daily tasks.
          </p>
          <Button onClick={startGame} size="lg">
            Play Again
          </Button>
        </div>
      )}
      
      {gameState !== "idle" && (
        <Button 
          variant="outline" 
          onClick={gameState === "playing" ? endGame : startGame}
          className="mt-4"
        >
          {gameState === "playing" ? "End Game" : "New Game"}
        </Button>
      )}
    </div>
  );
};

export default FocusGame;
