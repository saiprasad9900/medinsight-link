
import { Progress } from "@/components/ui/progress";
import { FileSearch, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisLoadingProps {
  analyzing: boolean;
  analysisProgress: number;
  handleAnalyze: () => Promise<void>;
  recordType: string;
}

const AnalysisLoading = ({ 
  analyzing, 
  analysisProgress, 
  handleAnalyze,
  recordType
}: AnalysisLoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      {analyzing ? (
        <>
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <div className="w-full max-w-md space-y-2">
            <p className="text-center text-muted-foreground">Analyzing {recordType.toLowerCase()}...</p>
            <Progress value={analysisProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">{analysisProgress}% complete</p>
          </div>
        </>
      ) : (
        <>
          <FileSearch className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-medium text-lg">No Analysis Available</h3>
            <p className="text-muted-foreground mb-4">Analyze this record to get insights and recommendations</p>
            <Button onClick={handleAnalyze} disabled={analyzing} className="gap-2">
              <Activity className="h-4 w-4" />
              Analyze Record
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisLoading;
