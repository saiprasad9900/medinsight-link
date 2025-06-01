
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MindfulnessGameProps {
  onComplete: (score: number) => void;
}

const MindfulnessGame = ({ onComplete }: MindfulnessGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [responses, setResponses] = useState<number[]>([]);
  const [currentResponse, setCurrentResponse] = useState(5);

  const mindfulnessPrompts = [
    "Focus on your breathing. How does it feel?",
    "Notice the sounds around you. What do you hear?",
    "Feel the temperature of the air. Is it warm or cool?",
    "Notice any tension in your body. Where do you feel it?",
    "Observe your thoughts without judgment. What comes to mind?",
    "Feel your feet on the ground. How does it feel?",
    "Notice any scents in the air. What do you smell?",
    "Observe the light around you. Is it bright or dim?"
  ];

  const startGame = () => {
    setGameState("playing");
    setCurrentPrompt(0);
    setTimeLeft(30);
    setResponses([]);
    setCurrentResponse(5);
  };

  const handleResponse = () => {
    setResponses(prev => [...prev, currentResponse]);
    if (currentPrompt < mindfulnessPrompts.length - 1) {
      setCurrentPrompt(prev => prev + 1);
      setTimeLeft(30);
      setCurrentResponse(5);
    } else {
      setGameState("complete");
      const avgResponse = responses.reduce((a, b) => a + b, currentResponse) / (responses.length + 1);
      onComplete(Math.round(avgResponse));
    }
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleResponse();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentPrompt]);

  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Mindfulness Exercise</h3>
        <p className="text-muted-foreground">
          Practice mindful awareness by focusing on the present moment.
        </p>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={startGame} size="lg">Start Mindfulness Practice</Button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline">Prompt: {currentPrompt + 1}/8</Badge>
            <Badge variant="outline">Time: {timeLeft}s</Badge>
          </div>

          <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50">
            <h3 className="text-xl font-medium mb-6">{mindfulnessPrompts[currentPrompt]}</h3>
            <Progress value={((30 - timeLeft) / 30) * 100} className="w-full mb-4" />
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">How aware do you feel right now?</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <Button
                    key={rating}
                    variant={currentResponse === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentResponse(rating)}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
              <Button onClick={handleResponse} className="mt-4">Continue</Button>
            </div>
          </Card>
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Practice Complete!</h3>
          <p className="text-lg">Average Awareness Score: {Math.round(responses.reduce((a, b) => a + b, 0) / responses.length)}/10</p>
          <Button onClick={startGame}>Practice Again</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Health Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Reduces stress and anxiety</li>
            <li>Improves emotional regulation</li>
            <li>Enhances self-awareness</li>
            <li>Promotes mental clarity and focus</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindfulnessGame;
