
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ColorTherapyGameProps {
  onComplete: (score: number) => void;
}

const ColorTherapyGame = ({ onComplete }: ColorTherapyGameProps) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [currentColor, setCurrentColor] = useState("#4F46E5");
  const [colorName, setColorName] = useState("Indigo");
  const [sessionTime, setSessionTime] = useState(120);
  const [moodRating, setMoodRating] = useState(5);

  const colorTherapies = [
    { color: "#EF4444", name: "Red", mood: "Energizing", benefits: "Increases energy and circulation" },
    { color: "#F97316", name: "Orange", mood: "Uplifting", benefits: "Boosts creativity and enthusiasm" },
    { color: "#EAB308", name: "Yellow", mood: "Cheerful", benefits: "Improves mental clarity and focus" },
    { color: "#22C55E", name: "Green", mood: "Calming", benefits: "Reduces stress and promotes healing" },
    { color: "#3B82F6", name: "Blue", mood: "Peaceful", benefits: "Lowers blood pressure and anxiety" },
    { color: "#8B5CF6", name: "Purple", mood: "Spiritual", benefits: "Enhances meditation and intuition" },
    { color: "#EC4899", name: "Pink", mood: "Loving", benefits: "Promotes emotional healing and self-love" }
  ];

  const startGame = () => {
    setGameState("playing");
    setSessionTime(120);
    setMoodRating(5);
    cycleColors();
  };

  const cycleColors = () => {
    let index = 0;
    const interval = setInterval(() => {
      const therapy = colorTherapies[index % colorTherapies.length];
      setCurrentColor(therapy.color);
      setColorName(therapy.name);
      index++;
    }, 15000); // Change color every 15 seconds

    setTimeout(() => {
      clearInterval(interval);
      setGameState("complete");
      onComplete(moodRating);
    }, 120000); // 2 minutes total
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setSessionTime(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="max-w-md mx-auto text-center space-y-3">
        <h3 className="text-xl font-medium">Color Therapy Session</h3>
        <p className="text-muted-foreground">
          Immerse yourself in therapeutic colors to improve mood and reduce stress.
        </p>
      </div>
      
      {gameState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button onClick={startGame} size="lg">Start Color Therapy</Button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <Badge variant="outline">Time: {formatTime(sessionTime)}</Badge>
          </div>

          <div 
            className="w-full h-64 rounded-lg border transition-all duration-1000 flex items-center justify-center"
            style={{ backgroundColor: currentColor }}
          >
            <div className="text-center text-white drop-shadow-lg">
              <h2 className="text-4xl font-bold mb-2">{colorName}</h2>
              <p className="text-lg">Focus on this color and breathe deeply</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">How do you feel right now?</p>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <Button
                      key={rating}
                      variant={moodRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMoodRating(rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">1 = Very Stressed, 10 = Very Relaxed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Session Complete!</h3>
          <p className="text-lg">Final Mood Rating: {moodRating}/10</p>
          <Button onClick={startGame}>New Session</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Health Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Reduces stress and anxiety</li>
            <li>Improves mood and emotional well-being</li>
            <li>Enhances relaxation and meditation</li>
            <li>May help with seasonal depression</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorTherapyGame;
