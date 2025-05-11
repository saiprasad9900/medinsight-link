
import { useEffect, useState } from "react";
import { Loader, Dumbbell, Activity, Brain } from "lucide-react";

interface AiAnalysisAnimationProps {
  onComplete: () => void;
  analyzing: boolean;
  type?: "diet" | "exercise" | "both";
}

const AiAnalysisAnimation = ({ 
  onComplete, 
  analyzing, 
  type = "both" 
}: AiAnalysisAnimationProps) => {
  const [stage, setStage] = useState(0);
  const [dots, setDots] = useState("");
  
  // Control the animation flow
  useEffect(() => {
    if (!analyzing) return;
    
    const stages = type === "both" ? 5 : 3;
    const stageTimer = setTimeout(() => {
      if (stage < stages) {
        setStage(prev => prev + 1);
      } else {
        onComplete();
      }
    }, 1500);
    
    return () => clearTimeout(stageTimer);
  }, [stage, analyzing, onComplete, type]);
  
  // Animate the loading dots
  useEffect(() => {
    if (!analyzing) return;
    
    const dotsTimer = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + "." : "");
    }, 500);
    
    return () => clearInterval(dotsTimer);
  }, [analyzing]);
  
  if (!analyzing) return null;
  
  const dietStages = [
    "Analyzing your profile data",
    "Calculating nutritional requirements",
    "Generating personalized meal plans",
  ];
  
  const exerciseStages = [
    "Evaluating your fitness level",
    "Designing optimal workout routines",
    "Finalizing exercise recommendations",
  ];
  
  const getStageText = () => {
    if (type === "diet") return dietStages[Math.min(stage, dietStages.length - 1)];
    if (type === "exercise") return exerciseStages[Math.min(stage, exerciseStages.length - 1)];
    
    // For "both" type
    if (stage < 3) return dietStages[stage];
    return exerciseStages[stage - 3];
  };
  
  const getIcon = () => {
    if (type === "diet" || (type === "both" && stage < 3)) {
      return <Activity className="h-8 w-8 text-primary animate-pulse" />;
    } else {
      return <Dumbbell className="h-8 w-8 text-primary animate-pulse" />;
    }
  };
  
  const progress = type === "both" ? (stage / 5) * 100 : (stage / 3) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
      <div className="relative flex items-center justify-center">
        {getIcon()}
        <div className="absolute -inset-4 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">
          <Brain className="inline-block h-5 w-5 mr-2 text-primary animate-bounce" />
          AI Analysis in Progress
        </h3>
        <p className="text-muted-foreground">
          {getStageText()}{dots}
        </p>
      </div>
      
      <div className="w-full max-w-md bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AiAnalysisAnimation;
