
import { Button } from "@/components/ui/button";
import { Copy, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RecommendationListProps {
  recommendations: string[];
  patientName: string;
}

export const RecommendationList = ({ recommendations, patientName }: RecommendationListProps) => {
  const handleCopyRecommendations = () => {
    const text = `Recommendations for ${patientName}:\n\n${recommendations.map(rec => `- ${rec}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success("Recommendations copied to clipboard");
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Recommendations</h4>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleCopyRecommendations}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center mt-0.5",
              index % 3 === 0 ? "bg-red-100" : index % 3 === 1 ? "bg-amber-100" : "bg-green-100"
            )}>
              {index % 3 === 0 ? (
                <AlertCircle className="h-3 w-3 text-red-500" />
              ) : index % 3 === 1 ? (
                <AlertTriangle className="h-3 w-3 text-amber-500" />
              ) : (
                <CheckCircle className="h-3 w-3 text-green-500" />
              )}
            </div>
            <p className="text-sm">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
