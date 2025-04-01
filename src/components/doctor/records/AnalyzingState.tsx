
import { Card, CardContent } from "@/components/ui/card";

const AnalyzingState = () => {
  return (
    <Card className="h-full flex items-center justify-center">
      <CardContent className="p-8 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <h3 className="font-medium text-lg mb-2">Analyzing Medical Record</h3>
        <p className="text-muted-foreground">
          Our AI is analyzing the medical record to provide insights and recommendations.
        </p>
      </CardContent>
    </Card>
  );
};

export default AnalyzingState;
