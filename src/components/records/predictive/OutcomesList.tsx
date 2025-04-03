
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PredictedOutcome {
  outcome: string;
  probability: number;
  timeframe: string;
}

interface OutcomesListProps {
  outcomes: PredictedOutcome[];
}

export const OutcomesList = ({ outcomes }: OutcomesListProps) => {
  const getTrendIcon = (value: number) => {
    if (value > 0.7) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value > 0.3) return <TrendingUp className="h-4 w-4 text-amber-500" />;
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-2">
      {outcomes.map((outcome, index) => (
        <div key={index} className="bg-accent/30 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTrendIcon(outcome.probability)}
            <div>
              <p className="font-medium">{outcome.outcome}</p>
              <p className="text-xs text-muted-foreground">{outcome.timeframe}</p>
            </div>
          </div>
          <Badge variant="secondary">
            {Math.round(outcome.probability * 100)}% 
          </Badge>
        </div>
      ))}
    </div>
  );
};
