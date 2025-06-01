
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileSearch, Microscope, Stethoscope, Activity, Zap } from "lucide-react";

interface AnalysisLoadingProps {
  analyzing: boolean;
  analysisProgress: number;
  handleAnalyze: () => void;
  recordType: string;
}

const AnalysisLoading = ({ analyzing, analysisProgress, handleAnalyze, recordType }: AnalysisLoadingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animatedIcons, setAnimatedIcons] = useState<number[]>([]);

  const analysisSteps = [
    { icon: FileSearch, text: "Scanning document structure...", duration: 15 },
    { icon: Brain, text: "Applying AI pattern recognition...", duration: 25 },
    { icon: Microscope, text: "Analyzing medical terminology...", duration: 35 },
    { icon: Stethoscope, text: "Cross-referencing clinical data...", duration: 50 },
    { icon: Activity, text: "Generating health insights...", duration: 75 },
    { icon: Zap, text: "Finalizing comprehensive analysis...", duration: 100 }
  ];

  useEffect(() => {
    if (analyzing) {
      const interval = setInterval(() => {
        setAnimatedIcons(prev => {
          const newAnimated = [...prev];
          const randomIndex = Math.floor(Math.random() * 6);
          if (!newAnimated.includes(randomIndex)) {
            newAnimated.push(randomIndex);
          }
          return newAnimated.slice(-3); // Keep only last 3 animated
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [analyzing]);

  useEffect(() => {
    const step = analysisSteps.findIndex(step => analysisProgress < step.duration);
    setCurrentStep(step === -1 ? analysisSteps.length - 1 : step);
  }, [analysisProgress]);

  if (!analyzing) {
    return (
      <Card className="p-8 border-dashed">
        <CardContent className="text-center space-y-4">
          <div className="relative">
            <Brain className="h-16 w-16 mx-auto text-primary animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          </div>
          <h3 className="text-xl font-semibold">AI Medical Analysis</h3>
          <p className="text-muted-foreground">
            Get comprehensive AI-powered insights about your {recordType.toLowerCase()}.
            Our advanced algorithms will analyze medical terminology, identify key findings, 
            and provide actionable health recommendations.
          </p>
          <Button onClick={handleAnalyze} size="lg" className="mt-4">
            <Brain className="mr-2 h-4 w-4" />
            Start AI Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Analyzing {recordType}</h3>
          <p className="text-muted-foreground">
            Our AI is performing comprehensive medical analysis...
          </p>
        </div>

        <div className="space-y-4">
          <Progress value={analysisProgress} className="w-full h-3" />
          <div className="text-center text-sm font-medium">
            {analysisProgress}% Complete
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {analysisSteps.slice(0, 6).map((step, index) => {
            const IconComponent = step.icon;
            const isActive = index <= currentStep;
            const isAnimated = animatedIcons.includes(index);
            
            return (
              <div 
                key={index}
                className={`text-center p-3 rounded-lg transition-all duration-500 ${
                  isActive ? 'bg-primary/10 text-primary' : 'bg-muted/30 text-muted-foreground'
                }`}
              >
                <IconComponent 
                  className={`h-8 w-8 mx-auto mb-2 transition-all duration-300 ${
                    isAnimated ? 'animate-bounce scale-110' : ''
                  } ${isActive ? 'text-primary' : 'text-muted-foreground'}`} 
                />
                <div className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  Step {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
          </div>
          <p className="text-sm text-muted-foreground">
            {analysisSteps[currentStep]?.text || "Processing..."}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
          <h4 className="font-medium text-sm mb-2">What we're analyzing:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Medical terminology and clinical findings</li>
            <li>• Laboratory values and reference ranges</li>
            <li>• Diagnostic patterns and correlations</li>
            <li>• Risk factors and health implications</li>
            <li>• Treatment recommendations and next steps</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisLoading;
