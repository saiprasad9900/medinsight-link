
import { cn } from "@/lib/utils";

interface RiskScoreIndicatorProps {
  score: number;
  level: "Low" | "Medium" | "High";
}

export const RiskScoreIndicator = ({ score, level }: RiskScoreIndicatorProps) => {
  const getRiskGradient = (score: number) => {
    if (score < 30) return "bg-gradient-to-r from-green-500 to-green-300";
    if (score < 70) return "bg-gradient-to-r from-amber-500 to-amber-300";
    return "bg-gradient-to-r from-red-500 to-red-300";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Risk Score</h4>
        <span className="text-xl font-bold">{score}%</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden bg-gray-200">
        <div 
          className={cn("h-full", getRiskGradient(score))} 
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
