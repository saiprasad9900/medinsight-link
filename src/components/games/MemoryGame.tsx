
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain } from "lucide-react";

interface MemoryGameProps {
  onComplete: (level: number) => void;
}

const MemoryGame = ({ onComplete }: MemoryGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "showing" | "input" | "success" | "failed" | "complete">("idle");
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [showingIndex, setShowingIndex] = useState(-1);
  const timeoutRef = useRef<number | null>(null);
  
  const startGame = () => {
    setLevel(1);
    setGameState("idle");
    generateSequence(1);
  };
  
  const generateSequence = (currentLevel: number) => {
    // Generate a sequence with length = level
    const newSequence = Array.from({ length: currentLevel + 2 }, () => Math.floor(Math.random() * 4));
    setSequence(newSequence);
    setPlayerSequence([]);
    
    // Start showing the sequence
    setGameState("showing");
    showSequence(newSequence);
  };
  
  const showSequence = (seq: number[]) => {
    let index = 0;
    setShowingIndex(-1);
    
    const showNext = () => {
      if (index < seq.length) {
        setShowingIndex(seq[index]);
        timeoutRef.current = window.setTimeout(() => {
          setShowingIndex(-1);
          timeoutRef.current = window.setTimeout(() => {
            index++;
            showNext();
          }, 300);
        }, 600);
      } else {
        setShowingIndex(-1);
        setGameState("input");
        setMessage("Your turn! Repeat the sequence.");
      }
    };
    
    // Start after a short delay
    timeoutRef.current = window.setTimeout(showNext, 1000);
  };
  
  const handleButtonClick = (buttonIndex: number) => {
    if (gameState !== "input") return;
    
    const newPlayerSequence = [...playerSequence, buttonIndex];
    setPlayerSequence(newPlayerSequence);
    
    // Check if this input is correct so far
    if (buttonIndex !== sequence[playerSequence.length]) {
      // Wrong input
      setGameState("failed");
      setMessage(`Wrong! The correct sequence was ${sequence.join(", ")}`);
      return;
    }
    
    // Check if the full sequence has been entered correctly
    if (newPlayerSequence.length === sequence.length) {
      if (level >= 5) {
        // Game completed after level 5
        setGameState("complete");
        setMessage(`Great job! You completed all ${level} levels!`);
        onComplete(level);
      } else {
        // Level completed, go to next
        setGameState("success");
        setMessage(`Level ${level} completed! Get ready for the next level.`);
        
        timeoutRef.current = window.setTimeout(() => {
          const newLevel = level + 1;
          setLevel(newLevel);
          generateSequence(newLevel);
        }, 2000);
      }
    } else {
      // Continue input
      setPlayerSequence(newPlayerSequence);
    }
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const getButtonColor = (index: number) => {
    if (showingIndex === index) {
      // Highlight when showing sequence
      return index === 0 ? "bg-red-400" : 
             index === 1 ? "bg-blue-400" : 
             index === 2 ? "bg-green-400" : "bg-yellow-400";
    }
    
    return index === 0 ? "bg-red-200 hover:bg-red-300" : 
           index === 1 ? "bg-blue-200 hover:bg-blue-300" : 
           index === 2 ? "bg-green-200 hover:bg-green-300" : "bg-yellow-200 hover:bg-yellow-300";
  };
  
  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Memory Sequence Game</h3>
        <p className="text-muted-foreground">
          Watch the sequence of colors and repeat it back in the correct order.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="px-3 py-1">
          Level: {level}/5
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          Sequence length: {sequence.length}
        </Badge>
      </div>
      
      {message && (gameState === "input" || gameState === "success" || gameState === "failed") && (
        <Alert variant={gameState === "failed" ? "destructive" : gameState === "success" ? "success" : "info"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {[0, 1, 2, 3].map((buttonIndex) => (
          <Button
            key={buttonIndex}
            className={`h-32 transition-colors ${getButtonColor(buttonIndex)}`}
            variant="outline"
            onClick={() => handleButtonClick(buttonIndex)}
            disabled={gameState !== "input"}
          />
        ))}
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Brain className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">How to Play</h3>
          <p className="text-center max-w-md text-muted-foreground">
            Watch the sequence of colored buttons, then repeat it in the same order. 
            The sequence gets longer with each level.
          </p>
          <Button onClick={() => generateSequence(level)} size="lg" className="mt-4">
            Start Game
          </Button>
        </div>
      )}
      
      {gameState === "complete" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <h3 className="text-2xl font-bold">Congratulations!</h3>
          <p className="text-xl">You completed all 5 levels!</p>
          <p className="text-muted-foreground text-center max-w-md">
            This game helps improve your short-term memory and concentration,
            which can benefit your overall cognitive health.
          </p>
          <Button onClick={startGame} size="lg">
            Play Again
          </Button>
        </div>
      )}
      
      {(gameState === "showing" || gameState === "input" || gameState === "success" || gameState === "failed") && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={startGame}
            className="mt-4"
            disabled={gameState === "showing"}
          >
            {gameState === "failed" ? "Try Again" : "Restart Game"}
          </Button>
        </div>
      )}
      
      <Card className="max-w-md mx-auto mt-4">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2">Health Benefits:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Improves short-term and working memory</li>
            <li>Enhances concentration and attention span</li>
            <li>Promotes neuroplasticity and brain health</li>
            <li>Can help maintain cognitive function</li>
            <li>Reduces stress through focused attention</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryGame;
