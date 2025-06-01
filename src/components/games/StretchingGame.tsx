
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StretchingGameProps {
  onComplete: (score: number) => void;
}

const StretchingGame = ({ onComplete }: StretchingGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "rest" | "complete">("idle");
  const [currentStretch, setCurrentStretch] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [completedStretches, setCompletedStretches] = useState(0);
  const [isResting, setIsResting] = useState(false);

  const stretches = [
    { name: "Neck Rolls", instruction: "Slowly roll your head in a circle", duration: 30 },
    { name: "Shoulder Shrugs", instruction: "Lift shoulders up, hold, then release", duration: 20 },
    { name: "Arm Circles", instruction: "Extend arms and make small circles", duration: 25 },
    { name: "Torso Twist", instruction: "Sit and gently twist your torso left and right", duration: 30 },
    { name: "Ankle Rolls", instruction: "Lift feet and rotate ankles in circles", duration: 20 },
    { name: "Deep Breathing", instruction: "Take slow, deep breaths", duration: 45 }
  ];

  const startGame = () => {
    setGameState("playing");
    setCurrentStretch(0);
    setTimeLeft(stretches[0].duration);
    setCompletedStretches(0);
    setIsResting(false);
  };

  const nextStretch = () => {
    if (currentStretch < stretches.length - 1) {
      setIsResting(true);
      setGameState("rest");
      setTimeLeft(10);
    } else {
      setGameState("complete");
      onComplete(completedStretches + 1);
    }
  };

  const finishRest = () => {
    setCurrentStretch(prev => prev + 1);
    setCompletedStretches(prev => prev + 1);
    setGameState("playing");
    setTimeLeft(stretches[currentStretch + 1].duration);
    setIsResting(false);
  };

  useEffect(() => {
    if (gameState !== "playing" && gameState !== "rest") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gameState === "rest") {
            finishRest();
          } else {
            nextStretch();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentStretch]);

  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Guided Stretching Session</h3>
        <p className="text-muted-foreground">
          Follow along with these desk-friendly stretches to reduce tension and improve flexibility.
        </p>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={startGame} size="lg">Start Stretching Session</Button>
        </div>
      )}

      {(gameState === "playing" || gameState === "rest") && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline">Stretch: {currentStretch + 1}/6</Badge>
            <Badge variant="outline">Completed: {completedStretches}</Badge>
          </div>

          <Card className="p-8 text-center">
            {gameState === "rest" ? (
              <div>
                <h3 className="text-2xl font-bold mb-4 text-blue-600">Rest Period</h3>
                <p className="text-lg mb-4">Take a moment to relax</p>
                <Progress value={((10 - timeLeft) / 10) * 100} className="w-full mb-2" />
                <p className="text-sm text-muted-foreground">{timeLeft} seconds remaining</p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold mb-4">{stretches[currentStretch].name}</h3>
                <p className="text-lg mb-6">{stretches[currentStretch].instruction}</p>
                <Progress value={((stretches[currentStretch].duration - timeLeft) / stretches[currentStretch].duration) * 100} className="w-full mb-2" />
                <p className="text-sm text-muted-foreground">{timeLeft} seconds remaining</p>
              </div>
            )}
          </Card>

          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={gameState === "rest" ? finishRest : nextStretch}
            >
              {gameState === "rest" ? "Skip Rest" : "Next Stretch"}
            </Button>
          </div>
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Session Complete!</h3>
          <p className="text-lg">Stretches Completed: {completedStretches}</p>
          <p className="text-sm text-muted-foreground">Great job! Your body will thank you.</p>
          <Button onClick={startGame}>New Session</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Health Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Reduces muscle tension and stiffness</li>
            <li>Improves flexibility and range of motion</li>
            <li>Prevents repetitive strain injuries</li>
            <li>Promotes better posture and circulation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StretchingGame;
