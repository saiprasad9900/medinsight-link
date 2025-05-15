
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface BreathingExerciseProps {
  onComplete: () => void;
}

const BreathingExercise = ({ onComplete }: BreathingExerciseProps) => {
  const [status, setStatus] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
  const [progress, setProgress] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [timer, setTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  const startExercise = () => {
    setStatus("inhale");
    setProgress(0);
    setCycles(0);
    setTotalTime(0);
    
    intervalRef.current = window.setInterval(() => {
      setTotalTime(prev => prev + 0.1);
    }, 100);
  };
  
  const stopExercise = () => {
    setStatus("idle");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (cycles >= 3) {
      onComplete();
    }
  };
  
  useEffect(() => {
    let progressInterval: number | null = null;
    
    if (status === "inhale") {
      setTimer(4);
      progressInterval = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / 40); // 4 seconds = 40 intervals of 100ms
          if (newProgress >= 100) {
            setStatus("hold");
            return 100;
          }
          return newProgress;
        });
      }, 100);
    } else if (status === "hold") {
      setTimer(7);
      progressInterval = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / 70); // 7 seconds = 70 intervals of 100ms
          if (newProgress <= 0) {
            setStatus("exhale");
            return 0;
          }
          return newProgress;
        });
      }, 100);
    } else if (status === "exhale") {
      setTimer(8);
      progressInterval = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / 80); // 8 seconds = 80 intervals of 100ms
          if (newProgress >= 100) {
            setCycles(prev => prev + 1);
            if (cycles + 1 >= 3) {
              stopExercise();
              return 100;
            } else {
              setStatus("inhale");
              return 0;
            }
          }
          return newProgress;
        });
      }, 100);
    }
    
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [status, cycles]);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const getInstructions = () => {
    switch (status) {
      case "inhale": return "Breathe in slowly...";
      case "hold": return "Hold your breath...";
      case "exhale": return "Breathe out slowly...";
      default: return "Press start to begin";
    }
  };
  
  const getCircleStyles = () => {
    if (status === "idle") {
      return "h-48 w-48 bg-blue-100 dark:bg-blue-950/30";
    }
    
    if (status === "inhale") {
      const size = 48 + ((progress / 100) * 24);
      return `h-${size} w-${size} bg-blue-200 dark:bg-blue-900/40 transition-all duration-100`;
    }
    
    if (status === "hold") {
      return "h-72 w-72 bg-purple-200 dark:bg-purple-900/40 transition-all duration-100";
    }
    
    if (status === "exhale") {
      const size = 72 - ((progress / 100) * 24);
      return `h-${size} w-${size} bg-green-200 dark:bg-green-900/40 transition-all duration-100`;
    }
    
    return "h-48 w-48";
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6">
      <div className="max-w-md text-center space-y-3">
        <h3 className="text-xl font-medium">4-7-8 Breathing Technique</h3>
        <p className="text-muted-foreground">
          This breathing pattern aims to reduce anxiety and help people get to sleep. Complete 3 cycles to finish the exercise.
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-6">
        <div 
          className={`rounded-full flex items-center justify-center ${status !== "idle" ? "animate-pulse" : ""}`}
          style={{
            height: status === "inhale" ? `${48 + ((progress / 100) * 24)}px` : 
                   status === "hold" ? "72px" : 
                   status === "exhale" ? `${72 - ((progress / 100) * 24)}px` : "48px",
            width: status === "inhale" ? `${48 + ((progress / 100) * 24)}px` : 
                  status === "hold" ? "72px" : 
                  status === "exhale" ? `${72 - ((progress / 100) * 24)}px` : "48px",
            backgroundColor: status === "inhale" ? "rgba(191, 219, 254, 0.5)" : 
                             status === "hold" ? "rgba(216, 180, 254, 0.5)" : 
                             status === "exhale" ? "rgba(187, 247, 208, 0.5)" : "rgba(219, 234, 254, 0.3)",
            transition: "all 0.1s ease"
          }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold">{status !== "idle" ? Math.ceil(timer - (progress / (100 / timer))) : ""}</h3>
            <p className="text-sm font-medium">{getInstructions()}</p>
          </div>
        </div>
        
        <div className="w-full max-w-sm">
          <Progress value={status !== "idle" ? progress : 0} className="h-2" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Button 
            onClick={status === "idle" ? startExercise : stopExercise}
            variant={status === "idle" ? "default" : "destructive"}
          >
            {status === "idle" ? "Start Breathing Exercise" : "Stop Exercise"}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {status !== "idle" && (
              <>Cycles: {cycles}/3 • Time: {totalTime.toFixed(1)}s</>
            )}
          </div>
        </div>
      </div>
      
      <Card className="max-w-md p-4 mt-6">
        <h4 className="font-semibold mb-2">Health Benefits:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Reduces anxiety and stress</li>
          <li>Helps control breathing patterns</li>
          <li>Promotes better sleep</li>
          <li>Decreases heart rate and blood pressure</li>
          <li>Improves focus and concentration</li>
        </ul>
      </Card>
    </div>
  );
};

export default BreathingExercise;
