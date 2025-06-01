
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface HandExerciseGameProps {
  onComplete: (score: number) => void;
}

const HandExerciseGame = ({ onComplete }: HandExerciseGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [score, setScore] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [reps, setReps] = useState(0);
  const [targetReps, setTargetReps] = useState(10);
  const [isPressed, setIsPressed] = useState(false);

  const exercises = [
    { name: "Finger Taps", instruction: "Tap spacebar rapidly", key: "Space" },
    { name: "Grip Strength", instruction: "Hold click for 2 seconds", key: "Click" },
    { name: "Finger Flex", instruction: "Press and release F key", key: "F" },
    { name: "Thumb Exercise", instruction: "Press T key repeatedly", key: "T" }
  ];

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentExercise(0);
    setReps(0);
    setTargetReps(10);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (gameState !== "playing") return;
    
    const exercise = exercises[currentExercise];
    if ((exercise.key === "Space" && e.code === "Space") ||
        (exercise.key === "F" && e.code === "KeyF") ||
        (exercise.key === "T" && e.code === "KeyT")) {
      setReps(prev => prev + 1);
    }
  };

  const handleMouseDown = () => {
    if (gameState !== "playing") return;
    const exercise = exercises[currentExercise];
    if (exercise.key === "Click") {
      setIsPressed(true);
      setTimeout(() => {
        if (isPressed) {
          setReps(prev => prev + 1);
        }
        setIsPressed(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (reps >= targetReps) {
      setScore(prev => prev + 1);
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(prev => prev + 1);
        setReps(0);
      } else {
        setGameState("complete");
        onComplete(score + 1);
      }
    }
  }, [reps, targetReps, currentExercise, score]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentExercise]);

  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Hand & Finger Exercises</h3>
        <p className="text-muted-foreground">
          Complete various hand exercises to improve dexterity and strength.
        </p>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={startGame} size="lg">Start Hand Exercises</Button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline">Exercise: {currentExercise + 1}/4</Badge>
            <Badge variant="outline">Completed: {score}</Badge>
          </div>

          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">{exercises[currentExercise].name}</h3>
            <p className="text-lg mb-4">{exercises[currentExercise].instruction}</p>
            <Progress value={(reps / targetReps) * 100} className="w-full mb-2" />
            <p className="text-sm text-muted-foreground">{reps}/{targetReps} reps</p>
          </Card>

          {exercises[currentExercise].key === "Click" && (
            <div 
              className="w-full h-32 bg-primary/10 rounded-lg border-2 border-dashed border-primary cursor-pointer flex items-center justify-center"
              onMouseDown={handleMouseDown}
            >
              <p className="text-lg font-medium">Hold Click Here</p>
            </div>
          )}
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Exercises Complete!</h3>
          <p className="text-lg">Exercises Completed: {score}</p>
          <Button onClick={startGame}>Restart Exercises</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Health Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Improves hand and finger dexterity</li>
            <li>Increases grip strength</li>
            <li>Helps prevent repetitive strain injuries</li>
            <li>Beneficial for arthritis management</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HandExerciseGame;
